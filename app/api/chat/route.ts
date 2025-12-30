import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getBillingEntitlements } from "@/lib/billing/entitlements";
import { DEFAULT_OPENROUTER_MODEL, isAllowedOpenRouterModel } from "@/lib/ai/openrouterModels";

type ReqBody = {
  message: string;
  sessionId?: string;
  model?: string;
};

function monthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function clampString(input: string, maxChars: number) {
  const s = input ?? "";
  if (s.length <= maxChars) return s;
  return s.slice(0, maxChars) + "…";
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function buildSystemPrompt(): string {
  return [
    "You are a personal knowledge assistant.",
    "You have access to the user's notes and canvases.",
    "Answer questions ONLY using this information.",
    "If the answer is not present, say you don’t know.",
    "Mention note or canvas titles when relevant.",
    "Be concise and helpful.",
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as Partial<ReqBody>;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    const requestedModel = typeof body.model === "string" ? body.model.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Billing quota enforcement (matches our billing usage definition)
    const entitlements = await getBillingEntitlements();
    const used = await prisma.chatMessage.count({
      where: {
        role: "user",
        session: { userId: profile.id },
        ...(entitlements.isPro ? { createdAt: { gte: monthStart() } } : {}),
      },
    });
    if (used >= entitlements.aiMessagesLimit) {
      return NextResponse.json(
        { error: "AI quota reached. Upgrade to Pro for higher limits." },
        { status: 402 }
      );
    }

    // Create or validate session
    const session =
      sessionId
        ? await prisma.chatSession.findFirst({
            where: { id: sessionId, userId: profile.id },
            select: { id: true },
          })
        : null;

    const ensuredSession =
      session ??
      (await prisma.chatSession.create({
        data: {
          userId: profile.id,
          title: clampString(message, 60),
        },
        select: { id: true },
      }));

    // Persist user message
    await prisma.chatMessage.create({
      data: {
        sessionId: ensuredSession.id,
        role: "user",
        content: message,
      },
    });

    // Context building removed - AI feature not implemented for MVP

    const apiKey = requireEnv("OPENROUTER_API_KEY");
    const envModel = (process.env.OPENROUTER_MODEL ?? "").trim();
    const model =
      (requestedModel && isAllowedOpenRouterModel(requestedModel) && requestedModel) ||
      (envModel && isAllowedOpenRouterModel(envModel) && envModel) ||
      DEFAULT_OPENROUTER_MODEL;

    const siteUrl = (process.env.OPENROUTER_SITE_URL ?? "").trim();
    const appName = (process.env.OPENROUTER_APP_NAME ?? "").trim();

    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(siteUrl ? { "HTTP-Referer": siteUrl } : {}),
        ...(appName ? { "X-Title": appName } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: message },
        ],
      }),
    });

    if (!openrouterRes.ok) {
      const errText = await openrouterRes.text();
      return NextResponse.json(
        { error: "LLM request failed", details: errText },
        { status: 502 }
      );
    }

    const json = (await openrouterRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const assistant =
      (json?.choices?.[0]?.message?.content as string | undefined)?.trim() ??
      "I don't know.";

    // Persist assistant response
    await prisma.chatMessage.create({
      data: {
        sessionId: ensuredSession.id,
        role: "assistant",
        content: assistant,
      },
    });

    return NextResponse.json({
      sessionId: ensuredSession.id,
      response: assistant,
      model,
    });
  } catch (err) {
    console.error("[api/chat] error", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}


