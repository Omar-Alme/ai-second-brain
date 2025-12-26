"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { BILLING_CONFIG } from "@/lib/billing/config";

const BILLING_REFRESH_EVENT = "noma:billing-refresh";

export function UpgradeToProButton(props: {
  className?: string;
  children?: React.ReactNode;
}) {
  const planId = BILLING_CONFIG.clerkPlanIds.pro;

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
            onSubscriptionComplete={() => {
              // Nudge any mounted billing hooks to re-fetch entitlements/usage.
              window.dispatchEvent(new Event(BILLING_REFRESH_EVENT));
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


