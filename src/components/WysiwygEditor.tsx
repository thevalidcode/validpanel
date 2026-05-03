import { useCallback, useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import { Extension, type Editor, Node, mergeAttributes } from "@tiptap/core";
import { motion } from "framer-motion";
import { ImageIcon, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useUploadImage } from "@/hooks/use-file";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { CollectionName } from "@/types";

const defaultEnable = {
  bold: true,
  italic: true,
  underline: true,
  headings: true,
  lists: true,
  align: true,
  image: true,
  link: true,
  highlight: true,
  color: true,
  fontFamily: true,
  code: true,
  video: true,
};

const headingOptions: Option<string>[] = [
  { label: "Normal", value: "" },
  { label: "Heading 1", value: "1" },
  { label: "Heading 2", value: "2" },
  { label: "Heading 3", value: "3" },
  { label: "Heading 4", value: "4" },
];

const colorOptions: Option<string>[] = [
  { label: "Color", value: "" },
  { label: "Dark", value: "#111827" },
  { label: "Red", value: "#ef4444" },
  { label: "Green", value: "#10b981" },
  { label: "Blue", value: "#2563eb" },
  { label: "Primary", value: "#7c3aed" },
];

export interface WysiwygEditorProps {
  collection?: CollectionName;
  initialContent?: string;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  enable?: Partial<typeof defaultEnable>;
  onChange?: (html: string, editor: Editor) => void;
  onSave?: (html: string) => Promise<void> | void;
  autoFocus?: boolean;
  editorRef?: (editor: Editor | null) => void;
}

function useBuiltExtensions(
  enable: Required<NonNullable<WysiwygEditorProps["enable"]>>,
) {
  return useMemo(() => {
    const exts: Extension[] = [
      StarterKit,
      TextStyle as unknown as Extension,
      FontFamily.configure({ types: ["textStyle"] }) as unknown as Extension,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }) as unknown as Extension,
      // simple iframe node for embeds (YouTube)
      Node.create({
        name: "iframe",
        group: "block",
        atom: true,
        selectable: true,
        addAttributes() {
          return {
            src: { default: null },
          };
        },
        parseHTML() {
          return [{ tag: "iframe" }];
        },
        renderHTML({ HTMLAttributes }) {
          return [
            "div",
            { class: "video-embed" },
            [
              "iframe",
              mergeAttributes(
                {
                  frameborder: "0",
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowfullscreen: "true",
                },
                HTMLAttributes
              ),
            ],
          ];
        },
      }) as unknown as Extension,
    ];

    if (enable.align) {
      exts.push(
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }) as unknown as Extension,
      );
    }

    if (enable.highlight) {
      exts.push(
        Highlight.configure({ multicolor: true }) as unknown as Extension,
      );
    }

    if (enable.color) {
      exts.push(
        Color.configure({ types: ["textStyle"] }) as unknown as Extension,
      );
    }

    if (enable.image) {
      exts.push(
        ImageExt.configure({
          inline: true,
          allowBase64: true,
        }) as unknown as Extension,
      );
    }

    return exts;
  }, [enable]);
}

