"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Returns the resolved theme ("light" | "dark") using next-themes.
 * If the user selected "system", we return the system theme.
 */
export default function useCurrentTheme(): "light" | "dark" {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return "light";

  if (theme === "dark" || theme === "light") return theme;
  return systemTheme === "dark" ? "dark" : "light";
}


