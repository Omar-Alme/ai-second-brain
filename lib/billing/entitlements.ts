import { auth, clerkClient } from "@clerk/nextjs/server";
import { BILLING_CONFIG, type BillingPlanKey, type ClerkFeatureSlug } from "@/lib/billing/config";
import type { BillingEntitlements } from "@/lib/billing/types";

function uniqueStrings(arr: string[]) {
  return Array.from(new Set(arr));
}

function includesFeature(featureSlugs: string[], slug: ClerkFeatureSlug): boolean {
  return featureSlugs.includes(slug);
}

function computeEntitlementsFromPlan(input: {
  planKey: string;
  planId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  featureSlugs: string[];
}): BillingEntitlements {
  const { planKey, planId, subscriptionId, subscriptionStatus } = input;
  const featureSlugs = uniqueStrings(input.featureSlugs);

  const isPro = planKey === BILLING_CONFIG.planKeys.pro;

  // Free plan: implicit (no subscription)
  if (!isPro) {
    return {
      planKey: BILLING_CONFIG.planKeys.free,
      planId,
      subscriptionId,
      subscriptionStatus,
      featureSlugs,
      isPro: false,
      canExport: false,
      canUseAI: BILLING_CONFIG.limits.free.aiMessagesTotal > 0,
      notesLimit: BILLING_CONFIG.limits.free.notesMax,
      canvasesLimit: BILLING_CONFIG.limits.free.canvasesMax,
      aiMessagesLimit: BILLING_CONFIG.limits.free.aiMessagesTotal,
      storageLimitGb: BILLING_CONFIG.limits.free.storageLimitGb,
    };
  }

  // Pro plan: "unlimited" notes/canvases come from feature presence in Clerk.
  const notesUnlimited = includesFeature(featureSlugs, BILLING_CONFIG.featureSlugs.notes);
  const canvasesUnlimited = includesFeature(featureSlugs, BILLING_CONFIG.featureSlugs.canvases);

  const aiEnabled = includesFeature(featureSlugs, BILLING_CONFIG.featureSlugs.aiMessagesPerMonth);
  const exportEnabled =
    includesFeature(featureSlugs, BILLING_CONFIG.featureSlugs.export) &&
    BILLING_CONFIG.limits.pro.exportEnabled;

  const storageEnabled = includesFeature(featureSlugs, BILLING_CONFIG.featureSlugs.storageGb);

  return {
    planKey,
    planId,
    subscriptionId,
    subscriptionStatus,
    featureSlugs,
    isPro: true,
    canExport: exportEnabled,
    canUseAI: aiEnabled && BILLING_CONFIG.limits.pro.aiMessagesPerMonth > 0,
    notesLimit: notesUnlimited ? null : BILLING_CONFIG.limits.free.notesMax,
    canvasesLimit: canvasesUnlimited ? null : BILLING_CONFIG.limits.free.canvasesMax,
    aiMessagesLimit: aiEnabled ? BILLING_CONFIG.limits.pro.aiMessagesPerMonth : 0,
    storageLimitGb: storageEnabled ? BILLING_CONFIG.limits.pro.storageLimitGb : 0,
  };
}

/**
 * Fetches the current authenticated user's Clerk subscription and returns a normalized
 * entitlements object.
 *
 * Server-only (uses `clerkClient`).
 */
export async function getBillingEntitlements(): Promise<BillingEntitlements> {
  const { userId } = await auth();
  if (!userId) {
    return computeEntitlementsFromPlan({
      planKey: BILLING_CONFIG.planKeys.free,
      planId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      featureSlugs: [],
    });
  }

  const clerk = await clerkClient();

  try {
    const subscription = await clerk.billing.getUserBillingSubscription(userId);

    // Clerk can return subscription even if upcoming/past_due; we consider active items as "paid".
    const activeItem =
      subscription.subscriptionItems.find((i) => i.status === "active") ??
      subscription.subscriptionItems.find((i) => i.status === "past_due") ??
      subscription.subscriptionItems.find((i) => i.status === "upcoming") ??
      null;

    const plan = activeItem?.plan ?? null;
    const planKey = plan?.slug ?? BILLING_CONFIG.planKeys.free;
    const featureSlugs = plan?.features?.map((f) => f.slug) ?? [];

    return computeEntitlementsFromPlan({
      planKey,
      planId: plan?.id ?? activeItem?.planId ?? null,
      subscriptionId: subscription.id ?? null,
      subscriptionStatus: subscription.status ?? null,
      featureSlugs,
    });
  } catch {
    // If Billing isn't configured or user has no subscription, treat as Free.
    return computeEntitlementsFromPlan({
      planKey: BILLING_CONFIG.planKeys.free,
      planId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      featureSlugs: [],
    });
  }
}


