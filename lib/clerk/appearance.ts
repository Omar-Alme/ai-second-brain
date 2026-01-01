import type { Appearance } from "@clerk/types";
import { shadcn } from "@clerk/themes";

/**
 * Centralized Clerk appearance that follows our shadcn theme tokens.
 * Uses Tailwind classes (dark variants work automatically via `.dark`).
 */
export const CLERK_APPEARANCE: Appearance = {
  // Clerk shadcn theme adapts to light/dark automatically when using `@clerk/themes/shadcn.css`.
  // See: https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/themes
  theme: shadcn,
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorBackground: "hsl(var(--background))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    borderRadius: "var(--radius)",
  },
  elements: {
    // Layout
    card: "rounded-3xl border border-border bg-background/80 backdrop-blur p-6 shadow-sm",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    // Inputs
    formFieldLabel: "text-xs text-muted-foreground",
    formFieldInput:
      "rounded-xl border border-border bg-background text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Buttons/links
    formButtonPrimary:
      "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    socialButtonsBlockButton:
      "rounded-full border border-border bg-background hover:bg-muted shadow-sm",
    footerActionLink: "text-primary hover:underline underline-offset-4",
    // Divider
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
  },
};


