"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/navbar";
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
  Check,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/landing/hero";

export default function LandingPage() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Social proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              Built for focused creators, students, and builders.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Deep work", "Research", "Projects", "Learning", "Writing"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-muted-foreground"
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
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
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
                className="rounded-2xl border border-border bg-white/60 p-6 text-center shadow-sm backdrop-blur"
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
            <div className="rounded-2xl border border-border bg-white/60 p-4 shadow-sm backdrop-blur">
              <div className="aspect-video rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Workflow visual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="product" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
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
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm hover:shadow-md transition-shadow"
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

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-border bg-white/60 p-8 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Free</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For getting started.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold">$0</div>
                  <div className="text-xs text-muted-foreground">/month</div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {["Unlimited notes", "Basic canvas", "Media uploads"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground/90">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <SignedOut>
                  <Button asChild className="w-full rounded-full" variant="outline">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild className="w-full rounded-full" variant="outline">
                    <Link href="/workspace">Continue</Link>
                  </Button>
                </SignedIn>
              </div>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-primary/60 bg-white/70 p-8 shadow-md backdrop-blur">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                  Popular
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    For daily power users.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold">$9</div>
                  <div className="text-xs text-muted-foreground">/month</div>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Everything in Free",
                  "Advanced AI features",
                  "Priority support",
                  "Export options",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground/90">
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <SignedOut>
                  <Button asChild className="w-full rounded-full">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <Button asChild className="w-full rounded-full">
                    <Link href="/workspace">Upgrade to Pro</Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
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
