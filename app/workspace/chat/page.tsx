import type { Metadata } from "next";
import { MessagesSquare } from "lucide-react";
import { SectionShell } from "@/components/workspace/section-shell";
import { ChatPlaceholder } from "@/components/chat/chat-placeholder";

export const metadata: Metadata = { title: "Chat | Noma" };

export default function ChatIndexPage() {
  return (
    <SectionShell
      sectionLabel="Chat"
      breadcrumbLabel="Chat"
      icon={<MessagesSquare className="h-4 w-4" />}
      showSearch={false}
    >
      <ChatPlaceholder />
    </SectionShell>
  );
}
