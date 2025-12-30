"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpgradeToProButton } from "@/components/billing/upgrade-to-pro-button";
import { useBilling } from "@/hooks/use-billing";
import { Sparkles } from "lucide-react";

export function AiComposer() {
  const billing = useBilling();
  const [value, setValue] = useState("");

  const { remaining, blocked, limitLabel } = useMemo(() => {
    if (billing.status !== "ready" || !billing.entitlements || !billing.usage) {
      return { remaining: null as number | null, blocked: false, limitLabel: "…" };
    }

    const limit = billing.entitlements.aiMessagesLimit;
    const used = billing.usage.aiMessagesUsed;
    const rem = Math.max(0, limit - used);

    return {
      remaining: rem,
      blocked: rem <= 0,
      limitLabel: billing.entitlements.isPro ? "per month" : "total",
    };
  }, [billing.entitlements, billing.status, billing.usage]);

  return (
    <div className="rounded-3xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Assistant</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {billing.status === "ready" && remaining !== null
              ? `${remaining} messages remaining (${limitLabel})`
              : "Loading your plan…"}
          </p>
        </div>

        {blocked && (
          <UpgradeToProButton className="rounded-full" />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={blocked ? "Upgrade to keep using AI" : "Ask Noma…"}
          disabled={blocked}
        />
        <Button
          className="rounded-full"
          disabled={blocked || !value.trim()}
          title={blocked ? "AI quota reached. Upgrade to Pro for higher limits." : undefined}
          onClick={() => {
            // Demo only: chat is not implemented yet in this repo.
            setValue("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}


