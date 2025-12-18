import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { HomeFeed } from "@/components/workspace/home-feed";

function mediaKindLabel(mimeType: string) {
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("audio/")) return "Audio";
    return "Media";
}

export default async function WorkspaceHomePage() {
    let profile: Awaited<ReturnType<typeof getCurrentProfile>>;
    try {
        profile = await getCurrentProfile();
    } catch {
        notFound();
    }

    const [notes, canvases, mediaFiles] = await Promise.all([
        prisma.note.findMany({
            where: { userId: profile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
            take: 50,
        }),
        prisma.canvas.findMany({
            where: { userId: profile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
            take: 50,
        }),
        prisma.mediaFile.findMany({
            where: { userId: profile.id },
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, url: true, mimeType: true, size: true, createdAt: true },
            take: 50,
        }),
    ]);

    const items = [
        ...notes.map((n) => ({
            id: n.id,
            title: n.title || "Untitled Note",
            kind: "Notes" as const,
            href: `/workspace/notes/${n.id}`,
            tagLabel: "Notes",
            activityAtMs: n.updatedAt.getTime(),
        })),
        ...canvases.map((c) => ({
            id: c.id,
            title: c.title || "Untitled Canvas",
            kind: "Canvas" as const,
            href: `/workspace/canvas/${c.id}`,
            tagLabel: "Canvas",
            activityAtMs: c.updatedAt.getTime(),
        })),
        ...mediaFiles.map((m) => ({
            id: m.id,
            title: m.name,
            kind: "Media" as const,
            href: `/workspace/media?preview=${m.id}`,
            tagLabel: mediaKindLabel(m.mimeType),
            activityAtMs: m.createdAt.getTime(),
            media: {
                url: m.url,
                mimeType: m.mimeType,
                size: m.size,
            },
        })),
    ].sort((a, b) => b.activityAtMs - a.activityAtMs);

    return <HomeFeed items={items} nowMs={new Date().getTime()} />;
}
