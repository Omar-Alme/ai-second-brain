// lib/get-current-profile.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentProfile() {
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

    return profile;
}
