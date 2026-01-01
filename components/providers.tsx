"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { dark, shadcn } from "@clerk/themes";
import useCurrentTheme from "@/hooks/use-current-theme";


export function Providers(props: {
  children: React.ReactNode;
}) {
  const currentTheme = useCurrentTheme();
  return (
    <ClerkProvider
      appearance={{
        baseTheme: currentTheme === "dark" ? [shadcn, dark] : shadcn,
        elements: {
          userButton: "rounded-md!",
          userButtonAvatarBox: "rounded-md! size-7!",
          userButtonTrigger: "rounded-md!",
        },
      }}
      signInFallbackRedirectUrl="/workspace"
      afterSignOutUrl="/"
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster />
        {props.children}
      </ThemeProvider>
    </ClerkProvider>
  );
}


