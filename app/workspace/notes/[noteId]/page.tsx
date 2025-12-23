import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/core";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NoteDetailView } from "@/components/notes/note-detail-view";

export const metadata: Metadata = {
    title: "Note | Noma",
};

type NotePageProps = {
    params: Promise<{ noteId: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
    const { noteId } = await params;
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!userProfile) notFound();

    const [note, notes] = await Promise.all([
        prisma.note.findFirst({
            where: { id: noteId, userId: userProfile.id },
        }),
        prisma.note.findMany({
            where: { userId: userProfile.id },
            orderBy: { updatedAt: "desc" },
            select: { id: true, title: true, updatedAt: true },
        }),
    ]);

    if (!note) notFound();

    const content = (note.content as JSONContent | null) ?? null;
    const now = new Date().getTime();

    const pastWeek: { id: string; title: string | null; updatedAt: string }[] = [];
    const pastMonth: { id: string; title: string | null; updatedAt: string }[] = [];
    const older: { id: string; title: string | null; updatedAt: string }[] = [];

    for (const n of notes.map((n) => ({
        id: n.id,
        title: n.title,
        updatedAt: n.updatedAt.toISOString(),
    }))) {
        const days = Math.floor((now - new Date(n.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 7) pastWeek.push(n);
        else if (days <= 30) pastMonth.push(n);
        else older.push(n);
    }

    const toItems = (arr: typeof pastWeek) =>
        arr.map((n) => ({
            id: n.id,
            label: n.title || "Untitled Note",
            href: `/workspace/notes/${n.id}`,
            active: n.id === note.id,
        }));

    return (
        <NoteDetailView
                noteId={note.id}
                initialTitle={note.title ?? ""}
                initialContent={content}
            initialUpdatedAt={note.updatedAt.toISOString()}
            sidebarGroups={[
                { id: "past-week", label: "Past week", items: toItems(pastWeek) },
                { id: "past-month", label: "Past month", items: toItems(pastMonth) },
                { id: "older", label: "Older", items: toItems(older) },
            ]}
            />
    );
}
