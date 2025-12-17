"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
    title: string;
    tagLabel: string;
    icon?: ReactNode;
    className?: string;
}

export function ResourceCard({
    title,
    tagLabel,
    icon,
    className,
}: ResourceCardProps) {
    return (
        <div
            className={cn(
                "flex h-40 flex-col justify-between rounded-xl border bg-card shadow-sm",
                "bg-linear-to-b from-muted/40 to-muted/10",
                "px-4 py-3 text-xs",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <span className="font-medium text-foreground/80 truncate">
                    {title}
                </span>
            </div>

            <div className="flex justify-start">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                    {icon && <span className="text-xs">{icon}</span>}
                    {tagLabel}
                </span>
            </div>
        </div>
    );
}
