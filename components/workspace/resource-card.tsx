"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface ResourceCardProps {
    title: string;
    tagLabel: string;
    icon?: ReactNode;
    className?: string;
    variant?: "grid" | "list";
    selected?: boolean;
    onSelectChange?: (selected: boolean) => void;
    onClick?: () => void;
}

export function ResourceCard({
    title,
    tagLabel,
    icon,
    className,
    variant = "grid",
    selected = false,
    onSelectChange,
    onClick,
}: ResourceCardProps) {
    const checkbox = (
        <Checkbox
            checked={selected}
            onCheckedChange={(checked) => {
                onSelectChange?.(checked === true);
            }}
            onClick={(e) => {
                e.stopPropagation();
            }}
            aria-label={selected ? `Deselect ${title}` : `Select ${title}`}
            title={selected ? "Deselect" : "Select"}
            className={cn(
                "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity data-[state=checked]:opacity-100"
            )}
        />
    );

    return (
        <div
            className={cn(
                "group relative rounded-xl border bg-card shadow-sm transition-all duration-200",
                selected && "ring-2 ring-primary border-primary",
                onClick && "cursor-pointer hover:shadow-md",
                variant === "grid" && [
                    "flex h-40 flex-col justify-between",
                    "bg-linear-to-b from-muted/40 to-muted/10",
                    "px-4 py-3 text-xs",
                ],
                variant === "list" && [
                    "flex items-center justify-between",
                    "px-4 py-3",
                ],
                className
            )}
            onClick={onClick}
        >
            {variant === "grid" ? (
                <>
                    <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-foreground/80 truncate flex-1">
                            {title}
                        </span>
                        {checkbox}
                    </div>

                    <div className="flex justify-start">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                            {icon && <span className="text-xs">{icon}</span>}
                            {tagLabel}
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex min-w-0 items-center gap-3">
                        {icon && (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                {icon}
                            </span>
                        )}
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-foreground">
                                {title}
                            </div>
                            <div className="truncate text-xs text-muted-foreground">
                                {tagLabel}
                            </div>
                        </div>
                    </div>
                    {checkbox}
                </>
            )}
        </div>
    );
}
