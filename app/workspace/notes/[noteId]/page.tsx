import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/core";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SidebarInset } from "@/components/ui/sidebar";
import { NoteEditor } from "@/components/notes/note-editor";
import { updateNoteAction } from "../actions";

export const metadata: Metadata = {
    title: "Note | Noma",
};

type NotePageProps = {
    params: { noteId: string };
};

export default async function NotePage({ params }: NotePageProps) {
    const { noteId } = params;
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
        // workspace layout already protects this, but safety first
        notFound();
    }

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: clerkUserId! },
        select: { id: true },
    });

    if (!userProfile) {
        notFound();
    }

    const note = await prisma.note.findFirst({
        where: {
            id: noteId,
            userId: userProfile.id,
        },
    });

    if (!note) {
        notFound();
    }

    const content = (note.content as JSONContent | null) ?? null;

    return (
        <SidebarInset>
            <NoteEditor
                noteId={note.id}
                initialTitle={note.title ?? ""}
                initialContent={content}
                onSave={updateNoteAction}
            />
        </SidebarInset>
    );
}
