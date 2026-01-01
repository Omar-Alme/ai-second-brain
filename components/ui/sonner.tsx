"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme, systemTheme } = useTheme();

  const resolvedTheme =
    theme === "system" ? (systemTheme ?? "light") : (theme ?? "light");

  return (
    <Sonner
      theme={resolvedTheme as "light" | "dark"}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-border bg-background text-foreground shadow-sm rounded-2xl",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
    />
  );
}


