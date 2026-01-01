"use client";

import Link from "next/link";
import { ArrowLeft, Home, LayoutGrid, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BeamsBackground } from "@/components/ui/beams-background";

export default function NotFound() {
  return (
    <BeamsBackground intensity="medium">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 sm:px-6">
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <SearchX className="h-4 w-4" />
            Page not found
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            We couldn’t find that page
          </h1>
          <p className="mt-3 text-balance text-sm text-muted-foreground sm:text-base">
            The link may be broken, or the page might have been moved.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => window.history.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Button asChild className="rounded-full" aria-label="Go to home page">
              <Link href="/">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="rounded-full"
              aria-label="Go to workspace"
            >
              <Link href="/workspace">
                <LayoutGrid className="h-4 w-4" />
                Workspace
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </BeamsBackground>
  );
}


