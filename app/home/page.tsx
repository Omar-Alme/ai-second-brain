import { ensureUserProfile } from '@/lib/ensureUserProfile';

export default async function HomePage() {
    const profile = await ensureUserProfile();

    if (!profile) {
        // Shouldn't happen because Clerk protects this route,
        // but helps TypeScript and debugging
        return (
            <main className="p-8">
                <p>Not signed in.</p>
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
                Current plan: <span className="font-mono">{profile.plan}</span>
            </p>

            <p className="text-zinc-500 text-sm">
                (Later, clicking “Upgrade” will change <code>plan</code> to <code>"pro"</code>
                and eventually call a real billing provider.)
            </p>
        </main>
    );
}
