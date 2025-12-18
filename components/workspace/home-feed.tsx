"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Grid2X2,
    Home as HomeIcon,
    Image as ImageIcon,
    PenSquare,
    Search,
    SlidersHorizontal,
    Upload,
} from "lucide-react";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
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
import { createNoteAction } from "@/app/workspace/notes/actions";
import { createCanvasAction } from "@/app/workspace/canvas/actions";
import { uploadMediaFileAction } from "@/app/workspace/media/actions";

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

    const [filterKind, setFilterKind] = useState<FilterKind>("all");
    const [query, setQuery] = useState("");
    const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isCreating, startCreate] = useTransition();
    const [isUploading, startUpload] = useTransition();

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

    return (
        <>
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
                        <Input
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
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs"
                            disabled={isCreating}
                            onClick={() => {
                                startCreate(async () => {
                                    const id = await createNoteAction();
                                    router.push(`/workspace/notes/${id}`);
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
                                    const id = await createCanvasAction();
                                    router.push(`/workspace/canvas/${id}`);
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
                                setUploadError(null);
                                setUploadOpen(true);
                            }}
                        >
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {visibleItems.map((item) => {
                        const card = (
                            <ResourceCard
                                title={item.title}
                                tagLabel={item.tagLabel}
                                icon={kindIcon(item.kind)}
                                className="cursor-pointer hover:shadow-md transition-shadow hover:border-border/80"
                            />
                        );

                        if (item.kind === "Media") {
                            return (
                                <button
                                    key={`${item.kind}-${item.id}`}
                                    type="button"
                                    className="block text-left"
                                    onClick={() => setPreviewMediaId(item.id)}
                                >
                                    {card}
                                </button>
                            );
                        }

                        return (
                            <Link key={`${item.kind}-${item.id}`} href={item.href} className="block">
                                {card}
                            </Link>
                        );
                    })}
                </div>
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
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.set("file", file);
                            setUploadError(null);

                            startUpload(async () => {
                                try {
                                    await uploadMediaFileAction(formData);
                                    setUploadOpen(false);
                                    router.refresh();
                                } catch (err) {
                                    console.error(err);
                                    setUploadError(err instanceof Error ? err.message : "Upload failed");
                                } finally {
                                    e.currentTarget.value = "";
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
                            const formData = new FormData();
                            formData.set("file", file);
                            setUploadError(null);
                            startUpload(async () => {
                                try {
                                    await uploadMediaFileAction(formData);
                                    setUploadOpen(false);
                                    router.refresh();
                                } catch (err) {
                                    console.error(err);
                                    setUploadError(err instanceof Error ? err.message : "Upload failed");
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
        </>
    );
}


