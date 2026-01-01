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
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Pick a starting point — the workspace adapts to how you think.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                description: "Organize research, connect concepts, and learn faster.",
                bullets: ["Capture lecture notes", "Link sources to ideas", "Summarize with structure"],
              },
              {
                icon: PenTool,
                title: "Creators",
                description: "Turn messy inspiration into consistent output.",
                bullets: ["Idea inbox for drafts", "Storyboard on canvas", "Keep assets in Media"],
              },
              {
                icon: Wrench,
                title: "Builders",
                description: "Plan projects, document processes, track progress.",
                bullets: ["Specs + checklists", "System diagrams", "Reference docs nearby"],
              },
              {
                icon: Users,
                title: "Thinkers",
                description: "Explore ideas deeply and build your knowledge system.",
                bullets: ["Daily thinking notes", "Concept maps", "Capture what matters"],
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                tabIndex={0}
                className="group relative rounded-3xl border border-border/60 bg-background/35 p-6 shadow-xs backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-background/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-primary/8 blur-2xl" />
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-primary/10">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-foreground">{useCase.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
                </div>

                <div className="relative mt-5 overflow-hidden">
                  <ul
                    className="space-y-2 text-sm text-muted-foreground max-h-0 opacity-0 transition-all duration-300 group-hover:max-h-40 group-hover:opacity-100 group-focus-visible:max-h-40 group-focus-visible:opacity-100"
                  >
                    {useCase.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                        <span className="truncate">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative mt-6 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Tip: press <span className="font-medium text-foreground">Tab</span> to preview
                  </span>
                  <Link
                    href="/sign-up"
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Start free
                  </Link>
                </div>
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
