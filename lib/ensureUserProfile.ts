// lib/ensureUserProfile.ts
import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function ensureUserProfile() {
    const user = await currentUser();

    if (!user) {
        console.warn('[ensureUserProfile] No Clerk user found');
        return null;
    }

    const clerkUserId = user.id;

    try {
        const email =
            user.emailAddresses[0]?.emailAddress ??
            `${clerkUserId}@no-email.local`;

        const profile = await prisma.userProfile.upsert({
            where: { clerkUserId },
            update: {
                email,               // keep email in sync
                name: user.fullName,
                imageUrl: user.imageUrl,
            },
            create: {
                clerkUserId,
                email,
                name: user.fullName,
                imageUrl: user.imageUrl,
                // plan defaults to "free"
            },
        });

        return profile;
    } catch (err) {
        console.error('[ensureUserProfile] Error upserting profile:', err);
        return null;
    }
}
