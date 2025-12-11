// app/page.tsx  (Landing – placeholder for now)
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-xl space-y-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Noma – your calm second brain.
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture notes, brainstorm on canvas, upload media and chat with AI –
          all in one focused workspace.
        </p>

        <SignedOut >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <Button className="w-40">Get started</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" className="w-40">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You’re already signed in.
            </p>
            <Button asChild>
              <Link href="/workspace">Go to workspace</Link>
            </Button>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
