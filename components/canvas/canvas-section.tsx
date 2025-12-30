"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { SelectionActionBar } from "@/components/workspace/selection-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Grid2X2, LayoutGrid, List, PlusSquare, Search } from "lucide-react";
import { createCanvasAction, deleteCanvasesAction } from "@/app/workspace/canvas/actions";
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

type CanvasListItem = {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type CanvasSectionProps = {
    canvases: CanvasListItem[];
    sortOrder: "asc" | "desc";
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string }[];
    }[];
};

export function CanvasSection({ canvases, sortOrder, sidebarGroups }: CanvasSectionProps) {
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
        const limit = billing.entitlements?.canvasesLimit ?? null;
        return limit !== null && canvases.length >= limit;
    }, [billing.entitlements?.canvasesLimit, billing.status, canvases.length]);

    const handleCreateCanvas = () => {
        if (isCreateBlocked) return;
        startTransition(async () => {
            try {
                setCreateError(null);
                const id = await createCanvasAction();
                router.push(`/workspace/canvas/${id}`);
            } catch (err) {
                setCreateError(err instanceof Error ? err.message : "Failed to create canvas");
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
        <SectionShell
            sectionLabel="Canvas"
            breadcrumbLabel="Canvas"
            icon={<Grid2X2 className="h-4 w-4" />}
            showSearch={false}
            secondaryNavItems={[
                {
                    id: "new",
                    label: isPending ? "Creating…" : "New canvas",
                    icon: <PlusSquare className="h-4 w-4" />,
                    onClick: handleCreateCanvas,
                    disabled: isCreateBlocked || isPending,
                    disabledReason: isCreateBlocked
                        ? "Free plan limit reached. Upgrade to Pro for unlimited canvases."
                        : undefined,
                },
                {
                    id: "all",
                    label: "All canvas",
                    icon: <Grid2X2 className="h-4 w-4" />,
                    active: true,
                    href: "/workspace/canvas",
                },
            ]}
            secondaryListGroups={sidebarGroups}
        >
            {(isCreateBlocked || createError) && (
                <div className="mb-6 rounded-2xl border border-border bg-white/60 p-4 shadow-sm backdrop-blur">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold">You’ve hit the Free plan limit</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {createError ?? "Upgrade to Pro for unlimited canvases and higher AI limits."}
                            </p>
                        </div>
                        <UpgradeToProButton className="rounded-full">Upgrade</UpgradeToProButton>
                    </div>
                </div>
            )}

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
                        onClick={handleCreateCanvas}
                        disabled={isPending || isCreateBlocked}
                        title={
                            isCreateBlocked
                                ? "Free plan limit reached. Upgrade to Pro for unlimited canvases."
                                : undefined
                        }
                    >
                        <PlusSquare className="h-4 w-4" />
                        {isPending ? "Creating…" : "New Canvas"}
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {canvases.map((c) => (
                    <ResourceCard
                        key={c.id}
                        title={c.title || "Untitled"}
                        tagLabel="Canvas"
                        icon={<Grid2X2 className="h-3 w-3" />}
                        selected={selectedIds.has(c.id)}
                        onSelectChange={(selected) => {
                            if (selected) {
                                setSelectedIds((prev) => new Set(prev).add(c.id));
                            } else {
                                setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    next.delete(c.id);
                                    return next;
                                });
                            }
                        }}
                        onClick={() => {
                            if (!selectedIds.has(c.id)) {
                                router.push(`/workspace/canvas/${c.id}`);
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
                            Delete {selectedIds.size} {selectedIds.size === 1 ? "canvas" : "canvases"}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the selected canvases.
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
                                        await deleteCanvasesAction({ ids });
                                        setBulkDeleteOpen(false);
                                        setSelectedIds(new Set());
                                        router.refresh();
                                    } catch (err) {
                                        console.error("Failed to delete canvases:", err);
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
