import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Noma",
};

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function ChatSessionPage({ params }: PageProps) {
  await params; // Consume params to avoid unused warning
  // Redirect to main chat page since AI feature is not implemented
  redirect("/workspace/chat");
}


