import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function ensureUserProfile() {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    const clerkUserId = user.id;

    const existing = await prisma.userProfile.findUnique({
        where: { clerkUserId },
    });

    if (existing) return existing;

    const email =
        user.emailAddresses[0]?.emailAddress ??
        `${clerkUserId}@no-email.local`;

    const profile = await prisma.userProfile.create({
        data: {
            clerkUserId,
            email,
            name: user.fullName,
            imageUrl: user.imageUrl,
            // plan will default to "free"
        },
    });

    return profile;
}