export default function WysiwygEditor({
  collection = "default",
  initialContent = "",
  placeholder = "Write your knowledge base article...",
  className = "",
  showToolbar = true,
  enable = defaultEnable,
  onChange,
  onSave,
  autoFocus = false,
  editorRef,
}: WysiwygEditorProps) {
  const built = useBuiltExtensions({ ...defaultEnable, ...enable } as Required<
    NonNullable<WysiwygEditorProps["enable"]>
  >);
  const { mutateAsync: uploadImage } = useUploadImage();

  const editor = useEditor({
    extensions: built,
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "richtext-content richtext-editor prose prose-sm max-w-none focus:outline-none min-h-[280px] p-4 text-gray-800",
        "aria-label": `${collection} editor`,
        placeholder,
      },
    },
    autofocus: autoFocus,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML(), editor);
    },
  });

  useEffect(() => {
    editorRef?.(editor ?? null);
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || "");
    }
  }, [initialContent, editor]);

  const execInsertImage = useCallback(
    (url: string) => {
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image added");
      }
    },
    [editor],
  );

  const handlePickImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const response = await uploadImage({ file, collection });
        execInsertImage(response.url);
      } catch {
        toast.error("Failed to upload image");
      }
    };

    input.click();
  }, [uploadImage, collection, execInsertImage]);

  const handleToggleMark = useCallback(
    (mark: "bold" | "italic" | "strike" | "code") => {
      if (!editor) return;
      switch (mark) {
        case "bold":
          editor.chain().focus().toggleBold().run();
          break;
        case "italic":
          editor.chain().focus().toggleItalic().run();
          break;
        case "strike":
          editor.chain().focus().toggleStrike().run();
          break;
        case "code":
          editor.chain().focus().toggleCode().run();
          break;
      }
    },
    [editor],
  );

  const headSelect = useCallback(
    (level: 1 | 2 | 3 | 4) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor],
  );

  const setTextAlign = useCallback(
    (align: "left" | "center" | "right" | "justify") => {
      editor?.chain().focus().setTextAlign(align).run();
    },
    [editor],
  );

  const insertLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertVideo = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("iframe").src || "";
    const url = window.prompt("YouTube URL or embed URL", previous);
    if (url === null) return;
    if (url === "") return;

    // extract YouTube ID and convert to embed
    const ytMatch = url.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
    );
    const id = ytMatch ? ytMatch[1] : null;
    const embed = id ? `https://www.youtube.com/embed/${id}` : url;

    editor.chain().focus().setNode("iframe", { src: embed }).run();
  }, [editor]);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const html = editor.getHTML();
    try {
      await onSave?.(html);
      toast.success("Content saved");
    } catch {
      toast.error("Save failed");
    }
  }, [editor, onSave]);

  if (!editor) {
    return (
      <div
        className={`w-full rounded-[4px] border border-gray-200 bg-white p-4 ${className}`}
      >
        <p className="text-sm text-gray-500">Loading editor...</p>
      </div>
    );
  }

  const activeHeading =
    headingOptions.find((option) => {
      if (!option.value) return !editor.isActive("heading");
      return editor.isActive("heading", { level: Number(option.value) });
    }) ?? headingOptions[0];

  const activeColor =
    colorOptions.find(
      (option) =>
        option.value && editor.isActive("textStyle", { color: option.value }),
    ) ?? colorOptions[0];

  return (
    <div className={`w-full ${className}`}>
      {showToolbar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="flex flex-wrap gap-2 items-center bg-white p-2.5 rounded-[4px] border border-gray-200"
        >
          {enable.bold && (
            <button
              type="button"
              className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                editor.isActive("bold")
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => handleToggleMark("bold")}
            >
              <strong>B</strong>
            </button>
          )}

          {enable.italic && (
            <button
              type="button"
              className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                editor.isActive("italic")
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => handleToggleMark("italic")}
            >
              <em>I</em>
            </button>
          )}

          {enable.code && (
            <button
              type="button"
              className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                editor.isActive("code")
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => handleToggleMark("code")}
            >
              {"</>"}
            </button>
          )}

          {enable.headings && (
            <div className="w-[150px]">
              <CustomSelect
                variant="default"
                options={headingOptions}
                value={activeHeading}
                onChange={(selected) => {
                  if (Array.isArray(selected)) return;
                  const level = Number(selected.value) as 1 | 2 | 3 | 4;
                  if (!level) {
                    editor.chain().focus().setParagraph().run();
                    return;
                  }
                  headSelect(level);
                }}
                placeholder="Normal"
                className="text-xs"
              />
            </div>
          )}

          {enable.lists && (
            <>
              <button
                type="button"
                className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                  editor.isActive("bulletList")
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                List
              </button>
              <button
                type="button"
                className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                  editor.isActive("orderedList")
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                1. List
              </button>
            </>
          )}

          {enable.align && (
            <>
              <button
                type="button"
                className="px-2 py-1.5 text-xs rounded-[4px] border border-gray-200"
                onClick={() => setTextAlign("left")}
              >
                L
              </button>
              <button
                type="button"
                className="px-2 py-1.5 text-xs rounded-[4px] border border-gray-200"
                onClick={() => setTextAlign("center")}
              >
                C
              </button>
              <button
                type="button"
                className="px-2 py-1.5 text-xs rounded-[4px] border border-gray-200"
                onClick={() => setTextAlign("right")}
              >
                R
              </button>
              <button
                type="button"
                className="px-2 py-1.5 text-xs rounded-[4px] border border-gray-200"
                onClick={() => setTextAlign("justify")}
              >
                J
              </button>
            </>
          )}

          {enable.image && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-[4px] border border-gray-200 text-gray-700"
              onClick={handlePickImage}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Image
            </button>
          )}

          {enable.link && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-[4px] border border-gray-200 text-gray-700"
              onClick={insertLink}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Link
            </button>
          )}

          {enable.video && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-[4px] border border-gray-200 text-gray-700"
              onClick={insertVideo}
            >
              YouTube
            </button>
          )}

          {enable.highlight && (
            <button
              type="button"
              className={`px-2.5 py-1.5 text-xs rounded-[4px] border ${
                editor.isActive("highlight")
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              Highlight
            </button>
          )}

          {enable.color && (
            <div className="w-[120px]">
              <CustomSelect
                variant="default"
                options={colorOptions}
                value={activeColor}
                onChange={(selected) => {
                  if (Array.isArray(selected) || !selected.value) {
                    editor.chain().focus().unsetColor().run();
                    return;
                  }
                  editor.chain().focus().setColor(selected.value).run();
                }}
                placeholder="Color"
                className="text-xs"
              />
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="px-2.5 py-1.5 text-xs rounded-[4px] border border-gray-200 text-gray-700"
              onClick={() => editor.chain().focus().undo().run()}
            >
              Undo
            </button>
            <button
              type="button"
              className="px-2.5 py-1.5 text-xs rounded-[4px] border border-gray-200 text-gray-700"
              onClick={() => editor.chain().focus().redo().run()}
            >
              Redo
            </button>
            {onSave && (
              <button
                type="button"
                className="px-3 py-1.5 text-xs rounded-[4px] bg-primary text-white"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div className="mt-3 border border-gray-200 rounded-[4px] overflow-hidden bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
