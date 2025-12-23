import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { TLEditorSnapshot } from "tldraw";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CanvasDetailView } from "@/components/canvas/canvas-detail-view";

export const metadata: Metadata = {
    title: "Canvas | Noma",
};

type CanvasPageProps = {
    params: Promise<{ canvasId: string }>;
};

export default async function CanvasEditorPage({ params }: CanvasPageProps) {
    const { canvasId } = await params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!userProfile) notFound();

    const [canvas, canvases] = await Promise.all([
        prisma.canvas.findFirst({
            where: { id: canvasId, userId: userProfile.id },
        }),
        prisma.canvas.findMany({
            where: { userId: userProfile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
        }),
    ]);

    if (!canvas) notFound();

    const initialSnapshot = (canvas.document as TLEditorSnapshot | null) ?? null;
    const now = new Date().getTime();

    const pastWeek: { id: string; title: string | null; updatedAt: string }[] = [];
    const pastMonth: { id: string; title: string | null; updatedAt: string }[] = [];
    const older: { id: string; title: string | null; updatedAt: string }[] = [];

    for (const c of canvases.map((c) => ({
        id: c.id,
        title: c.title,
        updatedAt: c.updatedAt.toISOString(),
    }))) {
        const days = Math.floor((now - new Date(c.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(c);
        else if (days <= 30) pastMonth.push(c);
        else older.push(c);
    }

    const toItems = (arr: typeof pastWeek) =>
        arr.map((c) => ({
            id: c.id,
            label: c.title || "Untitled Canvas",
            href: `/workspace/canvas/${c.id}`,
            active: c.id === canvas.id,
        }));

    return (
        <CanvasDetailView
                    canvasId={canvas.id}
                    initialTitle={canvas.title ?? "Untitled"}
                    initialSnapshot={initialSnapshot}
            initialUpdatedAt={canvas.updatedAt.toISOString()}
            sidebarGroups={[
                { id: "past-week", label: "Past week", items: toItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toItems(pastMonth) },
                { id: "older", label: "Older", items: toItems(older) },
            ]}
        />
    );
}
