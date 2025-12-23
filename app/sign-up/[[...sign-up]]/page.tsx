import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create your space</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Start using Noma in under a minute.
          </p>
        </div>

        <SignUp
          redirectUrl="/workspace"
          appearance={{
            elements: {
              card: "shadow-lg border border-border rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "rounded-xl border border-border hover:bg-muted transition",
              formButtonPrimary:
                "rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition",
              formFieldInput:
                "rounded-xl border border-border focus:ring-2 focus:ring-primary/20",
              footerActionLink: "text-primary hover:underline",
            },
          }}
        />

        <p className="text-xs text-muted-foreground text-center mt-6">
          No credit card required.
        </p>
      </div>
    </div>
  );
}
