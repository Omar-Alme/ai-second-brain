"use server";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getBillingEntitlements } from "@/lib/billing/entitlements";

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME = [
    "application/pdf",
] as const;

function isAllowedMime(mimeType: string) {
    if (mimeType.startsWith("image/")) return true;
    if (mimeType.startsWith("audio/")) return true;
    return (ALLOWED_MIME as readonly string[]).includes(mimeType);
}

function sanitizeFilename(name: string) {
    return name
        .trim()
        .replace(/[^\w.\- ]+/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 120) || "file";
}

function parseSupabasePublicObjectPath(inputUrl: string) {
    try {
        const u = new URL(inputUrl);
        // matches: /storage/v1/object/public/<bucket>/<path>
        const marker = "/storage/v1/object/public/";
        const idx = u.pathname.indexOf(marker);
        if (idx === -1) return null;
        const after = u.pathname.slice(idx + marker.length);
        const parts = after.split("/");
        if (parts.length < 2) return null;
        const bucket = parts[0]!;
        const path = parts.slice(1).join("/");
        return { bucket, path };
    } catch {
        return null;
    }
}

export async function createMediaFileAction(input: {
    name: string;
    url: string;
    mimeType: string;
    size: number;
}) {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });
    const name = input.name.trim();

    if (!name) throw new Error("Name is required");
    if (!input.url) throw new Error("URL is required");
    if (!isAllowedMime(input.mimeType)) throw new Error("Unsupported file type");
    if (!Number.isFinite(input.size) || input.size <= 0) throw new Error("Invalid file size");

    return await prisma.mediaFile.create({
        data: {
            userId: profile.id,
            name,
            url: input.url,
            mimeType: input.mimeType,
            size: input.size,
        },
        select: {
            id: true,
            userId: true,
            name: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
        },
    });
}

export async function getMediaFilesAction() {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });
    return await prisma.mediaFile.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            userId: true,
            name: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
        },
    });
}

export async function deleteMediaFileAction(input: { mediaId: string }) {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });
    const media = await prisma.mediaFile.findFirst({
        where: { id: input.mediaId, userId: profile.id },
        select: { id: true, url: true },
    });
    if (!media) throw new Error("Media file not found");

    // Best-effort storage deletion (if URL looks like a Supabase public URL)
    try {
        const parsed = parseSupabasePublicObjectPath(media.url);
        if (parsed) {
            const supabase = getSupabaseAdmin();
            await supabase.storage.from(parsed.bucket).remove([parsed.path]);
        }
    } catch (e) {
        console.warn("[deleteMediaFileAction] Failed to delete from storage:", e);
    }

    await prisma.mediaFile.delete({ where: { id: media.id } });
}

export async function deleteMediaFilesAction(input: { ids: string[] }) {
    const { ids } = input;
    if (ids.length === 0) return;
    
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });
    
    // Fetch all media files to delete from storage
    const mediaFiles = await prisma.mediaFile.findMany({
        where: {
            id: { in: ids },
            userId: profile.id,
        },
        select: { id: true, url: true },
    });

    // Best-effort storage deletion for each file
    const supabase = getSupabaseAdmin();
    for (const media of mediaFiles) {
        try {
            const parsed = parseSupabasePublicObjectPath(media.url);
            if (parsed) {
                await supabase.storage.from(parsed.bucket).remove([parsed.path]);
            }
        } catch (e) {
            console.warn(`[deleteMediaFilesAction] Failed to delete ${media.id} from storage:`, e);
        }
    }

    await prisma.mediaFile.deleteMany({
        where: {
            id: { in: ids },
            userId: profile.id,
        },
    });
}

export async function uploadMediaFileAction(formData: FormData) {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });

    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");

    if (!isAllowedMime(file.type)) throw new Error("Unsupported file type");
    if (file.size > MAX_BYTES) throw new Error("File too large");

    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
    const safeName = sanitizeFilename(file.name);
    const objectPath = `${profile.id}/${crypto.randomUUID()}-${safeName}`;

    const supabase = getSupabaseAdmin();
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(objectPath, body, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    const url = data.publicUrl;

    return await prisma.mediaFile.create({
        data: {
            userId: profile.id,
            name: safeName,
            url,
            mimeType: file.type,
            size: file.size,
        },
        select: {
            id: true,
            userId: true,
            name: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
        },
    });
}

async function enforceStorageLimitOrThrow(input: { userId: string; sizeToAddBytes: number }) {
    const entitlements = await getBillingEntitlements();
    const limitGb = entitlements.storageLimitGb;

    if (limitGb === null) return;

    const storageAgg = await prisma.mediaFile.aggregate({
        where: { userId: input.userId },
        _sum: { size: true },
    });

    const usedBytes = storageAgg._sum.size ?? 0;
    const limitBytes = limitGb * 1024 * 1024 * 1024;

    if (usedBytes + input.sizeToAddBytes > limitBytes) {
        throw new Error(`Storage limit reached (${limitGb}GB). Upgrade to Pro for more storage.`);
    }
}

/**
 * Creates a signed upload URL so the browser can upload directly to Supabase Storage
 * (avoids Vercel Server Actions body limits).
 */
export async function createSignedMediaUploadUrlAction(input: {
    filename: string;
    mimeType: string;
    size: number;
}) {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });

    const filename = input.filename ?? "";
    if (!filename.trim()) throw new Error("Filename is required");
    if (!isAllowedMime(input.mimeType)) throw new Error("Unsupported file type");
    if (!Number.isFinite(input.size) || input.size <= 0) throw new Error("Invalid file size");
    if (input.size > MAX_BYTES) throw new Error("File too large");

    await enforceStorageLimitOrThrow({ userId: profile.id, sizeToAddBytes: input.size });

    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media";
    const safeName = sanitizeFilename(filename);
    const objectPath = `${profile.id}/${crypto.randomUUID()}-${safeName}`;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(objectPath);
    if (error) throw new Error(error.message);
    if (!data?.token || !data?.path) throw new Error("Failed to create signed upload URL");

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;

    return {
        bucket,
        objectPath: data.path,
        token: data.token,
        publicUrl,
        name: safeName,
        mimeType: input.mimeType,
        size: input.size,
    };
}

/**
 * After the browser successfully uploads to Storage, call this to persist the DB record.
 */
export async function finalizeMediaUploadAction(input: {
    bucket?: string;
    objectPath: string;
    name: string;
    mimeType: string;
    size: number;
}) {
    const entitlements = await getBillingEntitlements();
    const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });

    const bucket = input.bucket ?? process.env.SUPABASE_STORAGE_BUCKET ?? "media";
    const name = input.name.trim();

    if (!name) throw new Error("Name is required");
    if (!input.objectPath) throw new Error("Missing object path");
    if (!input.objectPath.startsWith(`${profile.id}/`)) throw new Error("Invalid upload path");
    if (!isAllowedMime(input.mimeType)) throw new Error("Unsupported file type");
    if (!Number.isFinite(input.size) || input.size <= 0) throw new Error("Invalid file size");
    if (input.size > MAX_BYTES) throw new Error("File too large");

    await enforceStorageLimitOrThrow({ userId: profile.id, sizeToAddBytes: input.size });

    const supabase = getSupabaseAdmin();
    const url = supabase.storage.from(bucket).getPublicUrl(input.objectPath).data.publicUrl;

    return await prisma.mediaFile.create({
        data: {
            userId: profile.id,
            name,
            url,
            mimeType: input.mimeType,
            size: input.size,
        },
        select: {
            id: true,
            userId: true,
            name: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
        },
    });
}


