import Link from "next/link";
import { notFound } from "next/navigation";
import { Grid2X2, Home as HomeIcon, Image as ImageIcon, PenSquare, Search } from "lucide-react";

import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";

type WorkspaceKind = "Notes" | "Canvas" | "Media";

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

function mediaKindLabel(mimeType: string) {
    if (mimeType === "application/pdf") return "PDF";
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("audio/")) return "Audio";
    return "Media";
}

export default async function WorkspaceHomePage() {
    let profile: Awaited<ReturnType<typeof getCurrentProfile>>;
    try {
        profile = await getCurrentProfile();
    } catch {
        notFound();
    }

    const [notes, canvases, mediaFiles] = await Promise.all([
        prisma.note.findMany({
            where: { userId: profile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
            take: 50,
        }),
        prisma.canvas.findMany({
            where: { userId: profile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
            take: 50,
        }),
        prisma.mediaFile.findMany({
            where: { userId: profile.id },
            orderBy: { createdAt: "desc" },
            select: { id: true, name: true, mimeType: true, size: true, createdAt: true },
            take: 50,
        }),
    ]);

    const items = [
        ...notes.map((n) => ({
            id: n.id,
            title: n.title || "Untitled Note",
            kind: "Notes" as const,
            href: `/workspace/notes/${n.id}`,
            tagLabel: "Notes",
            activityAtMs: n.updatedAt.getTime(),
        })),
        ...canvases.map((c) => ({
            id: c.id,
            title: c.title || "Untitled Canvas",
            kind: "Canvas" as const,
            href: `/workspace/canvas/${c.id}`,
            tagLabel: "Canvas",
            activityAtMs: c.updatedAt.getTime(),
        })),
        ...mediaFiles.map((m) => ({
            id: m.id,
            title: m.name,
            kind: "Media" as const,
            href: `/workspace/media?preview=${m.id}`,
            tagLabel: mediaKindLabel(m.mimeType),
            activityAtMs: m.createdAt.getTime(),
        })),
    ].sort((a, b) => b.activityAtMs - a.activityAtMs);

    const now = new Date().getTime();
    const pastWeek: typeof items = [];
    const pastMonth: typeof items = [];
    const older: typeof items = [];

    for (const item of items) {
        const days = Math.floor((now - item.activityAtMs) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(item);
        else if (days <= 30) pastMonth.push(item);
        else older.push(item);
    }

    const toSidebarItems = (arr: typeof items) =>
        arr.map((i) => ({
            id: i.id,
            label: i.title,
            href: i.href,
            icon: kindIcon(i.kind),
        }));

    return (
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
            secondaryListGroups={[
                { id: "past-week", label: "Past week", items: toSidebarItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toSidebarItems(pastMonth) },
                { id: "older", label: "Older", items: toSidebarItems(older) },
            ]}
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
                {items.map((item) => (
                    <Link key={`${item.kind}-${item.id}`} href={item.href} className="block">
                        <ResourceCard
                            title={item.title}
                            tagLabel={item.tagLabel}
                            icon={kindIcon(item.kind)}
                            className="cursor-pointer hover:shadow-md transition-shadow hover:border-border/80"
                        />
                    </Link>
                ))}
            </div>
        </SectionShell>
    );
}
