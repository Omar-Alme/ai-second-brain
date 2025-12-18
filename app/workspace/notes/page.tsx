import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { NotesSection } from "@/components/notes/notes-section";

export const metadata: Metadata = {
    title: "Notes | Noma",
};

export default async function NotesPage({
    searchParams,
}: {
    searchParams?: Promise<{ sort?: string }>;
}) {
    const sp = await searchParams;
    const sortOrder: "asc" | "desc" = sp?.sort === "asc" ? "asc" : "desc";

    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!userProfile) notFound();

    const notes = await prisma.note.findMany({
        where: { userId: userProfile.id },
        orderBy: { updatedAt: sortOrder },
        select: {
            id: true,
            title: true,
            updatedAt: true,
            createdAt: true,
        },
    });

    const now = new Date().getTime();
    const pastWeek: typeof notes = [];
    const pastMonth: typeof notes = [];
    const older: typeof notes = [];

    for (const n of notes) {
        const days = Math.floor((now - n.updatedAt.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(n);
        else if (days <= 30) pastMonth.push(n);
        else older.push(n);
    }

    const toItems = (arr: typeof notes) =>
        arr.map((n) => ({
            id: n.id,
            label: n.title || "Untitled Note",
            href: `/workspace/notes/${n.id}`,
        }));

    return (
        <NotesSection
            notes={notes.map((n) => ({
                id: n.id,
                title: n.title,
                updatedAt: n.updatedAt.toISOString(),
                createdAt: n.createdAt.toISOString(),
            }))}
            sortOrder={sortOrder}
            sidebarGroups={[
                { id: "past-week", label: "Past week", items: toItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toItems(pastMonth) },
                { id: "older", label: "Older", items: toItems(older) },
            ]}
        />
    );
}
