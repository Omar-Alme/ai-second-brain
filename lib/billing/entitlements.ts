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

  /**
   * Pro plan:
   * For MVP, Pro should remove Free limitations even if Clerk "features" are not configured.
   * Clerk feature slugs can still be used for optional toggles later, but Pro must be usable immediately.
   */
  return {
    planKey,
    planId,
    subscriptionId,
    subscriptionStatus,
    featureSlugs,
    isPro: true,
    canExport: BILLING_CONFIG.limits.pro.exportEnabled,
    canUseAI: BILLING_CONFIG.limits.pro.aiMessagesPerMonth > 0,
    notesLimit: null,
    canvasesLimit: null,
    aiMessagesLimit: BILLING_CONFIG.limits.pro.aiMessagesPerMonth,
    storageLimitGb: BILLING_CONFIG.limits.pro.storageLimitGb,
  };
}

/**
 * Fetches the current authenticated user's Clerk subscription and returns a normalized
 * entitlements object.
 *
 * Server-only (uses `clerkClient`).
 */
export async function getBillingEntitlements(): Promise<BillingEntitlements> {
  const { userId, has } = await auth();
  if (!userId) {
    return computeEntitlementsFromPlan({
      planKey: BILLING_CONFIG.planKeys.free,
      planId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      featureSlugs: [],
    });
  }

  // Prefer Clerk's server-side plan check (fast + consistent), like `has({ plan: "pro" })`.
  // This avoids cases where billing subscription APIs are delayed/cached or plan slugs differ.
  const hasPro =
    typeof has === "function"
      ? has({ plan: BILLING_CONFIG.planKeys.pro as BillingPlanKey })
      : false;

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
    const planKey = hasPro ? BILLING_CONFIG.planKeys.pro : (plan?.slug ?? BILLING_CONFIG.planKeys.free);
    const featureSlugs = plan?.features?.map((f) => f.slug) ?? [];

    return computeEntitlementsFromPlan({
      planKey,
      planId: plan?.id ?? activeItem?.planId ?? null,
      subscriptionId: subscription.id ?? null,
      subscriptionStatus: subscription.status ?? null,
      featureSlugs,
    });
  } catch {
    // If Billing isn't configured or API fails, fall back to `has({ plan })`.
    return computeEntitlementsFromPlan({
      planKey: hasPro ? BILLING_CONFIG.planKeys.pro : BILLING_CONFIG.planKeys.free,
      planId: null,
      subscriptionId: null,
      subscriptionStatus: null,
      featureSlugs: [],
    });
  }
}


