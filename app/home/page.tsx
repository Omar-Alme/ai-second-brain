// app/home/page.tsx
import { ensureUserProfile } from '@/lib/ensureUserProfile';

export default async function HomePage() {
    const profile = await ensureUserProfile();

    if (!profile) {
        // Should never happen if Clerk is protecting this route,
        // but it's a nice fallback + debug output.
        return (
            <main className="p-8">
                <p>Not signed in / no profile created.</p>
            </main>
        );
    }

    return (
        <main className="p-8 space-y-4">
            <h1 className="text-2xl font-semibold">
                Welcome, {profile.name || profile.email || 'friend'} 👋
            </h1>

            <p className="text-zinc-500">
                DB user id: <span className="font-mono">{profile.id}</span>
            </p>

            <p className="text-zinc-500">
                Plan: <span className="font-mono">{profile.plan}</span>
            </p>
        </main>
    );
}
