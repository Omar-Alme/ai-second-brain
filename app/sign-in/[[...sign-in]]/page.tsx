import { SignIn } from "@clerk/nextjs";
import { CLERK_APPEARANCE } from "@/lib/clerk/appearance";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to continue to Noma.
          </p>
        </div>

        <SignIn
          appearance={{
            ...CLERK_APPEARANCE,
            elements: {
              ...CLERK_APPEARANCE.elements,
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms & Privacy.
        </p>
      </div>
    </div>
  );
}
