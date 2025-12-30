"use server";

import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";

export async function createChatSessionAction() {
  const profile = await getCurrentProfile();
  const session = await prisma.chatSession.create({
    data: { userId: profile.id, title: "New chat" },
    select: { id: true },
  });
  return session.id;
}


