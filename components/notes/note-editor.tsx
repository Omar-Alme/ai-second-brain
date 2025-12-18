"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

type NoteEditorProps = {
    noteId: string;
    title: string;
    onTitleChange: (nextTitle: string) => void;
    initialContent: JSONContent | null;
    onSave: (input: { id: string; title: string; content: JSONContent }) => Promise<void>;
};

export function NoteEditor({ noteId, title, onTitleChange, initialContent, onSave }: NoteEditorProps) {
    const [isPending, startTransition] = useTransition();
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const saveTimerRef = useRef<number | null>(null);
    const lastSavedTitleRef = useRef<string>("");
    const lastSavedContentRef = useRef<string>("");
    const initializedRef = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Placeholder.configure({ placeholder: "Press / for commands…" }),
        ],
        content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
        editorProps: {
            attributes: {
                class:
                    "prose prose-neutral dark:prose-invert max-w-none focus:outline-none text-base leading-relaxed",
            },
        },
        immediatelyRender: false,
    });

    // Initialize "last saved" baseline so we don't save immediately on mount/navigation.
    useEffect(() => {
        if (!editor || initializedRef.current) return;
        const baseTitle = title.trim() || "Untitled";
        const baseContent = JSON.stringify(editor.getJSON());
        lastSavedTitleRef.current = baseTitle;
        lastSavedContentRef.current = baseContent;
        initializedRef.current = true;
    }, [editor, title]);

    const scheduleSave = useCallback(() => {
        if (!editor) return;

        const nextTitle = title.trim() || "Untitled";
        const nextContent = JSON.stringify(editor.getJSON());

        // Don't save if nothing changed.
        if (
            initializedRef.current &&
            nextTitle === lastSavedTitleRef.current &&
            nextContent === lastSavedContentRef.current
        ) {
            return;
        }

        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

        saveTimerRef.current = window.setTimeout(() => {
            startTransition(async () => {
                try {
                    setSaveError(null);
                    await onSave({
                        id: noteId,
                        title: nextTitle,
                        content: JSON.parse(nextContent) as JSONContent,
                    });
                    lastSavedTitleRef.current = nextTitle;
                    lastSavedContentRef.current = nextContent;
                    setLastSaved(new Date());
                } catch (e) {
                    console.error(e);
                    setSaveError("Couldn’t save");
                }
            });
        }, 1000);
    }, [editor, noteId, onSave, title]);

    useEffect(() => {
        if (!editor) return;

        const handler = () => scheduleSave();
        editor.on("update", handler);

        return () => {
            editor.off("update", handler);
            if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
        };
    }, [editor, scheduleSave]);

    useEffect(() => {
        if (!editor) return;
        if (!editor.isDestroyed) scheduleSave();
    }, [title, editor, scheduleSave]);

    const statusLabel = saveError ?? (isPending ? "Saving…" : lastSaved ? "Edited just now" : "Saved");

    return (
        <div className="flex h-full flex-col">
            {/* Main editor area */}
            <main className="flex-1 overflow-y-auto px-10 pb-24 pt-12">
                <div className="mx-auto w-full max-w-3xl">
                    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{statusLabel}</span>
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="Heading"
                        className={cn(
                            "border-none px-0 text-3xl font-serif font-semibold tracking-tight bg-transparent",
                            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none",
                            "shadow-none rounded-none",
                            "placeholder:italic placeholder:text-muted-foreground/60"
                        )}
                    />

                    <Separator className="my-4 opacity-0" />

                    <div className={cn("min-h-[60vh] rounded-lg px-0 py-1", "focus-within:bg-background")}>
                        {editor && <EditorContent editor={editor} />}
                    </div>

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
