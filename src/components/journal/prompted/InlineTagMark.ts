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
