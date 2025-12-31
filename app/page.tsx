"use client";

import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Sparkles,
  GraduationCap,
  PenTool,
  Wrench,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { ThemedPricingTable } from "@/components/billing/themed-pricing-table";
import { Testimonials3D } from "@/components/landing/testimonials-3d";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import HoverFooter from "@/components/ui/hover-footer";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Features as Features8 } from "@/components/blocks/features-8";
import DisplayCards from "@/components/ui/display-cards";

const logos = [
  {
    src: "https://svgl.app/library/nvidia-wordmark-light.svg",
    alt: "Nvidia Logo",
  },
  {
    src: "https://svgl.app/library/supabase_wordmark_light.svg",
    alt: "Supabase Logo",
  },
  {
    src: "https://svgl.app/library/openai_wordmark_light.svg",
    alt: "OpenAI Logo",
  },
  {
    src: "https://svgl.app/library/turso-wordmark-light.svg",
    alt: "Turso Logo",
  },
  {
    src: "https://svgl.app/library/vercel_wordmark.svg",
    alt: "Vercel Logo",
  },
  {
    src: "https://svgl.app/library/github_wordmark_light.svg",
    alt: "GitHub Logo",
  },
  {
    src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
    alt: "Claude AI Logo",
  },
  {
    src: "https://svgl.app/library/clerk-wordmark-light.svg",
    alt: "Clerk Logo",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Page background glow (kept behind Hero canvas) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-120 -left-32 h-[520px] w-[520px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Social proof */}
      <section className="py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Built for focused creators</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                A modern workspace for deep work.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
                Capture quickly, connect later — without clutter. Notes, canvas, and media designed to stay calm as you scale.
              </p>
            </div>

            <div className="w-full max-w-md">
              <DisplayCards
                cards={[
                  {
                    title: "Notes",
                    description: "Capture fast",
                    date: "TipTap JSON",
                    className:
                      "[grid-area:stack] hover:-translate-y-10 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:outline before:outline-1 before:outline-border before:bg-background/50 before:content-[''] grayscale hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0",
                  },
                  {
                    title: "Canvas",
                    description: "Think visually",
                    date: "tldraw JSON",
                    className:
                      "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:outline before:outline-1 before:outline-border before:bg-background/50 before:content-[''] grayscale hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0",
                  },
                  {
                    title: "Media",
                    description: "Stay organized",
                    date: "Upload + preview",
                    className:
                      "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                  },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {["Deep work", "Research", "Projects", "Learning", "Writing"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 h-px w-full bg-border/60" />
        </div>
      </section>

      {/* Logo cloud */}
      <section className="py-10 sm:py-12 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-medium tracking-tight text-muted-foreground">
            Trusted by teams building focused workflows
          </h2>
          <div className="mx-auto my-6 h-px max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]" />
          <LogoCloud logos={logos} />
          <div className="mx-auto mt-6 h-px max-w-sm bg-border mask-[linear-gradient(to_right,transparent,black,transparent)]" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Product</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
            Everything you need to think clearly
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            A clean workspace for capturing, organizing, and connecting your ideas.
          </p>
        </div>

        <Features8 />
      </section>

      {/* Use cases */}
      <section id="product" className="py-24 px-4 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Use cases</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Built for everyone who thinks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                description:
                  "Organize research, connect concepts, and learn faster.",
              },
              {
                icon: PenTool,
                title: "Creators",
                description:
                  "Capture inspiration and turn messy ideas into output.",
              },
              {
                icon: Wrench,
                title: "Builders",
                description:
                  "Plan projects, document processes, track progress.",
              },
              {
                icon: Users,
                title: "Thinkers",
                description:
                  "Explore ideas deeply and build your own knowledge system.",
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="rounded-3xl border border-border bg-background/60 p-6 text-center shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{useCase.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <section className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Loved by focused teams</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Calm, consistent, and fast
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              A second brain that feels lightweight — but stays powerful as your system grows.
            </p>
          </div>

          <div className="flex justify-center">
            <Testimonials3D />
          </div>
        </section>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <section className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="mt-10">
            <ThemedPricingTable />
          </div>
        </section>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <section className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-background/40 to-primary/5 p-10 text-center sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -bottom-48 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
          </div>

          <p className="relative text-xs sm:text-sm text-muted-foreground">
            The calmest way to capture, connect, and build.
          </p>

          <div className="relative">
            <TypewriterEffectSmooth
              words={[
                { text: "Build" },
                { text: "your" },
                { text: "second" },
                { text: "brain" },
                { text: "with" },
                { text: "Noma.", className: "text-primary" },
              ]}
              cursorClassName="bg-primary"
            />
          </div>

          <p className="relative mx-auto mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground">
            Notes, canvas, and media in one focused workspace. Start free, upgrade when you need more.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SignedOut>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8">
                <Link href="/sign-up">Create your space</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8">
                <a href="#pricing">See pricing</a>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8">
                <Link href="/workspace">Go to Workspace</Link>
              </Button>
            </SignedIn>
          </div>

          <p className="relative mt-4 text-xs text-muted-foreground">No credit card required</p>
        </section>
      </section>

      {/* Footer */}
      <HoverFooter />
    </div>
  );
}
