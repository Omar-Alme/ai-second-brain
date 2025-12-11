// app/workspace/media/page.tsx
import { SectionShell } from "@/components/workspace/section-shell";
import { ResourceCard } from "@/components/workspace/resource-card";
import { Image as ImageIcon, Upload } from "lucide-react";

const mockMedia = Array.from({ length: 10 }).map((_, i) => ({
    id: `media-${i}`,
    title: "Test Media",
}));

export default function MediaPage() {
    return (
        <SectionShell
            sectionLabel="Media"
            breadcrumbLabel="Media"
            icon={<ImageIcon className="h-4 w-4" />}
            primaryActionLabel="Upload"
            secondaryNavItems={[
                {
                    id: "upload",
                    label: "Upload",
                    icon: <Upload className="h-4 w-4" />,
                },
                {
                    id: "all",
                    label: "All Media",
                    icon: <ImageIcon className="h-4 w-4" />,
                    active: true,
                },
            ]}
            secondaryListItems={mockMedia.map((m) => ({
                id: m.id,
                label: m.title,
                icon: <ImageIcon className="h-4 w-4" />,
            }))}
        >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {mockMedia.map((m) => (
                    <ResourceCard
                        key={m.id}
                        title={m.title}
                        tagLabel="Media"
                        icon={<ImageIcon className="h-3 w-3" />}
                    />
                ))}
            </div>
        </SectionShell>
    );
}
