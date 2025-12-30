import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCurrentProfile } from "@/lib/get-current-profile";

/**
 * Force sync the UserProfile plan with Clerk billing.
 * This endpoint can be called after checkout to ensure immediate sync.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // getCurrentProfile() now always syncs the plan from Clerk billing
    const profile = await getCurrentProfile();

    return NextResponse.json({
      success: true,
      plan: profile.plan,
    });
  } catch (err) {
    console.error("[api/billing/sync] error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

