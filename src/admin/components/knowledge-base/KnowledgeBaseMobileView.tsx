import type { KnowledgeBaseArticle } from "@/types";
import KnowledgeBaseActions from "./KnowledgeBaseActions";

interface KnowledgeBaseMobileViewProps {
  articles: KnowledgeBaseArticle[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

function statusClass(status: KnowledgeBaseArticle["status"]) {
  if (status === "PUBLISHED") return "bg-green-100 text-green-700";
  if (status === "ARCHIVED") return "bg-gray-100 text-gray-700";
  return "bg-amber-100 text-amber-700";
}

export default function KnowledgeBaseMobileView({
  articles,
  handleAction,
}: KnowledgeBaseMobileViewProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[4px] border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">No knowledge base articles found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <div
          key={article.uid}
          className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-sm space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">/{article.slug}</p>
            </div>
            <KnowledgeBaseActions article={article} handleAction={handleAction} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500 block mb-0.5">Category</span>
              <span className="font-medium text-gray-900">{article.category || "General"}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-0.5">Status</span>
              <span className={`inline-flex px-2 py-1 rounded-[4px] ${statusClass(article.status)}`}>
                {article.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
            <span className={article.isFeatured ? "text-purple-700" : "text-gray-500"}>
              {article.isFeatured ? "Featured" : "Standard"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
