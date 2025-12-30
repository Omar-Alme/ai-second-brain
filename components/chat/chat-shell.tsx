"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessagesSquare, PlusSquare } from "lucide-react";
import { SectionShell } from "@/components/workspace/section-shell";
import { createChatSessionAction } from "@/app/workspace/chat/actions";
import { ChatThread } from "@/components/chat/chat-thread";

export function ChatShell(props: {
  activeSessionId?: string;
  sidebarGroups: { id: string; label: string; items: { id: string; label: string; href: string; active?: boolean }[] }[];
  initialMessages: { id: string; role: "user" | "assistant"; content: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <SectionShell
      sectionLabel="Chat"
      breadcrumbLabel="Chat"
      icon={<MessagesSquare className="h-4 w-4" />}
      showSearch={false}
      secondaryNavItems={[
        {
          id: "new",
          label: pending ? "Creating…" : "New Chat",
          icon: <PlusSquare className="h-4 w-4" />,
          onClick: () => {
            start(async () => {
              const id = await createChatSessionAction();
              router.push(`/workspace/chat/${id}`);
              router.refresh();
            });
          },
        },
        {
          id: "all",
          label: "My Chats",
          icon: <MessagesSquare className="h-4 w-4" />,
          href: "/workspace/chat",
        },
      ]}
      secondaryListGroups={props.sidebarGroups}
    >
      <ChatThread
        initialSessionId={props.activeSessionId ?? ""}
        initialMessages={props.initialMessages}
        onCreatedSession={(id) => {
          router.replace(`/workspace/chat/${id}`);
          router.refresh();
        }}
      />
    </SectionShell>
  );
}


