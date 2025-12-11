import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { SidebarInset } from "@/components/ui/sidebar";
import { NotesSection } from "@/components/notes/notes-section";

export const metadata: Metadata = {
    title: "Notes | Noma",
};

export default async function NotesPage() {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();

    const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId },
        select: { id: true },
    });
    if (!userProfile) notFound();

    const notes = await prisma.note.findMany({
        where: { userId: userProfile.id },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            title: true,
            updatedAt: true,
            createdAt: true,
        },
    });

    return (
        <SidebarInset>
            <NotesSection
                notes={notes.map((n) => ({
                    id: n.id,
                    title: n.title,
                    updatedAt: n.updatedAt.toISOString(),
                    createdAt: n.createdAt.toISOString(),
                }))}
            />
        </SidebarInset>
    );
}
