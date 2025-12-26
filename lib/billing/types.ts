export type BillingEntitlements = {
  /** Clerk plan slug (or "free" when no active subscription). */
  planKey: string;
  /** Clerk plan id for the active subscription, if any */
  planId: string | null;
  /** Clerk subscription id, if any */
  subscriptionId: string | null;
  /** Clerk subscription status, if any */
  subscriptionStatus: string | null;
  /** Feature slugs enabled on the active plan (Clerk source of truth) */
  featureSlugs: string[];

  // Convenience booleans
  isPro: boolean;
  canExport: boolean;
  canUseAI: boolean;

  // Limits (derived from config + plan)
  notesLimit: number | null; // null = unlimited
  canvasesLimit: number | null; // null = unlimited
  aiMessagesLimit: number; // Free = total, Pro = per-month
  storageLimitGb: number;
};

export type BillingUsage = {
  notesUsed: number;
  canvasesUsed: number;
  /**
   * Current usage against `aiMessagesLimit`.
   * For Free: lifetime total. For Pro: current month total.
   */
  aiMessagesUsed: number;
  /**
   * Total bytes stored in Media (sum of `MediaFile.size`).
   * Used for gating uploads by storage limit.
   */
  storageUsedBytes: number;
};

export type BillingSnapshot = {
  entitlements: BillingEntitlements;
  usage: BillingUsage;
};


