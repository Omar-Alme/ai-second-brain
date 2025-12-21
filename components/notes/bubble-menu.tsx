"use client";

import { useState } from "react";
import { Editor } from "@tiptap/core";
import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react/menus";
import { Bold, Italic, Underline, Strikethrough, Code, Link as LinkIcon, Unlink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BubbleMenuProps = {
  editor: Editor;
};

function normalizeUrl(input: string) {
  const url = input.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^(mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
}

export function BubbleMenu({ editor }: BubbleMenuProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const handleLinkOpenChange = (open: boolean) => {
    setLinkOpen(open);
    if (open) {
      const current = editor.getAttributes("link")?.href ?? "";
      setLinkValue(current);
    }
  };

  const applyLink = () => {
    const href = normalizeUrl(linkValue);
    if (!href) {
      editor.chain().focus().unsetLink().run();
      setLinkOpen(false);
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
  };

  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      options={{ placement: "top", offset: { mainAxis: 8 } }}
      shouldShow={({ editor, state }) => {
        const { selection } = state;
        if (selection.empty) return false;
        if (editor.isActive("codeBlock")) return false;
        return true;
      }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-lg">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive("bold") && "bg-accent")}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive("italic") && "bg-accent")}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(editor.isActive("underline") && "bg-accent")}
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(editor.isActive("strike") && "bg-accent")}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(editor.isActive("code") && "bg-accent")}
          aria-label="Inline code"
        >
          <Code className="h-4 w-4" />
        </Button>

        {/* Link edit/remove */}
         {editor.isActive("link") ? (
           <>
             <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Edit link">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-3">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Edit link</div>
                  <Input
                    value={linkValue}
                    onChange={(e) => setLinkValue(e.target.value)}
                    placeholder="example.com or https://…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyLink();
                      if (e.key === "Escape") setLinkOpen(false);
                    }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <Button type="button" size="sm" onClick={applyLink}>
                      Apply
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setLinkOpen(false);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => editor.chain().focus().unsetLink().run()}
              aria-label="Remove link"
            >
              <Unlink className="h-4 w-4" />
            </Button>
          </>
         ) : (
           <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Add link">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Add link</div>
                <Input
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder="example.com or https://…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyLink();
                    if (e.key === "Escape") setLinkOpen(false);
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const href = normalizeUrl(linkValue);
                    if (!href) return;
                    editor.chain().focus().setLink({ href }).run();
                    setLinkOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TiptapBubbleMenu>
  );
}
