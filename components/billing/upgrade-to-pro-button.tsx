"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { BILLING_CONFIG } from "@/lib/billing/config";
import { toast } from "sonner";

const BILLING_REFRESH_EVENT = "noma:billing-refresh";

async function syncBilling() {
  try {
    // Force sync on server side
    await fetch("/api/billing/sync", { method: "POST" });
  } catch (err) {
    console.error("[UpgradeToProButton] Failed to sync billing:", err);
  }
  // Also trigger client-side refresh
  window.dispatchEvent(new Event(BILLING_REFRESH_EVENT));
}

async function waitForBillingUpdate(maxRetries = 5, delayMs = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    
    try {
      // Check if billing has updated by fetching entitlements
      const res = await fetch("/api/billing/entitlements", {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
      });
      
      if (res.ok) {
        const data = await res.json();
        // If we're now on pro, we're done
        if (data.entitlements?.isPro) {
          return true;
        }
      }
    } catch (err) {
      console.error("[UpgradeToProButton] Error checking billing status:", err);
    }
    
    // Trigger refresh on each attempt
    syncBilling();
  }
  
  // Final refresh attempt
  syncBilling();
  return false;
}

export function UpgradeToProButton(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  const planId = BILLING_CONFIG.clerkPlanIds.pro;
  const router = useRouter();

  return (
    <>
      <SignedOut>
        <Button asChild className={props.className}>
          <Link href="/sign-up">Upgrade to Pro</Link>
        </Button>
      </SignedOut>

      <SignedIn>
        {planId ? (
          <CheckoutButton
            planId={planId}
            onSubscriptionComplete={async () => {
              toast.loading("Upgrading…", { id: "billing-upgrade" });
              // Wait for Clerk to process the subscription and retry until we see pro status
              const ok = await waitForBillingUpdate();
              if (ok) toast.success("You’re now on Pro 🎉", { id: "billing-upgrade" });
              else toast.success("Upgrade complete (syncing…)", { id: "billing-upgrade" });
              // Force router refresh to update server components
              router.refresh();
            }}
          >
            <Button className={props.className}>{props.children ?? "Upgrade to Pro"}</Button>
          </CheckoutButton>
        ) : (
          <Button className={props.className} disabled title="Missing NEXT_PUBLIC_CLERK_PRO_PLAN_ID">
            {props.children ?? "Upgrade to Pro"}
          </Button>
        )}
      </SignedIn>
    </>
  );
}


