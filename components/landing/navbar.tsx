"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-24px))]">
      <div
        className={cn(
          "flex items-center justify-between rounded-full border px-4 sm:px-6 py-3",
          "transition-all duration-300 bg-white/70 backdrop-blur-md",
          scrolled
            ? "shadow-lg border-border"
            : "shadow-sm border-border/60"
        )}
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Noma
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SignedOut>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/workspace">Go to Workspace</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
