// app/workspace/canvas/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { CanvasSection } from "@/components/canvas/canvas-section";

export const metadata: Metadata = {
    title: "Canvas | Noma",
};

export default async function CanvasPage() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!userProfile) notFound();

    const canvases = await prisma.canvas.findMany({
        where: { userId: userProfile.id },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            title: true,
            updatedAt: true,
            createdAt: true,
        },
    });

    const now = new Date().getTime();
    const pastWeek: typeof canvases = [];
    const pastMonth: typeof canvases = [];
    const older: typeof canvases = [];

    for (const c of canvases) {
        const days = Math.floor((now - c.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(c);
        else if (days <= 30) pastMonth.push(c);
        else older.push(c);
    }

    const toItems = (arr: typeof canvases) =>
        arr.map((c) => ({
            id: c.id,
            label: c.title || "Untitled Canvas",
            href: `/workspace/canvas/${c.id}`,
        }));

    return (
        <CanvasSection
            canvases={canvases.map((c) => ({
                id: c.id,
                title: c.title,
                updatedAt: c.updatedAt.toISOString(),
                createdAt: c.createdAt.toISOString(),
            }))}
            sidebarGroups={[
                { id: "past-week", label: "Past week", items: toItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toItems(pastMonth) },
                { id: "older", label: "Older", items: toItems(older) },
            ]}
        />
    );
}
