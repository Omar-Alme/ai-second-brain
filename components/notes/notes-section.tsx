"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, PenSquare, PlusSquare, Search } from "lucide-react";
import { createNoteAction } from "@/app/workspace/notes/actions";

type NoteListItem = {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type NotesSectionProps = {
    notes: NoteListItem[];
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string }[];
    }[];
};

export function NotesSection({ notes, sidebarGroups }: NotesSectionProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCreateNote = () => {
        startTransition(async () => {
            const id = await createNoteAction();
            router.push(`/workspace/notes/${id}`);
        });
    };

    return (
        <SectionShell
            sectionLabel="Notes"
            breadcrumbLabel="Notes"
            icon={<PenSquare className="h-4 w-4" />}
            showSearch={false}
            topBarRight={
                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-1 rounded-full border bg-background p-1 md:flex">
                        <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="rounded-full px-4 text-xs font-medium"
                        onClick={handleCreateNote}
                        disabled={isPending}
                    >
                        <PlusSquare className="h-4 w-4" />
                        {isPending ? "Creating…" : "New Note"}
                    </Button>
                </div>
            }
            secondaryNavItems={[
                {
                    id: "new",
                    label: isPending ? "Creating…" : "New note",
                    icon: <PlusSquare className="h-4 w-4" />,
                    onClick: handleCreateNote,
                },
                {
                    id: "all",
                    label: "All notes",
                    icon: <PenSquare className="h-4 w-4" />,
                    active: true,
                    href: "/workspace/notes",
                },
            ]}
            secondaryListGroups={sidebarGroups}
        >
            <div className="mb-6 flex items-center gap-3 border-b pb-6">
                <div className="relative w-full max-w-2xl">
                    <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                        placeholder="Search anything..."
                        className={cn(
                            "h-12 border-0 bg-transparent pl-8 text-2xl font-medium shadow-none",
                            "placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                    />
                </div>
            </div>
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
