"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Grid2X2, LayoutGrid, List, PlusSquare, Search } from "lucide-react";
import { createCanvasAction } from "@/app/workspace/canvas/actions";

type CanvasListItem = {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
};

type CanvasSectionProps = {
    canvases: CanvasListItem[];
    sidebarGroups: {
        id: string;
        label: string;
        items: { id: string; label: string; href: string }[];
    }[];
};

export function CanvasSection({ canvases, sidebarGroups }: CanvasSectionProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCreateCanvas = () => {
        startTransition(async () => {
            const id = await createCanvasAction();
            router.push(`/workspace/canvas/${id}`);
        });
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
                    onClick={handleCreateCanvas}
                    disabled={isPending}
                >
                    <PlusSquare className="h-4 w-4" />
                    {isPending ? "Creating…" : "New Canvas"}
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {canvases.map((c) => (
                    <Link key={c.id} href={`/workspace/canvas/${c.id}`}>
                        <ResourceCard
                            title={c.title || "Untitled"}
                            tagLabel="Canvas"
                            icon={<Grid2X2 className="h-3 w-3" />}
                        />
                    </Link>
                ))}
            </div>
        </SectionShell>
    );
}
