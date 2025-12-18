"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Tldraw, getSnapshot, loadSnapshot } from "tldraw";
import type { TLEditorSnapshot, Editor } from "tldraw";

import { Clock } from "lucide-react";

type CanvasEditorProps = {
    canvasId: string;
    title: string;
    initialSnapshot: TLEditorSnapshot | null;
    onSave: (input: {
        id: string;
        title: string;
        document: TLEditorSnapshot;
    }) => Promise<void>;
};

export function CanvasEditor({
    canvasId,
    title,
    initialSnapshot,
    onSave,
}: CanvasEditorProps) {
    const [editor, setEditor] = useState<Editor | null>(null);
    const [isPending, startTransition] = useTransition();
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);

    const saveTimerRef = useRef<number | null>(null);
    const hydratedRef = useRef(false);
    const initializedRef = useRef(false);
    const lastSavedTitleRef = useRef<string>("");
    const lastSavedSnapshotRef = useRef<string>("");

    useEffect(() => {
        hydratedRef.current = false;
    }, [canvasId]);

    useEffect(() => {
        if (!editor || hydratedRef.current) return;

        if (initialSnapshot) {
            loadSnapshot(editor.store, initialSnapshot);
        }

        hydratedRef.current = true;
        // Initialize baseline after hydration so we don't save immediately.
        const baseTitle = title.trim() || "Untitled";
        lastSavedTitleRef.current = baseTitle;
        lastSavedSnapshotRef.current = JSON.stringify(getSnapshot(editor.store));
        initializedRef.current = true;
    }, [editor, initialSnapshot, title]);

    const scheduleSave = useCallback(() => {
        if (!editor) return;
        if (!hydratedRef.current) return;

        const nextTitle = title.trim() || "Untitled";
        const nextSnapshot = JSON.stringify(getSnapshot(editor.store));

        if (
            initializedRef.current &&
            nextTitle === lastSavedTitleRef.current &&
            nextSnapshot === lastSavedSnapshotRef.current
        ) {
            return;
        }

        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

        saveTimerRef.current = window.setTimeout(() => {
            startTransition(async () => {
                try {
                    setSaveError(null);
                    await onSave({
                        id: canvasId,
                        title: nextTitle,
                        document: JSON.parse(nextSnapshot) as TLEditorSnapshot,
                    });
                    lastSavedTitleRef.current = nextTitle;
                    lastSavedSnapshotRef.current = nextSnapshot;
                    setLastSaved(new Date());
                } catch (e) {
                    console.error(e);
                    setSaveError("Couldn’t save");
                }
            });
        }, 900);
    }, [editor, canvasId, onSave, title]);

    useEffect(() => {
        if (!editor) return;
        const unsub = editor.store.listen(() => {
            if (!hydratedRef.current) return;
            scheduleSave();
        });
        return () => unsub();
    }, [editor, scheduleSave]);

    useEffect(() => {
        if (!editor || !hydratedRef.current) return;
        scheduleSave();
    }, [title, editor, scheduleSave]);

    const statusLabel = saveError ?? (isPending ? "Saving…" : lastSaved ? "Edited just now" : "Saved");
    const licenseKey = process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY;

    return (
        <div className="flex h-full flex-col">
            {/* CANVAS */}
            <div className="relative flex-1 min-h-0">
                <div className="absolute right-3 top-3 z-10 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
                    <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {statusLabel}
                    </span>
                </div>
                <Tldraw
                    key={canvasId}
                    onMount={(ed) => setEditor(ed)}
                    {...(licenseKey ? { licenseKey } : {})}
                />
            </div>
        </div>
    );
}
