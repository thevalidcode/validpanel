import { type FC, type FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpenText, FileText, ImageIcon } from "lucide-react";
import type { KnowledgeBaseArticle, KnowledgeBaseStatus } from "@/types";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import ImageUploadBox from "@/components/ImageUploadBox";
import WysiwygEditor from "@/components/WysiwygEditor";

export type KnowledgeBaseDialogMode = "create" | "edit";

export interface KnowledgeBaseSubmitData {
  title: string;
  slug?: string;
  summary?: string | null;
  contentHtml: string;
  coverImage?: string | null;
  category?: string | null;
  tags: string[];
  status: KnowledgeBaseStatus;
  isFeatured: boolean;
  position?: number;
}

interface EditKnowledgeBaseDialogProps {
  open: boolean;
  mode: KnowledgeBaseDialogMode;
  initialValues?: KnowledgeBaseArticle;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: KnowledgeBaseSubmitData) => void;
}

const statusOptions: Option<KnowledgeBaseStatus>[] = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

const categoryOptions: Option<string>[] = [
  { label: "General", value: "General" },
  { label: "Getting Started", value: "Getting Started" },
  { label: "Billing", value: "Billing" },
  { label: "Stores", value: "Stores" },
  { label: "Subscriptions", value: "Subscriptions" },
  { label: "Integrations", value: "Integrations" },
  { label: "Troubleshooting", value: "Troubleshooting" },
];

function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const EditKnowledgeBaseDialog: FC<EditKnowledgeBaseDialogProps> = ({
  open,
  mode,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [status, setStatus] = useState<KnowledgeBaseStatus>("DRAFT");
  const [category, setCategory] = useState("General");
  const [isFeatured, setIsFeatured] = useState(false);
  const [position, setPosition] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialValues) {
      setTitle(initialValues.title || "");
      setSlug(initialValues.slug || "");
      setSummary(initialValues.summary || "");
      setCoverImage(initialValues.coverImage || "");
      setContentHtml(initialValues.contentHtml || "");
      setStatus(initialValues.status || "DRAFT");
      setCategory(initialValues.category || "General");
      setIsFeatured(initialValues.isFeatured || false);
      setPosition(
        typeof initialValues.position === "number"
          ? String(initialValues.position)
          : "",
      );
      setTags(initialValues.tags || []);
      setTagInput("");
      setSlugTouched(true);
      return;
    }

    setTitle("");
    setSlug("");
    setSummary("");
    setCoverImage("");
    setContentHtml("");
    setStatus("DRAFT");
    setCategory("General");
    setIsFeatured(false);
    setPosition("");
    setTagInput("");
    setTags([]);
    setSlugTouched(false);
  }, [open, mode, initialValues]);

  useEffect(() => {
    if (slugTouched) return;
    setSlug(toSlug(title));
  }, [title, slugTouched]);

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && contentHtml.trim().length >= 10;
  }, [title, contentHtml]);

  const addTag = () => {
    const next = tagInput.trim();
    if (!next) return;
    if (tags.includes(next)) return;
    if (tags.length >= 30) return;
    setTags((prev) => [...prev, next]);
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((tag) => tag !== value));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      slug: toSlug(slug || title),
      summary: summary.trim() || null,
      contentHtml,
      coverImage: coverImage.trim() || null,
      category: category.trim() || null,
      tags,
      status,
      isFeatured,
      position: position.trim() ? Number(position) : undefined,
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-6xl rounded-[4px] bg-white border border-gray-200 shadow-xl max-h-[92vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
              <div className="w-10 h-10 rounded-[4px] bg-primary/10 text-primary flex items-center justify-center">
                <BookOpenText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {mode === "create"
                    ? "Create Knowledge Base Article"
                    : "Edit Knowledge Base Article"}
                </h3>
                <p className="text-sm text-gray-500">
                  Publish clear, structured guidance for users across the
                  platform.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 xl:grid-cols-3 max-h-[calc(92vh-72px)] overflow-y-auto"
            >
              <div className="xl:col-span-2 p-6 space-y-4 overflow-y-auto border-r border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      placeholder="How to create your first store"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(event) => {
                        setSlugTouched(true);
                        setSlug(toSlug(event.target.value));
                      }}
                      className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      placeholder="how-to-create-your-first-store"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      value={summary}
                      onChange={(event) => setSummary(event.target.value)}
                      className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                      placeholder="Short summary shown in article cards"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Content
                    </label>
                    <span className="text-xs text-gray-500">
                      Rich text supported
                    </span>
                  </div>
                  <WysiwygEditor
                    collection="knowledge-base"
                    initialContent={contentHtml}
                    onChange={(html) => setContentHtml(html)}
                    placeholder="Write the complete guide here..."
                  />
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="rounded-[4px] border border-gray-200 p-4 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Article Meta
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Status
                      </label>
                      <CustomSelect
                        options={statusOptions}
                        value={statusOptions.find(
                          (option) => option.value === status,
                        )}
                        onChange={(selected) =>
                          setStatus(
                            (selected as Option<KnowledgeBaseStatus>).value,
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <CustomSelect
                        options={categoryOptions}
                        value={categoryOptions.find(
                          (option) => option.value === category,
                        )}
                        onChange={(selected) =>
                          setCategory((selected as Option<string>).value)
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Position (optional)
                      </label>
                      <input
                        type="number"
                        value={position}
                        onChange={(event) => setPosition(event.target.value)}
                        className="w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Sort order"
                      />
                    </div>

                    <CustomCheckbox
                      checked={isFeatured}
                      onChange={setIsFeatured}
                      label="Mark as featured"
                      required={false}
                    />
                  </div>
                </div>

                <div className="rounded-[4px] border border-gray-200 p-4">
                  <ImageUploadBox
                    collection="knowledge-base"
                    label="Cover Image"
                    labelIcon={<ImageIcon className="w-4 h-4" />}
                    onUploaded={(url) => setCoverImage(url)}
                    description="Upload article cover image"
                    required={false}
                  />

                  {coverImage && (
                    <div className="mt-3 rounded-[4px] border border-gray-200 overflow-hidden">
                      <img
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-[4px] border border-gray-200 p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Tags
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTag();
                        }
                      }}
                      className="flex-1 rounded-[4px] border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Add tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 py-2 rounded-[4px] border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Add
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="inline-flex items-center gap-1 rounded-[4px] bg-purple-50 text-purple-700 px-2 py-1 text-xs"
                        >
                          {tag}
                          <span aria-hidden>×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-[4px] border border-gray-200 p-4 bg-gray-50 text-xs text-gray-600 space-y-1">
                  <p className="inline-flex items-center gap-2 font-medium text-gray-700">
                    <FileText className="w-4 h-4" />
                    Authoring tips
                  </p>
                  <p>Use headings and bullet lists for better readability.</p>
                  <p>Add screenshots via the editor image button.</p>
                  <p>Keep summary concise for listing cards.</p>
                </div>
              </div>

              <div className="xl:col-span-3 border-t border-gray-200 px-6 py-4 flex justify-end gap-2 bg-white">
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {isLoading
                    ? "Saving..."
                    : mode === "create"
                      ? "Create Article"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditKnowledgeBaseDialog;
