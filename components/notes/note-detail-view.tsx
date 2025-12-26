"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/core";
import { MoreHorizontal, PenSquare, PlusSquare, Trash2 } from "lucide-react";

import { SectionShell } from "@/components/workspace/section-shell";
import { InlineTitle } from "@/components/workspace/inline-title";
import { NoteEditor } from "@/components/notes/note-editor";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createNoteAction, deleteNoteAction, updateNoteAction } from "@/app/workspace/notes/actions";
import { useBilling } from "@/hooks/use-billing";
import { LimitReachedDialog } from "@/components/billing/limit-reached-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function formatEditedLabel(date: Date, nowMs: number) {
    const diffMs = nowMs - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    if (diffMin < 2) return "Edited just now";
    if (diffMin < 60) return `Edited ${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `Edited ${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 14) return `Edited ${diffDay}d ago`;
    const diffWk = Math.floor(diffDay / 7);
    if (diffWk < 8) return `Edited ${diffWk}w ago`;
    const diffMo = Math.floor(diffDay / 30);
    return `Edited ${diffMo}mo ago`;
}

export function NoteDetailView(props: {
    noteId: string;
    initialTitle: string;
    initialContent: JSONContent | null;
    initialUpdatedAt: string;
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string; active?: boolean }[];
    }[];
}) {
    const { noteId, initialTitle, initialContent, initialUpdatedAt, sidebarGroups } = props;
    const router = useRouter();
    const [title, setTitle] = useState(initialTitle || "");
    const [isPending, startTransition] = useTransition();
    const [isDeleting, startDelete] = useTransition();
    const [editedAt, setEditedAt] = useState(() => new Date(initialUpdatedAt));
    const [nowMs, setNowMs] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const billing = useBilling();
    const [limitOpen, setLimitOpen] = useState(false);
    const [limitText, setLimitText] = useState<string | null>(null);

    useEffect(() => {
        // keep renders pure; update "now" in an effect
        const tick = () => setNowMs(new Date().getTime());
        tick();
        const id = window.setInterval(tick, 60_000);
        return () => window.clearInterval(id);
    }, []);

    const editedLabel = useMemo(() => {
        if (nowMs === null) return "Edited";
        return formatEditedLabel(editedAt, nowMs);
    }, [editedAt, nowMs]);

    return (
        <>
            <LimitReachedDialog
                open={limitOpen}
                onOpenChange={setLimitOpen}
                title="Limit reached"
                description={limitText ?? undefined}
            />
        <SectionShell
            sectionLabel="Notes"
            breadcrumbLabel="Notes"
            icon={<PenSquare className="h-4 w-4" />}
            showSearch={false}
            breadcrumbs={
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/workspace" className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href="/workspace/notes" className="hover:text-foreground transition-colors">
                                Notes
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <InlineTitle
                                value={title}
                                onChange={setTitle}
                                placeholder="Untitled note"
                                className="max-w-[320px]"
                            />
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
            topBarRight={
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{editedLabel}</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="More">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setConfirmOpen(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete note?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete this note. This action can’t be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={isDeleting}
                                    onClick={() => {
                                        startDelete(async () => {
                                            await deleteNoteAction({ id: noteId });
                                            setConfirmOpen(false);
                                            router.replace("/workspace/notes");
                                        });
                                    }}
                                >
                                    {isDeleting ? "Deleting…" : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            }
            contentClassName="p-0 overflow-hidden"
            secondaryNavItems={[
                {
                    id: "new",
                    label: isPending ? "Creating…" : "New note",
                    icon: <PlusSquare className="h-4 w-4" />,
                    onClick: () => {
                        startTransition(async () => {
                            try {
                                const limit = billing.entitlements?.notesLimit ?? null;
                                const used = billing.usage?.notesUsed ?? 0;
                                const isBlocked = billing.status === "ready" && limit !== null && used >= limit;
                                if (isBlocked) {
                                    setLimitText("You’ve reached the Free plan note limit. Upgrade to Pro for unlimited notes.");
                                    setLimitOpen(true);
                                    return;
                                }

                                const id = await createNoteAction();
                                router.push(`/workspace/notes/${id}`);
                            } catch (err) {
                                setLimitText(err instanceof Error ? err.message : "You’ve reached your plan limit.");
                                setLimitOpen(true);
                            }
                        });
                    },
                },
                {
                    id: "all",
                    label: "All notes",
                    icon: <PenSquare className="h-4 w-4" />,
                    href: "/workspace/notes",
                },
            ]}
            secondaryListGroups={sidebarGroups}
        >
            <NoteEditor
                key={noteId}
                noteId={noteId}
                title={title}
                onTitleChange={setTitle}
                initialContent={initialContent}
                onSave={async (input) => {
                    await updateNoteAction(input);
                    setEditedAt(new Date());
                }}
            />
        </SectionShell>
        </>
    );
}


