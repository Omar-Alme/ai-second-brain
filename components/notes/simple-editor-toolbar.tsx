"use client";

import { useMemo, useState } from "react";
import { Editor } from "@tiptap/core";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Table2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ToolbarProps = {
  editor: Editor;
};

function normalizeUrl(input: string) {
  const url = input.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  // allow mailto:, tel:
  if (/^(mailto:|tel:)/i.test(url)) return url;
  return `https://${url}`;
}

export function SimpleEditorToolbar({ editor }: ToolbarProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageValue, setImageValue] = useState("");

  const canLink = useMemo(() => {
    // If selection is inside codeBlock we typically disable link
    return !editor.isActive("codeBlock");
  }, [editor]);

  const setLinkFromSelection = () => {
    const current = editor.getAttributes("link")?.href ?? "";
    setLinkValue(current);
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

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setLinkOpen(false);
  };

  const applyImage = () => {
    const src = normalizeUrl(imageValue);
    if (!src) return;
    editor.chain().focus().setImage({ src }).run();
    setImageValue("");
    setImageOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-background p-2">
      {/* Text formatting */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
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
        disabled={!editor.can().chain().focus().toggleItalic().run()}
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
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={cn(editor.isActive("underline") && "bg-accent")}
        aria-label="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
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
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={cn(editor.isActive("code") && "bg-accent")}
        aria-label="Inline code"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(
              (editor.isActive("heading", { level: 1 }) ||
                editor.isActive("heading", { level: 2 }) ||
                editor.isActive("heading", { level: 3 })) &&
                "bg-accent",
            )}
            aria-label="Heading"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="mr-2 h-4 w-4" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="mr-2 h-4 w-4" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="mr-2 h-4 w-4" />
            Heading 3
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => editor.chain().focus().setParagraph().run()}>
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Lists */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(editor.isActive("bulletList") && "bg-accent")}
        aria-label="Bullet list"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(editor.isActive("orderedList") && "bg-accent")}
        aria-label="Ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Block elements */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(editor.isActive("blockquote") && "bg-accent")}
        aria-label="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cn(editor.isActive("codeBlock") && "bg-accent")}
        aria-label="Code block"
      >
        <Code2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={cn(editor.isActive({ textAlign: "left" }) && "bg-accent")}
        aria-label="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={cn(editor.isActive({ textAlign: "center" }) && "bg-accent")}
        aria-label="Align center"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={cn(editor.isActive({ textAlign: "right" }) && "bg-accent")}
        aria-label="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={cn(editor.isActive({ textAlign: "justify" }) && "bg-accent")}
        aria-label="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Link popover */}
      <Popover open={linkOpen} onOpenChange={(open) => {
        if (open) setLinkFromSelection();
        setLinkOpen(open);
      }}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={!canLink}
            className={cn(editor.isActive("link") && "bg-accent")}
            aria-label="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-3">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">
              {editor.isActive("link") ? "Edit link" : "Add link"}
            </div>

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

              {editor.isActive("link") && (
                <Button type="button" size="sm" variant="destructive" onClick={removeLink}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image popover */}
      <Popover open={imageOpen} onOpenChange={setImageOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Image">
            <ImageIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-3">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Insert image</div>
            <Input
              value={imageValue}
              onChange={(e) => setImageValue(e.target.value)}
              placeholder="Image URL"
              onKeyDown={(e) => {
                if (e.key === "Enter") applyImage();
                if (e.key === "Escape") setImageOpen(false);
              }}
            />
            <Button type="button" size="sm" onClick={applyImage}>
              Insert
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Table */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(editor.isActive("table") && "bg-accent")}
            aria-label="Table"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onSelect={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <Table2 className="mr-2 h-4 w-4" />
            Insert table
          </DropdownMenuItem>

          {editor.isActive("table") && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnBefore().run()}>
                Add column before
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => editor.chain().focus().addColumnAfter().run()}>
                Add column after
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => editor.chain().focus().deleteColumn().run()}>
                Delete column
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => editor.chain().focus().addRowBefore().run()}>
                Add row before
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => editor.chain().focus().addRowAfter().run()}>
                Add row after
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => editor.chain().focus().deleteRow().run()}>
                Delete row
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => editor.chain().focus().deleteTable().run()}
              >
                Delete table
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* History */}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
