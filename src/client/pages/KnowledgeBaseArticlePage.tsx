import { useMemo } from "react";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import NotFound from "@/components/NotFound";
import { useGetKnowledgeBaseArticlePublic } from "@/hooks/use-knowledge-base";

export default function KnowledgeBaseArticlePage() {
  const { slug = "" } = useParams();
  const {
    data: article,
    isLoading,
    isError,
  } = useGetKnowledgeBaseArticlePublic(slug);

  const renderedContent = useMemo(() => {
    if (!article?.contentHtml) return null;
    return parse(article.contentHtml);
  }, [article?.contentHtml]);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <section className="max-w-4xl mx-auto text-sm text-gray-500">
          Loading article...
        </section>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="bg-white min-h-screen pt-28 pb-20 px-4 sm:px-6">
        <section className="max-w-4xl mx-auto">
          <NotFound
            title="Article not found"
            description="This knowledge base article is unavailable or has been removed."
            icon={<BookOpenText className="w-10 h-10 mx-auto text-gray-400" />}
            actionLabel="Back to Knowledge Base"
            onActionClick={() => {
              window.location.href = "/knowledge-base";
            }}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <article className="max-w-4xl mx-auto">
        <Link
          to="/knowledge-base"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Base
        </Link>

        <div className="rounded-[8px] border border-gray-200 overflow-hidden bg-white shadow-sm">
          {article.coverImage && (
            <div className="h-72 sm:h-96 overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">
                {article.category || "General"}
              </span>
              {article.isFeatured && (
                <span className="rounded-[4px] border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {article.title}
            </h1>
            {article.summary && (
              <p className="mt-3 text-gray-600 text-base">{article.summary}</p>
            )}

            <div className="mt-4 text-xs text-gray-500">
              {article.publishedAt
                ? `Published ${new Date(article.publishedAt).toLocaleDateString()}`
                : `Updated ${new Date(article.updatedAt).toLocaleDateString()}`}
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="richtext-content richtext-render prose prose-sm sm:prose-base max-w-none text-gray-700">
                {renderedContent}
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
