// lib/get-current-profile.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentProfile(opts?: { syncPlanKey?: string }) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Not authenticated");
    }

    const profile = await prisma.userProfile.findUnique({
        where: { clerkUserId: userId },
    });

    if (!profile) {
        // In theory shouldn't happen because ensureUserProfile ran already
        throw new Error("User profile not found");
    }

    if (opts?.syncPlanKey && profile.plan !== opts.syncPlanKey) {
        const updated = await prisma.userProfile.update({
            where: { id: profile.id },
            data: { plan: opts.syncPlanKey },
        });
        return updated;
    }

    return profile;
}
