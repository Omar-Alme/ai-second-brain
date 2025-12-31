"use client";

import { PricingTable } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";
import useCurrentTheme from "@/hooks/use-current-theme";

export function ThemedPricingTable() {
  const currentTheme = useCurrentTheme();

  return (
    <PricingTable
      appearance={{
        baseTheme: currentTheme === "dark" ? [shadcn, dark] : shadcn,
        elements: {
          rootBox: "w-full",
          // Match the pattern you used previously (solid card, no heavy shadow).
          pricingTableCard: "border shadow-none rounded-lg bg-card",
        },
      }}
    />
  );
}


