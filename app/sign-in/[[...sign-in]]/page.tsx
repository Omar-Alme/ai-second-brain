"use client";

import useCurrentTheme from "@/hooks/use-current-theme";
import { SignIn } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";
import { BeamsBackground } from "@/components/ui/beams-background";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <BeamsBackground intensity="medium">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 sm:px-6">
        <section className="space-y-6 pt-[16vh] 2xl:pt-48">
          <div className="flex flex-col items-center">
            <SignIn
              appearance={{
                baseTheme: currentTheme === "dark" ? [shadcn, dark] : shadcn,
                elements: {
                  // Ensure solid, readable surface and match your previous app.
                  cardBox: "rounded-lg border shadow-none bg-card",
                  card: "rounded-lg border shadow-none bg-card",
                },
              }}
            />
          </div>
        </section>
      </div>
    </BeamsBackground>
  );
}
