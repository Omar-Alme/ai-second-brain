// app/workspace/canvas/page.tsx
import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Grid2X2, PlusSquare } from "lucide-react";
import { mock } from "node:test";

const mockCanvas = Array.from({ length: 10 }).map((_, i) => ({
    id: `canvas-${i}`,
    title: "Test canvas",
}));

export default function CanvasPage() {
    return (
        <SectionShell
            sectionLabel="Canvas"
            breadcrumbLabel="Canvas"
            icon={<Grid2X2 className="h-4 w-4" />}
            primaryActionLabel="New Canvas"
            secondaryNavItems={[
                {
                    id: "new",
                    label: "New Canvas",
                    icon: <PlusSquare className="h-4 w-4" />,
                },
                {
                    id: "all",
                    label: "All Canvas",
                    icon: <Grid2X2 className="h-4 w-4" />,
                    active: true,
                },
            ]}
            secondaryListItems={mockCanvas.map((m) => ({
                id: m.id,
                label: m.title,
                icon: <Grid2X2 className="h-4 w-4" />,
            }))}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {mockCanvas.map((c) => (
                    <ResourceCard
                        key={c.id}
                        title={c.title}
                        tagLabel="Canvas"
                        icon={<Grid2X2 className="h-3 w-3" />}
                    />
                ))}
            </div>
        </SectionShell>
    );
}
