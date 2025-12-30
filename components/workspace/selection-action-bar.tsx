"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectionActionBarProps {
    selectedCount: number;
    onDelete: () => void;
    onClearSelection: () => void;
    isDeleting?: boolean;
}

export function SelectionActionBar({
    selectedCount,
    onDelete,
    onClearSelection,
    isDeleting = false,
}: SelectionActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
                "flex items-center gap-3 rounded-full border border-border bg-background/95 backdrop-blur-md",
                "px-4 py-2 shadow-lg",
                "animate-in slide-in-from-bottom-4 fade-in-0 duration-200"
            )}
        >
            <span className="text-sm font-medium text-foreground">
                {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-8 rounded-full"
            >
                <X className="h-4 w-4" />
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="h-8 rounded-full"
            >
                <Trash2 className="mr-1.5 h-4 w-4" />
                {isDeleting ? "Deleting…" : "Delete"}
            </Button>
        </div>
    );
}

