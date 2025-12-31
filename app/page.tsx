"use client";

import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Brain,
  FileText,
  Layout,
  Sparkles,
  Lightbulb,
  Link2,
  Eye,
  GraduationCap,
  PenTool,
  Wrench,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";
import { ThemedPricingTable } from "@/components/billing/themed-pricing-table";
import { Testimonials3D } from "@/components/landing/testimonials-3d";

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
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl border border-border bg-background/60 px-6 py-8 shadow-sm backdrop-blur md:px-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Built for focused creators</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A calm workspace for deep work, research, projects, and learning.
                </p>
              </div>

              <div className="grid w-full max-w-md grid-cols-3 gap-3">
                {[
                  { label: "Notes", value: "Unlimited" },
                  { label: "Canvas", value: "Visual" },
                  { label: "AI", value: "On-demand" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-background/60 p-4 text-center shadow-xs"
                  >
                    <div className="text-sm font-semibold">{s.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {["Deep work", "Research", "Projects", "Learning", "Writing"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "Think clearly",
                description:
                  "A distraction-free environment designed for deep focus.",
              },
              {
                icon: FileText,
                title: "Flexible notes",
                description:
                  "Rich text editing that matches how you naturally write and think.",
              },
              {
                icon: Layout,
                title: "Visual canvas",
                description:
                  "Sketch, brainstorm, and connect ideas visually on a canvas.",
              },
              {
                icon: Sparkles,
                title: "AI assistance",
                description:
                  "Summaries, structure, and idea expansion—right when you want it.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-5 h-px w-full bg-border/70" />
                <p className="mt-4 text-xs text-muted-foreground">
                  Built to stay out of your way.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform how you think and work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Capture ideas",
                description:
                  "Quickly jot down thoughts, notes, and insights as they come.",
                icon: Lightbulb,
              },
              {
                step: "02",
                title: "Connect thoughts",
                description:
                  "Link related ideas and build connections that reveal patterns.",
                icon: Link2,
              },
              {
                step: "03",
                title: "Build clarity",
                description:
                  "Refine and organize into clear, actionable insights.",
                icon: Eye,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="rounded-3xl border border-border bg-background/60 p-6 text-center shadow-sm backdrop-blur"
              >
                <div className="mx-auto mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-semibold">
                  {step.step}
                </div>
                <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 rounded-xl bg-muted/40">
                  <step.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-border bg-background/60 p-4 shadow-sm backdrop-blur">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-linear-to-r from-primary/5 via-transparent to-primary/10">
                <div aria-hidden className="absolute inset-0">
                  <div className="absolute left-6 top-6 h-16 w-16 rounded-2xl bg-background/60 shadow-sm" />
                  <div className="absolute left-32 top-16 h-16 w-16 rounded-2xl bg-background/60 shadow-sm" />
                  <div className="absolute left-60 top-10 h-16 w-16 rounded-2xl bg-background/60 shadow-sm" />
                  <div className="absolute right-8 bottom-10 h-16 w-16 rounded-2xl bg-background/60 shadow-sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Your workspace, visualized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="product" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
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

          <div className="rounded-3xl border border-border bg-background/60 p-4 shadow-sm backdrop-blur sm:p-6">
            <ThemedPricingTable />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border bg-linear-to-br from-primary/10 via-transparent to-primary/5 p-10 sm:p-12 text-center shadow-sm">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              A calmer way to think starts here.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Create your space, capture your ideas, and build your system — without noise.
            </p>

            <div className="mt-8 space-y-3">
              <SignedOut>
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8">
                  <Link href="/sign-up">Create your space</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8">
                  <Link href="/workspace">Go to Workspace</Link>
                </Button>
              </SignedIn>

              <p className="text-xs text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Noma</p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
