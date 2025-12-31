"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, LayoutGrid, List, Search, Upload } from "lucide-react";

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { deleteMediaFilesAction, uploadMediaFileAction } from "@/app/workspace/media/actions";
import { useBilling } from "@/hooks/use-billing";
import { LimitReachedDialog } from "@/components/billing/limit-reached-dialog";
import { toast } from "sonner";

type MediaItem = {
    id: string;
    name: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt: string;
};

type MediaSectionProps = {
    mediaFiles: MediaItem[];
    sortOrder: "asc" | "desc";
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string }[];
    }[];
};

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
}

function kindLabel(mimeType: string) {
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("audio/")) return "Audio";
    return "File";
}

function canPreviewInline(mimeType: string) {
    return mimeType === "application/pdf" || mimeType.startsWith("image/") || mimeType.startsWith("audio/");
}

export function MediaSection({ mediaFiles, sortOrder, sidebarGroups }: MediaSectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [isUploading, startUpload] = useTransition();
    const [isDeletingBulk, startDeleteBulk] = useTransition();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const billing = useBilling();
    const [limitOpen, setLimitOpen] = useState(false);
    const [limitText, setLimitText] = useState<string | null>(null);

    const previewId = searchParams.get("preview");
    const currentSort = searchParams.get("sort") ?? sortOrder;

    const selected = useMemo(
        () => (previewId ? mediaFiles.find((m) => m.id === previewId) ?? null : null),
        [mediaFiles, previewId]
    );

    const selectedMedia = useMemo(() => {
        if (selectedIds.size === 0) return [];
        const ids = selectedIds;
        return mediaFiles.filter((m) => ids.has(m.id));
    }, [mediaFiles, selectedIds]);

    const onPickFile = (file: File) => {
        const storageBlocked =
            billing.status === "ready" &&
            (billing.usage?.storageUsedBytes ?? 0) >=
                (billing.entitlements?.storageLimitGb ?? 0) * 1024 * 1024 * 1024;

        if (storageBlocked) {
            setLimitText("You've reached your storage limit. Upgrade to Pro for more storage.");
            setLimitOpen(true);
            return;
        }

        const formData = new FormData();
        formData.set("file", file);
        setUploadError(null);

        startUpload(async () => {
            try {
                toast.loading("Uploading…", { id: "media-upload" });
                await uploadMediaFileAction(formData);
                toast.success("Uploaded", { id: "media-upload" });
                setUploadOpen(false);
                router.refresh();
            } catch (e) {
                console.error(e);
                const msg = e instanceof Error ? e.message : "Upload failed";
                toast.error(msg, { id: "media-upload" });
                setUploadError(msg);
            }
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
        <>
            <LimitReachedDialog
                open={limitOpen}
                onOpenChange={setLimitOpen}
                title="Storage limit reached"
                description={limitText ?? undefined}
            />
            <SectionShell
                sectionLabel="Media"
                breadcrumbLabel="Media"
                icon={<ImageIcon className="h-4 w-4" />}
                showSearch={false}
                secondaryNavItems={[
                    {
                        id: "upload",
                        label: "Upload",
                        icon: <Upload className="h-4 w-4" />,
                        onClick: () => {
                            const storageBlocked =
                                billing.status === "ready" &&
                                (billing.usage?.storageUsedBytes ?? 0) >=
                                    (billing.entitlements?.storageLimitGb ?? 0) * 1024 * 1024 * 1024;

                            if (storageBlocked) {
                                setLimitText("You’ve reached your storage limit. Upgrade to Pro for more storage.");
                                setLimitOpen(true);
                                return;
                            }

                            setUploadOpen(true);
                        },
                    },
                    {
                        id: "all",
                        label: "All media",
                        icon: <ImageIcon className="h-4 w-4" />,
                        active: true,
                        href: "/workspace/media",
                    },
                ]}
                secondaryListGroups={sidebarGroups}
            >
                <div className="mb-6 flex items-center gap-3 border-b pb-6">
                    <div className="relative w-full max-w-2xl">
                        <Search className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60" />
                        <label htmlFor="media-search" className="sr-only">
                            Search media
                        </label>
                        <Input
                            id="media-search"
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
                                Sort: {currentSort === "asc" ? "Oldest" : "Newest"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-52">
                            <DropdownMenuLabel>Order</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={currentSort}
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

                                setUploadOpen(true);
                            }}
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {mediaFiles.map((m) => {
                        const type = kindLabel(m.mimeType);
                        const size = formatBytes(m.size);
                        return (
                            <div key={m.id} className="relative">
                                <ResourceCard
                                    title={m.name}
                                    tagLabel={`${type}${size ? ` • ${size}` : ""}`}
                                    icon={<ImageIcon className="h-3 w-3" />}
                                    selected={selectedIds.has(m.id)}
                                    onSelectChange={(selected) => {
                                        if (selected) {
                                            setSelectedIds((prev) => new Set(prev).add(m.id));
                                        } else {
                                            setSelectedIds((prev) => {
                                                const next = new Set(prev);
                                                next.delete(m.id);
                                                return next;
                                            });
                                        }
                                    }}
                                    onClick={() => {
                                        if (!selectedIds.has(m.id)) {
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set("preview", m.id);
                                            router.replace(`${pathname}?${params.toString()}`);
                                        }
                                    }}
                                    className={cn(
                                        "cursor-pointer hover:shadow-md transition-shadow",
                                        "hover:border-border/80"
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>

                <SelectionActionBar
                    selectedCount={selectedIds.size}
                    onDelete={handleDeleteSelected}
                    onClearSelection={handleClearSelection}
                    isDeleting={isDeletingBulk}
                />
            </SectionShell>

            {/* Upload dialog */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Upload</DialogTitle>
                        <DialogDescription>
                            Images, PDFs, and audio files up to 15MB.
                        </DialogDescription>
                    </DialogHeader>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf,audio/*"
                        disabled={isUploading}
                        aria-label="Choose a file to upload"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onPickFile(file);
                            e.currentTarget.value = "";
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
                            if (file) onPickFile(file);
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

                    {uploadError && (
                        <div className="text-sm text-destructive">{uploadError}</div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => setUploadOpen(false)}
                            disabled={isUploading}
                        >
                            Close
                        </Button>
                        <div className="text-xs text-muted-foreground">
                            {isUploading ? "Uploading…" : ""}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Preview dialog */}
            <Dialog
                open={!!selected}
                onOpenChange={(open) => {
                    if (!open) {
                        router.replace("/workspace/media");
                    }
                }}
            >
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="truncate">{selected?.name ?? ""}</DialogTitle>
                        <DialogDescription>
                            {selected ? `${kindLabel(selected.mimeType)} • ${formatBytes(selected.size)}` : ""}
                        </DialogDescription>
                    </DialogHeader>

                    {selected && canPreviewInline(selected.mimeType) ? (
                        <div className="min-h-[50vh] w-full overflow-hidden rounded-lg border bg-muted/10">
                            {selected.mimeType.startsWith("image/") && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={selected.url}
                                    alt={selected.name}
                                    className="h-full w-full object-contain"
                                />
                            )}
                            {selected.mimeType === "application/pdf" && (
                                <iframe
                                    title={selected.name}
                                    src={selected.url}
                                    className="h-[70vh] w-full"
                                />
                            )}
                            {selected.mimeType.startsWith("audio/") && (
                                <div className="p-6">
                                    <audio controls className="w-full" src={selected.url} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                            Preview not available.{" "}
                            <a className="underline" href={selected?.url ?? "#"} target="_blank" rel="noreferrer">
                                Open in new tab
                            </a>
                            .
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Bulk delete confirm (selected items) */}
            <AlertDialog
                open={bulkDeleteOpen}
                onOpenChange={(open) => {
                    setBulkDeleteOpen(open);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {selectedIds.size} {selectedIds.size === 1 ? "file" : "files"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the selected files.
                            {selectedMedia.length > 0 && (
                                <>
                                    {" "}
                                    ({selectedMedia.slice(0, 3).map((m) => m.name).join(", ")}
                                    {selectedMedia.length > 3 ? ", …" : ""})
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingBulk}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeletingBulk || selectedIds.size === 0}
                            onClick={() => {
                                const ids = Array.from(selectedIds);
                                startDeleteBulk(async () => {
                                    try {
                                        toast.loading("Deleting files…", { id: "media-bulk-delete" });
                                        await deleteMediaFilesAction({ ids });
                                        toast.success("Files deleted", { id: "media-bulk-delete" });
                                        setBulkDeleteOpen(false);
                                        setSelectedIds(new Set());
                                        if (previewId && ids.includes(previewId)) {
                                            router.replace("/workspace/media");
                                        }
                                        router.refresh();
                                    } catch (err) {
                                        toast.error(
                                            err instanceof Error ? err.message : "Failed to delete files",
                                            { id: "media-bulk-delete" }
                                        );
                                    }
                                });
                            }}
                        >
                            {isDeletingBulk ? "Deleting…" : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


