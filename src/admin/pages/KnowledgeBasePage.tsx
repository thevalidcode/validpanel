import { useMemo, useState } from "react";
import { BookOpenText, Plus, Search, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/DeleteDialog";
import NotFound from "@/components/NotFound";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { KnowledgeBaseArticle, KnowledgeBaseStatus } from "@/types";
import {
  useCreateKnowledgeBaseAdmin,
  useDeleteKnowledgeBaseAdmin,
  useGetKnowledgeBaseAdmin,
  useUpdateKnowledgeBaseAdmin,
  type KnowledgeBasePayload,
} from "@/hooks/use-knowledge-base";
import EditKnowledgeBaseDialog from "../components/knowledge-base/EditKnowledgeBaseDialog";
import KnowledgeBaseDesktopView from "../components/knowledge-base/KnowledgeBaseDesktopView";
import KnowledgeBaseMobileView from "../components/knowledge-base/KnowledgeBaseMobileView";

function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | KnowledgeBaseStatus>(
    "ALL",
  );

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    article?: KnowledgeBaseArticle;
  }>({
    open: false,
    mode: "create",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    article?: KnowledgeBaseArticle;
  }>({ open: false });

  const { data, isLoading } = useGetKnowledgeBaseAdmin({
    page: 1,
    limit: 100,
    search: searchTerm || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const createMutation = useCreateKnowledgeBaseAdmin();
  const updateMutation = useUpdateKnowledgeBaseAdmin();
  const deleteMutation = useDeleteKnowledgeBaseAdmin();

  const articles = data?.knowledgeBase || [];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      if (statusFilter !== "ALL" && article.status !== statusFilter)
        return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        article.title.toLowerCase().includes(term) ||
        article.slug.toLowerCase().includes(term) ||
        (article.category || "").toLowerCase().includes(term)
      );
    });
  }, [articles, searchTerm, statusFilter]);

  const statusOptions: Option<string>[] = [
    { label: "All Status", value: "ALL" },
    { label: "Draft", value: "DRAFT" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  const handleCreate = () => {
    setDialogState({ open: true, mode: "create" });
  };

  const handleEdit = (article: KnowledgeBaseArticle) => {
    setDialogState({ open: true, mode: "edit", article });
  };

  const handleDelete = (article: KnowledgeBaseArticle) => {
    setDeleteDialog({ open: true, article });
  };

  const handleSubmit = async (payload: KnowledgeBasePayload) => {
    if (dialogState.mode === "create") {
      await createMutation.mutateAsync(payload);
      setDialogState({ open: false, mode: "create" });
      return;
    }

    if (!dialogState.article) return;

    await updateMutation.mutateAsync({ uid: dialogState.article.uid, payload });
    setDialogState({ open: false, mode: "create" });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.article) return;
    await deleteMutation.mutateAsync(deleteDialog.article.uid);
    setDeleteDialog({ open: false });
  };

  return (
    <Layout
      title="Knowledge Base"
      description="Create and manage help articles for users across the platform."
    >
      <div className="py-5 px-6 w-full">
        <div className="flex w-full flex-col xl:flex-row xl:items-center gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="border border-gray-200 outline-0 w-full rounded-[4px] pr-3 pl-12 py-2 focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          <div className="w-full xl:w-56">
            <CustomSelect
              options={statusOptions}
              value={statusOptions.find(
                (option) => option.value === statusFilter,
              )}
              onChange={(selected) =>
                setStatusFilter(
                  (selected as Option<"ALL" | KnowledgeBaseStatus>).value,
                )
              }
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="text-white flex gap-2 border bg-primary items-center w-fit hover:bg-primary/90 px-4 py-2 rounded-[4px] transition-all font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="mt-5">
            <NotFound
              title="No knowledge base articles found"
              description="Create your first article to help users learn the platform quickly."
              icon={
                <BookOpenText className="w-10 h-10 mx-auto text-gray-400" />
              }
            />
          </div>
        ) : (
          <div className="mt-5">
            <div className="hidden lg:block">
              <KnowledgeBaseDesktopView
                articles={filteredArticles}
                handleAction={(uid, action) => {
                  const article = articles.find((item) => item.uid === uid);
                  if (!article) return;
                  if (action === "Edit") handleEdit(article);
                  if (action === "Delete") handleDelete(article);
                }}
              />
            </div>

            <div className="lg:hidden">
              <KnowledgeBaseMobileView
                articles={filteredArticles}
                handleAction={(uid, action) => {
                  const article = articles.find((item) => item.uid === uid);
                  if (!article) return;
                  if (action === "Edit") handleEdit(article);
                  if (action === "Delete") handleDelete(article);
                }}
              />
            </div>
          </div>
        )}

        <EditKnowledgeBaseDialog
          open={dialogState.open}
          mode={dialogState.mode}
          initialValues={dialogState.article}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => setDialogState({ open: false, mode: "create" })}
          onSubmit={handleSubmit}
        />

        <DeleteDialog
          open={deleteDialog.open}
          title="Delete Knowledge Base Article"
          description={`Are you sure you want to delete "${deleteDialog.article?.title}"? This action cannot be undone.`}
          icon={<Trash2 className="w-6 h-6" />}
          confirmLabel="Delete Article"
          isLoading={deleteMutation.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ open: false })}
        />
      </div>
    </Layout>
  );
}

export default KnowledgeBasePage;
