"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InlineTitle({
    value,
    onChange,
    placeholder = "Untitled",
    className,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    if (!editing) {
        return (
            <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn("truncate hover:underline text-left", className)}
            >
                {value.trim() || placeholder}
            </button>
        );
    }

    return (
        <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") setEditing(false);
            }}
            className={cn(
                "h-7 w-[260px] bg-background text-xs",
                className
            )}
        />
    );
}
