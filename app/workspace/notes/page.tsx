// app/workspace/notes/page.tsx
import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { PenSquare, PlusSquare } from "lucide-react";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";

export const dynamic = "force-dynamic"; // so it always fetches fresh data

export default async function NotesPage() {
    const profile = await getCurrentProfile();

    const notes = await prisma.note.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
    });

    const hasNotes = notes.length > 0;

    return (
        <SectionShell
            sectionLabel="Notes"
            breadcrumbLabel="Notes"
            icon={<PenSquare className="h-4 w-4" />}
            primaryActionLabel="New Note" // we'll hook this up with a server action later
            secondaryNavItems={[
                {
                    id: "new",
                    label: "New Note",
                    icon: <PlusSquare className="h-4 w-4" />,
                    // later this can trigger a create action
                },
                {
                    id: "all",
                    label: "All Notes",
                    icon: <PenSquare className="h-4 w-4" />,
                    active: true,
                },
            ]}
            secondaryListItems={notes.map((note) => ({
                id: note.id,
                label: note.title || "Untitled note",
                icon: <PenSquare className="h-3 w-3" />,
            }))}
        >
            {hasNotes ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {notes.map((note) => (
                        <ResourceCard
                            key={note.id}
                            title={note.title || "Untitled note"}
                            tagLabel="Notes"
                            icon={<PenSquare className="h-3 w-3" />}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                    <PenSquare className="h-8 w-8" />
                    <p>No notes yet.</p>
                    <p className="text-xs">
                        Use <span className="font-medium">“New Note”</span> to create your first one.
                    </p>
                </div>
            )}
        </SectionShell>
    );
}
