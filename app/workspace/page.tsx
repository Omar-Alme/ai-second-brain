// app/workspace/page.tsx
import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import {
    Home as HomeIcon,
    Image as ImageIcon,
    MessageSquare,
    PenSquare,
    Grid2X2,
} from "lucide-react";

const mockItems = [
    { id: "1", title: "Test notes", type: "Notes" as const },
    { id: "2", title: "Test canvas", type: "Canvas" as const },
    { id: "3", title: "Test media", type: "Media" as const },
    { id: "4", title: "Test notes", type: "Notes" as const },
    { id: "5", title: "Test canvas", type: "Canvas" as const },
    { id: "6", title: "Test notes", type: "Notes" as const },
    { id: "7", title: "Test media", type: "Media" as const },
];

function typeIcon(type: (typeof mockItems)[number]["type"]) {
    switch (type) {
        case "Notes":
            return <PenSquare className="h-3 w-3" />;
        case "Canvas":
            return <Grid2X2 className="h-3 w-3" />;
        case "Media":
            return <ImageIcon className="h-3 w-3" />;
    }
}

export default function WorkspaceHomePage() {
    return (
        <SectionShell
            sectionLabel="Home"
            breadcrumbLabel="Home"
            icon={<HomeIcon className="h-4 w-4" />}
            primaryActionLabel="New item"
            // onPrimaryActionClick={() => { ...later }}
            secondaryNavItems={[
                {
                    id: "workspace",
                    label: "My Workspace",
                    active: true,
                    icon: <HomeIcon className="h-4 w-4" />,
                },
            ]}
            secondaryListItems={mockItems.map((m) => ({
                id: m.id,
                label: m.title,
                icon: typeIcon(m.type),
            }))}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {mockItems.map((item) => (
                    <ResourceCard
                        key={item.id}
                        title={item.title}
                        tagLabel={item.type}
                        icon={typeIcon(item.type)}
                    />
                ))}
            </div>
        </SectionShell>
    );
}
