"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { renderCanvas } from "@/components/ui/canvas";

export function Hero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-28">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          {/* Top pill */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Introducing Noma — calm second brain</span>
            <a
              href="#features"
              className="ml-1 inline-flex items-center font-semibold text-foreground hover:text-primary transition-colors"
            >
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>

          {/* Frame */}
          <div className="relative mx-auto w-full max-w-6xl rounded-3xl border border-border bg-white/60 p-6 shadow-[0_24px_80px_-50px_rgba(0,0,0,0.25)] backdrop-blur md:p-12">
            {/* corner plus icons */}
            <Plus className="absolute -left-4 -top-4 h-8 w-8 text-primary/70" />
            <Plus className="absolute -right-4 -top-4 h-8 w-8 text-primary/70" />
            <Plus className="absolute -left-4 -bottom-4 h-8 w-8 text-primary/70" />
            <Plus className="absolute -right-4 -bottom-4 h-8 w-8 text-primary/70" />

            <h1 className="select-none text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your calm space for thinking, notes, and ideas.
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Capture thoughts, connect knowledge, and build clarity — in a focused workspace
              designed for deep work.
            </p>

            {/* Status */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-25" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs text-emerald-600">Available now</p>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-7 bg-white/70 hover:bg-white"
              >
                <a href="#pricing">See pricing</a>
              </Button>
            </div>
          </div>

          {/* Sub line */}
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required • Clean UI • Built for focus
          </p>
        </div>
      </div>

      {/* Canvas background */}
      <canvas
        id="canvas"
        className="pointer-events-none absolute inset-0 -z-0 h-full w-full"
      />
    </section>
  );
}
