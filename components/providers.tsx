"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { CLERK_APPEARANCE } from "@/lib/clerk/appearance";
import { Toaster } from "@/components/ui/sonner";

export function Providers(props: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ClerkProvider
        appearance={CLERK_APPEARANCE}
        signInFallbackRedirectUrl="/workspace"
        afterSignOutUrl="/"
      >
        {props.children}
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  );
}


