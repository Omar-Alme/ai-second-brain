"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Star, MoreHorizontal } from "lucide-react";

type NoteEditorProps = {
    noteId: string;
    initialTitle: string;
    initialContent: JSONContent | null;
    onSave: (input: {
        id: string;
        title: string;
        content: JSONContent;
    }) => Promise<void>;
};

export function NoteEditor({
    noteId,
    initialTitle,
    initialContent,
    onSave,
}: NoteEditorProps) {
    const [title, setTitle] = useState(initialTitle || "");
    const [isPending, startTransition] = useTransition();
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const saveTimerRef = useRef<number | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Press / for commands…",
            }),
        ],
        content: initialContent ?? {
            type: "doc",
            content: [{ type: "paragraph" }],
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-neutral dark:prose-invert max-w-none focus:outline-none text-base leading-relaxed",
            },
        },
        immediatelyRender: false,
    });

    const scheduleSave = useCallback(() => {
        if (!editor) return;

        if (saveTimerRef.current) {
            window.clearTimeout(saveTimerRef.current);
        }

        // debounce ~1s after last change
        saveTimerRef.current = window.setTimeout(() => {
            startTransition(async () => {
                await onSave({
                    id: noteId,
                    title: title.trim() || "Untitled",
                    content: editor.getJSON(),
                });
                setLastSaved(new Date());
            });
        }, 1000);
    }, [editor, noteId, onSave, title]);

    // watch editor updates for autosave
    useEffect(() => {
        if (!editor) return;

        const handler = () => {
            scheduleSave();
        };

        editor.on("update", handler);
        return () => {
            editor.off("update", handler);
            if (saveTimerRef.current) {
                window.clearTimeout(saveTimerRef.current);
            }
        };
    }, [editor, scheduleSave]);

    // when title changes, also schedule save
    useEffect(() => {
        if (!editor) return;
        if (!editor.isDestroyed) {
            scheduleSave();
        }
    }, [title, editor, scheduleSave]);

    const statusLabel = isPending
        ? "Saving…"
        : lastSaved
            ? "Edited just now"
            : "Saved";

    return (
        <div className="flex h-full flex-col">
            {/* Top bar: breadcrumb, status, actions */}
            <header className="flex items-center justify-between border-b px-10 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="cursor-pointer hover:underline">Home</span>
                    <span>/</span>
                    <span className="flex items-center gap-1">
                        {/* small note icon via pseudo emoji */}
                        <span className="inline-block h-4 w-4 rounded-sm border bg-muted" />
                        <span className="truncate max-w-[220px]">
                            {title.trim() || "Untitled note"}
                        </span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{statusLabel}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 rounded-full px-3 text-xs"
                    >
                        Share
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                    >
                        <Star className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                    >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </header>

            {/* Main editor area */}
            <main className="flex-1 overflow-y-auto px-10 pb-24 pt-12">
                <div className="mx-auto w-full max-w-3xl">
                    {/* Title */}
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Heading"
                        className={cn(
                            "border-none px-0 text-3xl font-serif font-semibold tracking-tight bg-transparent",
                            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none",
                            "shadow-none rounded-none",
                            "placeholder:italic placeholder:text-muted-foreground/60"
                        )}
                    />


                    <Separator className="my-4 opacity-0" />

                    {/* Body editor */}
                    <div
                        className={cn(
                            "min-h-[60vh] rounded-lg px-0 py-1",
                            "focus-within:bg-background"
                        )}
                    >
                        {editor && <EditorContent editor={editor} />}
                    </div>

                    {/* tiny footer hint */}
                    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="border-dashed px-2 py-0">
                            /
                        </Badge>
                        <span>Type “/” for commands</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
