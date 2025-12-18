"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Image as ImageIcon, LayoutGrid, List, MoreHorizontal, Search, Trash2, Upload } from "lucide-react";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { deleteMediaFileAction, uploadMediaFileAction } from "@/app/workspace/media/actions";

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

export function MediaSection({ mediaFiles, sidebarGroups }: MediaSectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [uploadOpen, setUploadOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isUploading, startUpload] = useTransition();
    const [isDeleting, startDelete] = useTransition();
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const previewId = searchParams.get("preview");

    const selected = useMemo(
        () => (previewId ? mediaFiles.find((m) => m.id === previewId) ?? null : null),
        [mediaFiles, previewId]
    );

    const deleteTarget = useMemo(
        () => (deleteId ? mediaFiles.find((m) => m.id === deleteId) ?? null : null),
        [mediaFiles, deleteId]
    );

    const onPickFile = (file: File) => {
        const formData = new FormData();
        formData.set("file", file);
        setUploadError(null);

        startUpload(async () => {
            try {
                await uploadMediaFileAction(formData);
                setUploadOpen(false);
                router.refresh();
            } catch (e) {
                console.error(e);
                setUploadError(e instanceof Error ? e.message : "Upload failed");
            }
        });
    };

    return (
        <>
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
                        onClick: () => setUploadOpen(true),
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
                        <Input
                            placeholder="Search anything..."
                            className={cn(
                                "h-12 border-0 bg-transparent pl-8 text-2xl font-medium shadow-none",
                                "placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                            )}
                        />
                    </div>
                </div>

                {/* Action under search (right aligned) */}
                <div className="mb-8 flex items-center justify-end gap-2">
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
                        onClick={() => setUploadOpen(true)}
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {mediaFiles.map((m) => {
                        const type = kindLabel(m.mimeType);
                        const size = formatBytes(m.size);
                        return (
                            <div key={m.id} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        router.replace(`/workspace/media?preview=${m.id}`);
                                    }}
                                    className="w-full text-left"
                                >
                                    <ResourceCard
                                        title={m.name}
                                        tagLabel={`${type}${size ? ` • ${size}` : ""}`}
                                        icon={<ImageIcon className="h-3 w-3" />}
                                        className={cn(
                                            "cursor-pointer hover:shadow-md transition-shadow",
                                            "hover:border-border/80"
                                        )}
                                    />
                                </button>

                                <div className="absolute right-2 top-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                className="rounded-full bg-background/80 backdrop-blur"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setDeleteId(m.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        );
                    })}
                </div>
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

            {/* Delete confirm */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) setDeleteId(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete file?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.name ? `This will permanently delete “${deleteTarget.name}”.` : "This will permanently delete this file."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting || !deleteTarget}
                            onClick={() => {
                                if (!deleteTarget) return;
                                startDelete(async () => {
                                    await deleteMediaFileAction({ mediaId: deleteTarget.id });
                                    setDeleteId(null);
                                    if (previewId === deleteTarget.id) {
                                        router.replace("/workspace/media");
                                    }
                                    router.refresh();
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


