export const BILLING_CONFIG = {
  /** Clerk plan slug/key */
  planKeys: {
    free: "free",
    pro: "pro",
  },

  /**
   * Clerk Feature slugs configured in the Clerk Dashboard.
   * Keep all "magic strings" here.
   */
  featureSlugs: {
    notes: "notes",
    canvases: "canvases",
    aiMessagesPerMonth: "ai_messages_per_month",
    storageGb: "storage_gb",
    export: "export",
  },

  /**
   * Clerk Plan IDs (used by `<CheckoutButton />`).
   * These are instance-specific, so they come from env vars.
   *
   * Set `NEXT_PUBLIC_CLERK_PRO_PLAN_ID` in `.env.local`.
   */
  clerkPlanIds: {
    pro: process.env.NEXT_PUBLIC_CLERK_PRO_PLAN_ID ?? "",
  },

  /**
   * Local fallback logic / defaults for limits.
   * Clerk plan features are used as *entitlements* (on/off); numeric values live here.
   */
  limits: {
    free: {
      notesMax: 10,
      canvasesMax: 2,
      aiMessagesTotal: 5,
      storageLimitGb: 1,
      exportEnabled: false,
    },
    pro: {
      // Notes/canvases are "unlimited" by feature presence.
      aiMessagesPerMonth: 300,
      storageLimitGb: 5,
      exportEnabled: true,
    },
  },
} as const;

export type BillingPlanKey =
  (typeof BILLING_CONFIG.planKeys)[keyof typeof BILLING_CONFIG.planKeys];

export type ClerkFeatureSlug =
  (typeof BILLING_CONFIG.featureSlugs)[keyof typeof BILLING_CONFIG.featureSlugs];


