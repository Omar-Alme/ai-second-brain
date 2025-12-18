import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { MediaSection } from "@/components/media/media-section";

export const metadata: Metadata = {
    title: "Media | Noma",
};

export default async function MediaPage({
    searchParams,
}: {
    searchParams?: { preview?: string };
}) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const profile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!profile) notFound();

    const mediaFiles = await prisma.mediaFile.findMany({
        where: { userId: profile.id },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true,
        },
    });

    const now = new Date().getTime();
    const pastWeek: typeof mediaFiles = [];
    const pastMonth: typeof mediaFiles = [];
    const older: typeof mediaFiles = [];

    for (const m of mediaFiles) {
        const days = Math.floor((now - m.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(m);
        else if (days <= 30) pastMonth.push(m);
        else older.push(m);
    }

    const previewId = searchParams?.preview ?? null;

    const toItems = (arr: typeof mediaFiles) =>
        arr.map((m) => ({
            id: m.id,
            label: m.name,
            href: `/workspace/media?preview=${m.id}`,
            active: previewId === m.id,
        }));

    return (
        <MediaSection
            mediaFiles={mediaFiles.map((m) => ({
                id: m.id,
                name: m.name,
                url: m.url,
                mimeType: m.mimeType,
                size: m.size,
                createdAt: m.createdAt.toISOString(),
            }))}
            sidebarGroups={[
                { id: "past-week", label: "Past week", items: toItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toItems(pastMonth) },
                { id: "older", label: "Older", items: toItems(older) },
            ]}
        />
    );
}
