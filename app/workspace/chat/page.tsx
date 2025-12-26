// app/workspace/chat/page.tsx
import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { MessagesSquare } from "lucide-react";
import { AiComposer } from "@/components/chat/ai-composer";

const mockChats = Array.from({ length: 10 }).map((_, i) => ({
    id: `chat-${i}`,
    title: "Test Chat",
}));

export default function ChatPage() {
    return (
        <SectionShell
            sectionLabel="Chat"
            breadcrumbLabel="Chats"
            icon={<MessagesSquare className="h-4 w-4" />}
            primaryActionLabel="New Chat"
            secondaryNavItems={[
                {
                    id: "new",
                    label: "New Chat",
                    icon: <MessagesSquare className="h-4 w-4" />,
                },
                {
                    id: "all",
                    label: "All Chats",
                    icon: <MessagesSquare className="h-4 w-4" />,
                    active: true,
                },
            ]}
            secondaryListItems={mockChats.map((m) => ({
                id: m.id,
                label: m.title,
                icon: <MessagesSquare className="h-4 w-4" />,
            }))}
        >
            <div className="mb-6">
                <AiComposer />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {mockChats.map((chat) => (
                    <ResourceCard
                        key={chat.id}
                        title={chat.title}
                        tagLabel="Chat"
                        icon={<MessagesSquare className="h-3 w-3" />}
                    />
                ))}
            </div>
        </SectionShell>
    );
}
