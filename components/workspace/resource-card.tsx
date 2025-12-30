"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ResourceCardProps {
    title: string;
    tagLabel: string;
    icon?: ReactNode;
    className?: string;
    selected?: boolean;
    onSelectChange?: (selected: boolean) => void;
    onClick?: () => void;
}

export function ResourceCard({
    title,
    tagLabel,
    icon,
    className,
    selected = false,
    onSelectChange,
    onClick,
}: ResourceCardProps) {
    return (
        <div
            className={cn(
                "group relative flex h-40 flex-col justify-between rounded-xl border bg-card shadow-sm",
                "bg-linear-to-b from-muted/40 to-muted/10",
                "px-4 py-3 text-xs",
                "transition-all duration-200",
                selected && "ring-2 ring-primary border-primary",
                onClick && "cursor-pointer hover:shadow-md",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-foreground/80 truncate flex-1">
                    {title}
                </span>
                <Checkbox
                    checked={selected}
                    onCheckedChange={(checked) => {
                        onSelectChange?.(checked === true);
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=checked]:opacity-100"
                />
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
