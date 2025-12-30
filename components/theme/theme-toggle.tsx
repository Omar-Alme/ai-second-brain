"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle(props: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={props.className}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next = (mounted ? (resolvedTheme === "dark" ? "light" : "dark") : theme) ?? "light";
        setTheme(next);
      }}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}


