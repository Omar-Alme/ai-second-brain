"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Grid2X2,
    Home as HomeIcon,
    Image as ImageIcon,
    LayoutGrid,
    List,
    PenSquare,
    Search,
    SlidersHorizontal,
    Upload,
} from "lucide-react";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { SelectionActionBar } from "@/components/workspace/selection-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { createNoteAction, deleteNotesAction } from "@/app/workspace/notes/actions";
import { createCanvasAction, deleteCanvasesAction } from "@/app/workspace/canvas/actions";
import { deleteMediaFilesAction } from "@/app/workspace/media/actions";
import { uploadMediaDirect } from "@/lib/uploads/media-direct-upload";
import { useBilling } from "@/hooks/use-billing";
import { LimitReachedDialog } from "@/components/billing/limit-reached-dialog";
import { toast } from "sonner";

type WorkspaceKind = "Notes" | "Canvas" | "Media";
type FilterKind = "all" | WorkspaceKind;

type HomeItem = {
    id: string;
    title: string;
    kind: WorkspaceKind;
    href: string;
    tagLabel: string;
    activityAtMs: number;
    media?: {
        url: string;
        mimeType: string;
        size: number;
    };
};

function kindIcon(kind: WorkspaceKind) {
    switch (kind) {
        case "Notes":
            return <PenSquare className="h-3 w-3" />;
        case "Canvas":
            return <Grid2X2 className="h-3 w-3" />;
        case "Media":
            return <ImageIcon className="h-3 w-3" />;
    }
}

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
}

function canPreviewInline(mimeType: string) {
    return mimeType === "application/pdf" || mimeType.startsWith("image/") || mimeType.startsWith("audio/");
}

