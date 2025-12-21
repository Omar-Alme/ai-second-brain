import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

/**
 * Ensures the document always ends with an empty paragraph.
 * This guarantees a "next available line" to land on.
 */
export const TrailingParagraph = Extension.create({
  name: "trailingParagraph",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("trailing-paragraph"),
        appendTransaction: (_transactions, _oldState, newState) => {
          const doc = newState.doc;
          const last = doc.lastChild;

          const needsTrailing =
            !last ||
            last.type.name !== "paragraph" ||
            last.content.size > 0;

          if (!needsTrailing) return null;

          const tr = newState.tr;
          const endPos = doc.content.size;
          tr.insert(endPos, newState.schema.nodes.paragraph.create());
          return tr;
        },
      }),
    ];
  },
});
