// app/workspace/canvas/actions.ts
"use server";

import prisma from "@/lib/prisma";
import type { TLEditorSnapshot } from "tldraw";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { Prisma } from "@/app/generated/prisma/client";

export async function createCanvasAction() {
    const profile = await getCurrentProfile();

    const canvas = await prisma.canvas.create({
        data: {
            userId: profile.id,
            title: "Untitled",
            // DB column is JSONB NOT NULL (see initial migration), so we must write a value.
            // Use JSON null rather than SQL NULL to satisfy the constraint.
            document: Prisma.JsonNull,
        },
        select: { id: true },
    });

    return canvas.id;
}

export async function updateCanvasAction(input: {
    id: string;
    title: string;
    document: TLEditorSnapshot;
}) {
    const { id, title, document } = input;
    const profile = await getCurrentProfile();

    const canvas = await prisma.canvas.findFirst({
        where: { id, userId: profile.id },
        select: { id: true },
    });

    if (!canvas) throw new Error("Canvas not found");

    const jsonSnapshot = JSON.parse(JSON.stringify(document));

    await prisma.canvas.update({
        where: { id: canvas.id },
        data: {
            title: title.trim() || "Untitled",
            document: jsonSnapshot,
        },
    });
}

export async function deleteCanvasAction(input: { id: string }) {
    const { id } = input;
    const profile = await getCurrentProfile();

    const canvas = await prisma.canvas.findFirst({
        where: { id, userId: profile.id },
        select: { id: true },
    });

    if (!canvas) throw new Error("Canvas not found");

    await prisma.canvas.delete({
        where: { id: canvas.id },
    });
}
