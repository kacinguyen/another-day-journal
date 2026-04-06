import { Mark, mergeAttributes } from "@tiptap/react";

export type TagCategory = "person" | "place" | "event" | "activity";

export const InlineTagMark = Mark.create({
  name: "inlineTag",

  addAttributes() {
    return {
      category: {
        default: "person",
        parseHTML: (element) => element.getAttribute("data-category"),
        renderHTML: (attributes) => ({
          "data-category": attributes.category,
        }),
      },
      displayName: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-display-name"),
        renderHTML: (attributes) => {
          if (!attributes.displayName) return {};
          return { "data-display-name": attributes.displayName };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-category]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: `inline-tag inline-tag-${HTMLAttributes["data-category"]}`,
      }),
      0,
    ];
  },

  // Don't extend the mark when typing after it
  inclusive: false,
});