export function HomeFeed(props: { items: HomeItem[]; nowMs: number }) {
    const { items, nowMs } = props;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filterKind, setFilterKind] = useState<FilterKind>("all");
    const [query, setQuery] = useState("");
    const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isCreating, startCreate] = useTransition();
    const [isUploading, startUpload] = useTransition();
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [isDeleting, startDelete] = useTransition();
    const billing = useBilling();
    const [limitOpen, setLimitOpen] = useState(false);
    const [limitText, setLimitText] = useState<string | null>(null);
    const viewParam = searchParams.get("view");
    const view: "grid" | "list" = viewParam === "list" ? "list" : "grid";

    const visibleItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items.filter((i) => {
            if (filterKind !== "all" && i.kind !== filterKind) return false;
            if (!q) return true;
            return i.title.toLowerCase().includes(q) || i.tagLabel.toLowerCase().includes(q);
        });
    }, [filterKind, items, query]);

    const sidebarGroups = useMemo(() => {
        const pastWeek: HomeItem[] = [];
        const pastMonth: HomeItem[] = [];
        const older: HomeItem[] = [];

        for (const item of visibleItems) {
            const days = Math.floor((nowMs - item.activityAtMs) / (1000 * 60 * 60 * 24));
            if (days <= 7) pastWeek.push(item);
            else if (days <= 30) pastMonth.push(item);
            else older.push(item);
        }

        const toSidebarItems = (arr: HomeItem[]) =>
            arr.map((i) => ({
                id: `${i.kind}-${i.id}`,
                label: i.title,
                href: i.href,
                icon: kindIcon(i.kind),
            }));

        return [
            { id: "past-week", label: "Past week", items: toSidebarItems(pastWeek) },
            { id: "past-month", label: "Past month", items: toSidebarItems(pastMonth) },
            { id: "older", label: "Older", items: toSidebarItems(older) },
        ];
    }, [nowMs, visibleItems]);

    const selectedMedia = useMemo(() => {
        if (!previewMediaId) return null;
        const item = items.find((i) => i.kind === "Media" && i.id === previewMediaId) ?? null;
        if (!item?.media) return null;
        return {
            id: item.id,
            name: item.title,
            url: item.media.url,
            mimeType: item.media.mimeType,
            size: item.media.size,
        };
    }, [items, previewMediaId]);

    const selectedItems = useMemo(() => {
        if (selectedKeys.size === 0) return [];
        const keys = selectedKeys;
        return items.filter((i) => keys.has(`${i.kind}:${i.id}`));
    }, [items, selectedKeys]);

    const handleDeleteSelected = () => {
        if (selectedKeys.size === 0) return;
        setBulkDeleteOpen(true);
    };

    const handleClearSelection = () => {
        setSelectedKeys(new Set());
    };

    return (
        <>
            <LimitReachedDialog
                open={limitOpen}
                onOpenChange={setLimitOpen}
                title="Limit reached"
                description={limitText ?? undefined}
            />
            <SectionShell
                sectionLabel="Home"
                breadcrumbLabel="Home"
                icon={<HomeIcon className="h-4 w-4" />}
                showSearch={false}
                secondaryNavItems={[
                    {
                        id: "workspace",
                        label: "My Workspace",
                        active: true,
                        icon: <HomeIcon className="h-4 w-4" />,
                        href: "/workspace",
                    },
                ]}
                secondaryListGroups={sidebarGroups}
            >
                <div className="mb-6 flex items-center gap-3 border-b pb-6">
                    <div className="relative w-full max-w-2xl">
                        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                        <label htmlFor="home-search" className="sr-only">
                            Search items
                        </label>
                        <Input
                            id="home-search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search anything..."
                            className={cn(
                                "h-12 border-0 bg-transparent pl-8 text-2xl font-medium shadow-none",
                                "placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            )}
                        />
                    </div>
                </div>

                {/* Filter (left) + quick actions (right) under search */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="rounded-full text-xs">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Show</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={filterKind}
                                onValueChange={(v) => setFilterKind(v as FilterKind)}
                            >
                                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Notes">Notes</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Canvas">Canvas</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Media">Media</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <div className="hidden items-center gap-1 rounded-full border bg-background p-1 md:flex">
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className={cn("rounded-full", view === "grid" && "bg-muted")}
                                aria-label="Grid view"
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set("view", "grid");
                                    router.replace(`${pathname}?${params.toString()}`);
                                }}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className={cn("rounded-full", view === "list" && "bg-muted")}
                                aria-label="List view"
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.set("view", "list");
                                    router.replace(`${pathname}?${params.toString()}`);
                                }}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs"
                            disabled={isCreating}
                            onClick={() => {
                                startCreate(async () => {
                                    try {
                                        const limit = billing.entitlements?.notesLimit ?? null;
                                        const used = billing.usage?.notesUsed ?? 0;
                                        const isBlocked = billing.status === "ready" && limit !== null && used >= limit;

                                        if (isBlocked) {
                                            setLimitText("You’ve reached the Free plan note limit. Upgrade to Pro for unlimited notes.");
                                            setLimitOpen(true);
                                            return;
                                        }

                                        toast.loading("Creating note…", { id: "home-create-note" });
                                        const id = await createNoteAction();
                                        toast.success("Note created", { id: "home-create-note" });
                                        router.push(`/workspace/notes/${id}`);
                                    } catch (err) {
                                        toast.error(
                                            err instanceof Error ? err.message : "Failed to create note",
                                            { id: "home-create-note" }
                                        );
                                        setLimitText(
                                            err instanceof Error ? err.message : "You’ve reached your plan limit."
                                        );
                                        setLimitOpen(true);
                                    }
                                });
                            }}
                        >
                            <PenSquare className="h-4 w-4" />
                            Note
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs"
                            disabled={isCreating}
                            onClick={() => {
                                startCreate(async () => {
                                    try {
                                        const limit = billing.entitlements?.canvasesLimit ?? null;
                                        const used = billing.usage?.canvasesUsed ?? 0;
                                        const isBlocked = billing.status === "ready" && limit !== null && used >= limit;

                                        if (isBlocked) {
                                            setLimitText("You’ve reached the Free plan canvas limit. Upgrade to Pro for unlimited canvases.");
                                            setLimitOpen(true);
                                            return;
                                        }

                                        toast.loading("Creating canvas…", { id: "home-create-canvas" });
                                        const id = await createCanvasAction();
                                        toast.success("Canvas created", { id: "home-create-canvas" });
                                        router.push(`/workspace/canvas/${id}`);
                                    } catch (err) {
                                        toast.error(
                                            err instanceof Error ? err.message : "Failed to create canvas",
                                            { id: "home-create-canvas" }
                                        );
                                        setLimitText(
                                            err instanceof Error ? err.message : "You’ve reached your plan limit."
                                        );
                                        setLimitOpen(true);
                                    }
                                });
                            }}
                        >
                            <Grid2X2 className="h-4 w-4" />
                            Canvas
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs"
                            onClick={() => {
                                const storageBlocked =
                                    billing.status === "ready" &&
                                    (billing.usage?.storageUsedBytes ?? 0) >=
                                        (billing.entitlements?.storageLimitGb ?? 0) * 1024 * 1024 * 1024;

                                if (storageBlocked) {
                                    setLimitText("You’ve reached your storage limit. Upgrade to Pro for more storage.");
                                    setLimitOpen(true);
                                    return;
                                }
                                setUploadError(null);
                                setUploadOpen(true);
                            }}
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </div>
                </div>

                <div
                    className={cn(
                        view === "grid"
                            ? "grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5"
                            : "space-y-2"
                    )}
                >
                    {visibleItems.map((item) => {
                        const key = `${item.kind}:${item.id}`;
                        const isSelected = selectedKeys.has(key);

                        return (
                            <ResourceCard
                                key={key}
                                title={item.title}
                                tagLabel={item.tagLabel}
                                icon={kindIcon(item.kind)}
                                variant={view}
                                selected={isSelected}
                                onSelectChange={(selected) => {
                                    setSelectedKeys((prev) => {
                                        const next = new Set(prev);
                                        if (selected) next.add(key);
                                        else next.delete(key);
                                        return next;
                                    });
                                }}
                                onClick={() => {
                                    // When selecting, don't navigate/open preview.
                                    if (selectedKeys.size > 0) return;

                                    if (item.kind === "Media") {
                                        setPreviewMediaId(item.id);
                                        return;
                                    }

                                    router.push(item.href);
                                }}
                            />
                        );
                    })}
                </div>

                <SelectionActionBar
                    selectedCount={selectedKeys.size}
                    onDelete={handleDeleteSelected}
                    onClearSelection={handleClearSelection}
                    isDeleting={isDeleting}
                />
            </SectionShell>

            {/* Upload from Home */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Upload</DialogTitle>
                        <DialogDescription>Images, PDFs, and audio files up to 15MB.</DialogDescription>
                    </DialogHeader>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf,audio/*"
                        disabled={isUploading}
                        aria-label="Choose a file to upload"
                        onChange={(e) => {
                            const inputEl = e.currentTarget;
                            const file = inputEl.files?.[0];
                            if (!file) return;
                            const storageBlocked =
                                billing.status === "ready" &&
                                (billing.usage?.storageUsedBytes ?? 0) >=
                                    (billing.entitlements?.storageLimitGb ?? 0) * 1024 * 1024 * 1024;
                            if (storageBlocked) {
                                setLimitText("You’ve reached your storage limit. Upgrade to Pro for more storage.");
                                setLimitOpen(true);
                                inputEl.value = "";
                                return;
                            }

                            setUploadError(null);

                            startUpload(async () => {
                                try {
                                    toast.loading("Uploading…", { id: "home-upload" });
                                    await uploadMediaDirect(file);
                                    toast.success("Uploaded", { id: "home-upload" });
                                    setUploadOpen(false);
                                    router.refresh();
                                } catch (err) {
                                    console.error(err);
                                    const msg = err instanceof Error ? err.message : "Upload failed";
                                    toast.error(msg, { id: "home-upload" });
                                    setUploadError(msg);
                                } finally {
                                    inputEl.value = "";
                                }
                            });
                        }}
                    />

                    <div
                        className={cn(
                            "rounded-xl border border-dashed p-6",
                            "bg-muted/20 hover:bg-muted/30 transition-colors"
                        )}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (!file) return;
                            const storageBlocked =
                                billing.status === "ready" &&
                                (billing.usage?.storageUsedBytes ?? 0) >=
                                    (billing.entitlements?.storageLimitGb ?? 0) * 1024 * 1024 * 1024;
                            if (storageBlocked) {
                                setLimitText("You’ve reached your storage limit. Upgrade to Pro for more storage.");
                                setLimitOpen(true);
                                return;
                            }
                            setUploadError(null);
                            startUpload(async () => {
                                try {
                                    toast.loading("Uploading…", { id: "home-upload" });
                                    await uploadMediaDirect(file);
                                    toast.success("Uploaded", { id: "home-upload" });
                                    setUploadOpen(false);
                                    router.refresh();
                                } catch (err) {
                                    console.error(err);
                                    const msg = err instanceof Error ? err.message : "Upload failed";
                                    toast.error(msg, { id: "home-upload" });
                                    setUploadError(msg);
                                }
                            });
                        }}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                            <div className="text-sm font-medium">Drag & drop a file</div>
                            <div className="text-xs text-muted-foreground">or choose a file</div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 rounded-full"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Choose file
                            </Button>
                        </div>
                    </div>

                    {uploadError && <div className="text-sm text-destructive">{uploadError}</div>}

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => setUploadOpen(false)}
                            disabled={isUploading}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Media preview from Home */}
            <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setPreviewMediaId(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="truncate">{selectedMedia?.name ?? ""}</DialogTitle>
                        <DialogDescription>
                            {selectedMedia
                                ? `${selectedMedia.mimeType} • ${formatBytes(selectedMedia.size)}`
                                : ""}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMedia && canPreviewInline(selectedMedia.mimeType) ? (
                        <div className="min-h-[50vh] w-full overflow-hidden rounded-lg border bg-muted/10">
                            {selectedMedia.mimeType.startsWith("image/") && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.name}
                                    className="h-full w-full object-contain"
                                />
                            )}
                            {selectedMedia.mimeType === "application/pdf" && (
                                <iframe
                                    title={selectedMedia.name}
                                    src={selectedMedia.url}
                                    className="h-[70vh] w-full"
                                />
                            )}
                            {selectedMedia.mimeType.startsWith("audio/") && (
                                <div className="p-6">
                                    <audio controls className="w-full" src={selectedMedia.url} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                            Preview not available.{" "}
                            <a
                                className="underline"
                                href={selectedMedia?.url ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open in new tab
                            </a>
                            .
                        </div>
                    )}

                    {selectedMedia && (
                        <div className="flex justify-end">
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href={`/workspace/media?preview=${selectedMedia.id}`}>Open in Media Library</Link>
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Bulk delete confirm (Home feed selection) */}
            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {selectedKeys.size} {selectedKeys.size === 1 ? "item" : "items"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the selected items from your workspace.
                            {selectedItems.length > 0 && (
                                <>
                                    {" "}
                                    ({selectedItems.slice(0, 3).map((i) => i.title).join(", ")}
                                    {selectedItems.length > 3 ? ", …" : ""})
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting || selectedKeys.size === 0}
                            onClick={() => {
                                const notes: string[] = [];
                                const canvases: string[] = [];
                                const media: string[] = [];

                                for (const key of selectedKeys) {
                                    const idx = key.indexOf(":");
                                    if (idx === -1) continue;
                                    const kind = key.slice(0, idx);
                                    const id = key.slice(idx + 1);
                                    if (!id) continue;
                                    if (kind === "Notes") notes.push(id);
                                    else if (kind === "Canvas") canvases.push(id);
                                    else if (kind === "Media") media.push(id);
                                }

                                startDelete(async () => {
                                    try {
                                        toast.loading("Deleting…", { id: "home-bulk-delete" });
                                        await Promise.all([
                                            notes.length ? deleteNotesAction({ ids: notes }) : Promise.resolve(),
                                            canvases.length ? deleteCanvasesAction({ ids: canvases }) : Promise.resolve(),
                                            media.length ? deleteMediaFilesAction({ ids: media }) : Promise.resolve(),
                                        ]);
                                        toast.success("Deleted", { id: "home-bulk-delete" });

                                        if (previewMediaId && media.includes(previewMediaId)) {
                                            setPreviewMediaId(null);
                                        }

                                        setBulkDeleteOpen(false);
                                        setSelectedKeys(new Set());
                                        router.refresh();
                                    } catch (err) {
                                        toast.error(
                                            err instanceof Error ? err.message : "Failed to delete selected items",
                                            { id: "home-bulk-delete" }
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
        </>
    );
}


