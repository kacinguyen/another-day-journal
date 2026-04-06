import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { InlineTagMark, type TagCategory } from "./InlineTagMark";
import TagCategoryPicker from "./TagCategoryPicker";
import type { InlineTag } from "./usePromptedEntry";

interface TaggableEditorProps {
  content: string;
  onContentChange: (text: string) => void;
  onTagsChange: (tags: InlineTag[]) => void;
  onFocusChange?: (focused: boolean) => void;
}

/** Extract all inline tags from the TipTap document JSON. */
function extractTags(json: Record<string, unknown>): InlineTag[] {
  const tags: InlineTag[] = [];
  let offset = 0;

  function walk(node: Record<string, unknown>) {
    if (node.type === "text") {
      const text = node.text as string;
      const marks = (node.marks as Array<{ type: string; attrs?: { category: string; displayName?: string } }>) || [];
      const tagMark = marks.find((m) => m.type === "inlineTag");
      if (tagMark) {
        tags.push({
          text,
          displayName: tagMark.attrs?.displayName || undefined,
          category: tagMark.attrs?.category as TagCategory,
          startOffset: offset,
          endOffset: offset + text.length,
        });
      }
      offset += text.length;
    }
    if (node.type === "paragraph" && offset > 0) {
      offset += 1; // newline between paragraphs
    }
    const content = node.content as Array<Record<string, unknown>> | undefined;
    if (content) {
      content.forEach(walk);
    }
  }

  const docContent = json.content as Array<Record<string, unknown>> | undefined;
  if (docContent) {
    docContent.forEach(walk);
  }
  return tags;
}

const TaggableEditor: React.FC<TaggableEditorProps> = ({
  content,
  onContentChange,
  onTagsChange,
  onFocusChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | null>(null);
  const [hasSelection, setHasSelection] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        listItem: false,
        bulletList: false,
        orderedList: false,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind today?",
      }),
      InlineTagMark,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[200px] focus:outline-none px-1 py-2",
      },
    },
    onUpdate: ({ editor }) => {
      onContentChange(editor.getText());
      const json = editor.getJSON();
      onTagsChange(extractTags(json as Record<string, unknown>));
    },
    onFocus: () => onFocusChange?.(true),
    onBlur: () => onFocusChange?.(false),
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        // Text is selected — position the picker
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0 && containerRef.current) {
          const range = domSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          setPickerPos({
            top: rect.bottom - containerRect.top + 8,
            left: rect.left - containerRect.left + rect.width / 2,
          });
          setHasSelection(true);
        }
      } else {
        setHasSelection(false);
      }
    },
  });

  // Hide picker when clicking outside or selection clears
  useEffect(() => {
    if (!hasSelection) {
      const timer = setTimeout(() => setPickerPos(null), 150);
      return () => clearTimeout(timer);
    }
  }, [hasSelection]);

  // Sync external content changes (e.g., dig deeper insertions)
  useEffect(() => {
    if (editor && content && !editor.isFocused && editor.getText() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const getSelectedText = useCallback(() => {
    if (!editor) return "";
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to);
  }, [editor]);

  const handleTagSelect = useCallback(
    (category: TagCategory, displayName?: string) => {
      if (!editor) return;
      editor.chain().focus().setMark("inlineTag", { category, displayName: displayName || null }).run();
      setHasSelection(false);
      setPickerPos(null);
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div ref={containerRef} className="relative">
      <EditorContent editor={editor} />
      {pickerPos && hasSelection && (
        <div
          className="absolute z-50"
          style={{
            top: pickerPos.top,
            left: pickerPos.left,
            transform: "translateX(-50%)",
          }}
        >
          <TagCategoryPicker onSelect={handleTagSelect} selectedText={getSelectedText()} />
        </div>
      )}
    </div>
  );
};

export default TaggableEditor;
