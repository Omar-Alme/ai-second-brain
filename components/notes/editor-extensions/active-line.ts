import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

/**
 * Adds `is-active` class to the nearest block around the cursor.
 * Uses ProseMirror decorations (robust; no DOM querying).
 */
export const ActiveLine = Extension.create({
  name: "activeLine",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("active-line"),
        props: {
          decorations(state) {
            const { selection, doc } = state;
            const $from = selection?.$from;
            if (!$from) return null;

            // Find nearest block node (paragraph, heading, listItem, etc.)
            let depth = $from.depth;
            while (depth > 0 && !$from.node(depth).isBlock) depth--;

            const node = $from.node(depth);
            if (!node?.isBlock) return null;

            const from = $from.start(depth);
            const to = from + node.nodeSize;

            return DecorationSet.create(doc, [
              Decoration.node(from, to, { class: "is-active" }),
            ]);
          },
        },
      }),
    ];
  },
});
