"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { SelectionActionBar } from "@/components/workspace/selection-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, PenSquare, PlusSquare, Search } from "lucide-react";
import { createNoteAction, deleteNotesAction } from "@/app/workspace/notes/actions";
import { useBilling } from "@/hooks/use-billing";
import { UpgradeToProButton } from "@/components/billing/upgrade-to-pro-button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type NoteListItem = {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type NotesSectionProps = {
    notes: NoteListItem[];
    sortOrder: "asc" | "desc";
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string }[];
    }[];
};

export function NotesSection({ notes, sortOrder, sidebarGroups }: NotesSectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [createError, setCreateError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleting, startDelete] = useTransition();
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    const billing = useBilling();

    const isCreateBlocked = useMemo(() => {
        if (billing.status !== "ready") return false;
        const limit = billing.entitlements?.notesLimit ?? null;
        return limit !== null && notes.length >= limit;
    }, [billing.entitlements?.notesLimit, billing.status, notes.length]);

    const handleCreateNote = () => {
        if (isCreateBlocked) return;
        startTransition(async () => {
            try {
                setCreateError(null);
                toast.loading("Creating note…", { id: "notes-create" });
                const id = await createNoteAction();
                toast.success("Note created", { id: "notes-create" });
                router.push(`/workspace/notes/${id}`);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to create note";
                toast.error(msg, { id: "notes-create" });
                setCreateError(msg);
            }
        });
    };

    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;
        setBulkDeleteOpen(true);
    };

    const handleClearSelection = () => {
        setSelectedIds(new Set());
    };

    return (
        <SectionShell
            sectionLabel="Notes"
            breadcrumbLabel="Notes"
            icon={<PenSquare className="h-4 w-4" />}
            showSearch={false}
            secondaryNavItems={[
                {
                    id: "new",
                    label: isPending ? "Creating…" : "New note",
                    icon: <PlusSquare className="h-4 w-4" />,
                    onClick: handleCreateNote,
                    disabled: isCreateBlocked || isPending,
                    disabledReason: isCreateBlocked
                        ? "Free plan limit reached. Upgrade to Pro for unlimited notes."
                        : undefined,
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
            {(isCreateBlocked || createError) && (
                <div className="mb-6 rounded-2xl border border-border bg-background/60 p-4 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold">You’ve hit the Free plan limit</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {createError ?? "Upgrade to Pro for unlimited notes, canvases, and higher AI limits."}
                            </p>
                        </div>
                        <UpgradeToProButton className="rounded-full">Upgrade</UpgradeToProButton>
                    </div>
                </div>
            )}

            <div className="mb-6 flex items-center gap-3 border-b pb-6">
                <div className="relative w-full max-w-2xl">
                    <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                    <label htmlFor="notes-search" className="sr-only">
                        Search notes
                    </label>
                    <Input
                        id="notes-search"
                        placeholder="Search anything..."
                        className={cn(
                            "h-12 border-0 bg-transparent pl-8 text-2xl font-medium shadow-none",
                            "placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                        )}
                    />
                </div>
            </div>

            {/* Sort (left) + action (right) under search */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="sm" className="rounded-full text-xs">
                            Sort: {sortOrder === "asc" ? "Oldest" : "Newest"}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuLabel>Order</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                            value={sortOrder}
                            onValueChange={(v) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("sort", v);
                                router.replace(`${pathname}?${params.toString()}`);
                            }}
                        >
                            <DropdownMenuRadioItem value="desc">Newest first</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="asc">Oldest first</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center justify-end gap-2">
                    <div className="hidden items-center gap-1 rounded-full border bg-background p-1 md:flex">
                        <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Grid view">
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="List view">
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="rounded-full px-4 text-xs font-medium"
                        onClick={handleCreateNote}
                        disabled={isPending || isCreateBlocked}
                        title={
                            isCreateBlocked
                                ? "Free plan limit reached. Upgrade to Pro for unlimited notes."
                                : undefined
                        }
                    >
                        <PlusSquare className="h-4 w-4" />
                        {isPending ? "Creating…" : "New Note"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {notes.map((note) => (
                    <ResourceCard
                        key={note.id}
                        title={note.title || "Untitled"}
                        tagLabel="Notes"
                        icon={<PenSquare className="h-3 w-3" />}
                        selected={selectedIds.has(note.id)}
                        onSelectChange={(selected) => {
                            if (selected) {
                                setSelectedIds((prev) => new Set(prev).add(note.id));
                            } else {
                                setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(note.id);
                                    return next;
                                });
                            }
                        }}
                        onClick={() => {
                            if (!selectedIds.has(note.id)) {
                                router.push(`/workspace/notes/${note.id}`);
                            }
                        }}
                    />
                ))}
            </div>

            <SelectionActionBar
                selectedCount={selectedIds.size}
                onDelete={handleDeleteSelected}
                onClearSelection={handleClearSelection}
                isDeleting={isDeleting}
            />

            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {selectedIds.size} {selectedIds.size === 1 ? "note" : "notes"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the selected notes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting || selectedIds.size === 0}
                            onClick={() => {
                                const ids = Array.from(selectedIds);
                                startDelete(async () => {
                                    try {
                                        toast.loading("Deleting notes…", { id: "notes-bulk-delete" });
                                        await deleteNotesAction({ ids });
                                        toast.success("Notes deleted", { id: "notes-bulk-delete" });
                                        setBulkDeleteOpen(false);
                                        setSelectedIds(new Set());
                                        router.refresh();
                                    } catch (err) {
                                        toast.error(
                                            err instanceof Error ? err.message : "Failed to delete notes",
                                            { id: "notes-bulk-delete" }
                                        );
                                    }
                                });
                            }}
                        >
                            {isDeleting ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SectionShell>
    );
}
