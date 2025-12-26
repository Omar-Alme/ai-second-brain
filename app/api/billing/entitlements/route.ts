import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { getBillingEntitlements } from "@/lib/billing/entitlements";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function monthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function GET() {
  const { userId } = await auth();
  const entitlements = await getBillingEntitlements();

  // If not signed in, just return entitlements with zero usage.
  if (!userId) {
    return NextResponse.json({
      entitlements,
      usage: {
        notesUsed: 0,
        canvasesUsed: 0,
        aiMessagesUsed: 0,
        storageUsedBytes: 0,
      },
    });
  }

  // Signed in: compute usage from DB (notes/canvases count, chat messages as AI usage placeholder).
  const profile = await getCurrentProfile({ syncPlanKey: entitlements.isPro ? "pro" : "free" });

  const [notesUsed, canvasesUsed, aiMessagesUsed, storageAgg] = await Promise.all([
    prisma.note.count({ where: { userId: profile.id } }),
    prisma.canvas.count({ where: { userId: profile.id } }),
    prisma.chatMessage.count({
      where: {
        role: "user",
        session: {
          userId: profile.id,
        },
        ...(entitlements.isPro
          ? {
              createdAt: { gte: monthStart() },
            }
          : {}),
      },
    }),
    prisma.mediaFile.aggregate({
      where: { userId: profile.id },
      _sum: { size: true },
    }),
  ]);

  return NextResponse.json({
    entitlements,
    usage: {
      notesUsed,
      canvasesUsed,
      aiMessagesUsed,
      storageUsedBytes: storageAgg._sum.size ?? 0,
    },
  });
}


