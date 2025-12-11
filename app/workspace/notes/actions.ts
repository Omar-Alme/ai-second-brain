"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { JSONContent } from "@tiptap/core";

// Helper to get current user's profile id
async function getCurrentUserProfileId() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Not authenticated");

    const profile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });

    if (!profile) throw new Error("User profile not found");
    return profile.id;
}

/**
 * Create a new empty note for the current user.
 * Returns the new note id so the client can redirect.
 */
export async function createNoteAction() {
    const userProfileId = await getCurrentUserProfileId();

    const emptyDoc: JSONContent = {
        type: "doc",
        content: [{ type: "paragraph" }],
    };

    const note = await prisma.note.create({
        data: {
            userId: userProfileId,
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
    const userProfileId = await getCurrentUserProfileId();

    // Make sure the note belongs to this user
    const note = await prisma.note.findFirst({
        where: {
            id,
            userId: userProfileId,
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
