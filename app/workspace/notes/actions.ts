"use server";

import prisma from "@/lib/prisma";
import type { JSONContent } from "@tiptap/core";
import { getCurrentProfile } from "@/lib/get-current-profile";

/**
 * Create a new empty note for the current user.
 * Returns the new note id so the client can redirect.
 */
export async function createNoteAction() {
    const profile = await getCurrentProfile();

    const emptyDoc: JSONContent = {
        type: "doc",
        content: [{ type: "paragraph" }],
    };

    const note = await prisma.note.create({
        data: {
            userId: profile.id,
            title: "Untitled",
            content: emptyDoc,
        },
        select: { id: true },
    });

    return note.id;
}

/**
 * Update a note owned by the current user.
 */
export async function updateNoteAction(input: {
    id: string;
    title: string;
    content: JSONContent;
}) {
    const { id, title, content } = input;
    const profile = await getCurrentProfile();

    // Make sure the note belongs to this user
    const note = await prisma.note.findFirst({
        where: {
            id,
            userId: profile.id,
        },
        select: { id: true },
    });

    if (!note) {
        throw new Error("Note not found");
    }

    await prisma.note.update({
        where: { id: note.id },
        data: {
            title,
            content,
        },
    });
}

export async function deleteNoteAction(input: { id: string }) {
    const { id } = input;
    const profile = await getCurrentProfile();

    const note = await prisma.note.findFirst({
        where: { id, userId: profile.id },
        select: { id: true },
    });

    if (!note) throw new Error("Note not found");

    await prisma.note.delete({
        where: { id: note.id },
    });
}
