// lib/get-current-profile.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getBillingEntitlements } from "@/lib/billing/entitlements";

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

    // Always sync plan from Clerk billing to ensure it's up-to-date
    const entitlements = await getBillingEntitlements();
    const expectedPlan = entitlements.isPro ? "pro" : "free";

    // If plan doesn't match, update it
    if (profile.plan !== expectedPlan) {
        const updated = await prisma.userProfile.update({
            where: { id: profile.id },
            data: { plan: expectedPlan },
        });
        return updated;
    }

    // Legacy: if syncPlanKey is explicitly provided and doesn't match, update
    // (This is a fallback, but we prefer syncing from entitlements above)
    if (opts?.syncPlanKey && profile.plan !== opts.syncPlanKey) {
        const updated = await prisma.userProfile.update({
            where: { id: profile.id },
            data: { plan: opts.syncPlanKey },
        });
        return updated;
    }

    return profile;
}
