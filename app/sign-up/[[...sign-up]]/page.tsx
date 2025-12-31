"use client";

import useCurrentTheme from "@/hooks/use-current-theme";
import { SignUp } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex w-full max-w-3xl flex-col mx-auto">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignUp
            redirectUrl="/workspace"
            appearance={{
              baseTheme: currentTheme === "dark" ? [shadcn, dark] : shadcn,
              elements: {
                cardBox: "rounded-lg border shadow-none bg-card",
                card: "rounded-lg border shadow-none bg-card",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
