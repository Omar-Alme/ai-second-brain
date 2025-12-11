"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { PenSquare, PlusSquare } from "lucide-react";
import { createNoteAction } from "@/app/workspace/notes/actions";

type NoteListItem = {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type NotesSectionProps = {
    notes: NoteListItem[];
};

export function NotesSection({ notes }: NotesSectionProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCreateNote = () => {
        startTransition(async () => {
            const id = await createNoteAction();
            router.push(`/workspace/notes/${id}`);
        });
    };

    const primaryLabel = isPending ? "Creating…" : "New note";

    return (
        <SectionShell
            sectionLabel="Notes"
            breadcrumbLabel="Notes"
            icon={<PenSquare className="h-4 w-4" />}
            primaryActionLabel={primaryLabel}
            onPrimaryActionClick={handleCreateNote}
            secondaryNavItems={[
                {
                    id: "new",
                    label: "New note",
                    icon: <PlusSquare className="h-4 w-4" />,
                },
                {
                    id: "all",
                    label: "All notes",
                    icon: <PenSquare className="h-4 w-4" />,
                    active: true,
                },
            ]}
            secondaryListItems={notes.map((note) => ({
                id: note.id,
                label: note.title || "Untitled",
                href: `/workspace/notes/${note.id}`,
            }))}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {notes.map((note) => (
                    <Link key={note.id} href={`/workspace/notes/${note.id}`}>
                        <ResourceCard
                            title={note.title || "Untitled"}
                            tagLabel="Notes"
                            icon={<PenSquare className="h-3 w-3" />}
                        />
                    </Link>
                ))}
            </div>
        </SectionShell>
    );
}
