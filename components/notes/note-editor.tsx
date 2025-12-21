"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Gapcursor from "@tiptap/extension-gapcursor";
import Dropcursor from "@tiptap/extension-dropcursor";
import type { JSONContent } from "@tiptap/core";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

import { SimpleEditorToolbar } from "./simple-editor-toolbar";
import { BubbleMenu } from "./bubble-menu";
import { ActiveLine } from "./editor-extensions/active-line";
import { TrailingParagraph } from "./editor-extensions/trailing-paragraph";

type NoteEditorProps = {
  noteId: string;
  title: string;
  onTitleChange: (nextTitle: string) => void;
  initialContent: JSONContent | null;
  onSave: (input: { id: string; title: string; content: JSONContent }) => Promise<void>;
};

function safeStringifyJSON(content: JSONContent) {
  return JSON.stringify(content);
}

export function NoteEditor({
  noteId,
  title,
  onTitleChange,
  initialContent,
  onSave,
}: NoteEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveTimerRef = useRef<number | null>(null);
  const initializedRef = useRef(false);
  const didAutoFocusRef = useRef(false);

  const lastSavedTitleRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>("");

  const content = useMemo<JSONContent>(() => {
    return initialContent ?? { type: "doc", content: [{ type: "paragraph" }] };
  }, [initialContent]);

  const editor = useEditor({
    extensions: [
      ActiveLine,
      TrailingParagraph, // ✅ ensures there's always an empty paragraph at the end
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing…",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 hover:no-underline",
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-border my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: { class: "border border-border" },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-muted font-semibold text-left p-2 border border-border",
        },
      }),
      TableCell.configure({
        HTMLAttributes: { class: "border border-border p-2" },
      }),
      Color,
      TextStyle,
      Gapcursor,
      Dropcursor.configure({
        color: "hsl(var(--primary))",
        width: 2,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-neutral dark:prose-invert max-w-none",
          "focus:outline-none text-base leading-relaxed",
          "min-h-[500px] px-4 py-8",
        ),
        autocapitalize: "sentences",
        autocomplete: "off",
        autocorrect: "on",
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
  });

  // Baseline (avoid saving immediately on mount)
  useEffect(() => {
    if (!editor || initializedRef.current) return;

    const baseTitle = title.trim() || "Untitled";
    const baseContent = safeStringifyJSON(editor.getJSON());

    lastSavedTitleRef.current = baseTitle;
    lastSavedContentRef.current = baseContent;
    initializedRef.current = true;
  }, [editor, title]);

  // Auto-focus to end ON FIRST focus only (so you land on "next available line")
  useEffect(() => {
    if (!editor) return;

    const handleFocus = () => {
      if (didAutoFocusRef.current) return;
      didAutoFocusRef.current = true;

      // move caret to end (which is the trailing empty paragraph)
      editor
        .chain()
        .focus()
        .setTextSelection(editor.state.doc.content.size)
        .run();
    };

    editor.on("focus", handleFocus);
    return () => {
      editor.off("focus", handleFocus);
    };
  }, [editor]);

  const clearSaveTimer = useCallback(() => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  const doSaveNow = useCallback(async () => {
    if (!editor) return;

    const nextTitle = title.trim() || "Untitled";
    const nextContent = safeStringifyJSON(editor.getJSON());

    if (
      initializedRef.current &&
      nextTitle === lastSavedTitleRef.current &&
      nextContent === lastSavedContentRef.current
    ) {
      return;
    }

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
  }, [editor, noteId, onSave, startTransition, title]);

  const scheduleSave = useCallback(() => {
    if (!editor) return;

    clearSaveTimer();

    saveTimerRef.current = window.setTimeout(() => {
      void doSaveNow();
    }, 1500);
  }, [clearSaveTimer, doSaveNow, editor]);

  // Editor updates -> debounce save + blur flush
  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => scheduleSave();
    const onBlur = () => {
      clearSaveTimer();
      void doSaveNow();
    };

    editor.on("update", onUpdate);
    editor.on("blur", onBlur);

    return () => {
      editor.off("update", onUpdate);
      editor.off("blur", onBlur);
      clearSaveTimer();
    };
  }, [editor, scheduleSave, doSaveNow, clearSaveTimer]);

  // Title changes -> debounce save
  useEffect(() => {
    if (!editor) return;
    scheduleSave();
  }, [title, editor, scheduleSave]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      clearSaveTimer();
      void doSaveNow();
    };
  }, [clearSaveTimer, doSaveNow]);

  const statusLabel = saveError ?? (isPending ? "Saving…" : lastSaved ? "Edited just now" : "Saved");

  return (
    <div className="flex h-full flex-col">
      {editor && (
        <>
          <SimpleEditorToolbar editor={editor} />
          <BubbleMenu editor={editor} />
        </>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-10 pb-24 pt-12">
          <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{statusLabel}</span>
          </div>

          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Untitled"
            className={cn(
              "border-none px-0 text-3xl font-serif font-semibold tracking-tight bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none",
              "shadow-none rounded-none",
              "placeholder:italic placeholder:text-muted-foreground/60",
            )}
          />

          <Separator className="my-4 opacity-0" />

          <div className={cn("rounded-lg relative", "focus-within:bg-background")}>
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>
      </main>
    </div>
  );
}
