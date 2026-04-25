import { useMemo, useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { KnowledgeBaseArticle } from "@/types";
import KnowledgeBaseActions from "./KnowledgeBaseActions";

interface KnowledgeBaseDesktopViewProps {
  articles: KnowledgeBaseArticle[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

function statusClass(status: KnowledgeBaseArticle["status"]) {
  if (status === "PUBLISHED") return "bg-green-100 text-green-700";
  if (status === "ARCHIVED") return "bg-gray-100 text-gray-700";
  return "bg-amber-100 text-amber-700";
}

export default function KnowledgeBaseDesktopView({
  articles,
  handleAction,
}: KnowledgeBaseDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data: paginatedArticles } = useMemo(
    () => paginate(articles, currentPage, itemsPerPage),
    [articles, currentPage, itemsPerPage],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto border border-gray-200 rounded-[4px] bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Published</th>
              <th className="px-6 py-3">Featured</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No knowledge base articles found
                </td>
              </tr>
            ) : (
              paginatedArticles.map((article) => (
                <tr key={article.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-start gap-3 min-w-[280px]">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="h-10 w-10 rounded-[4px] border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-[4px] border border-gray-200 bg-gray-100" />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{article.title}</p>
                        <p className="text-xs text-gray-500 truncate">/{article.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{article.category || "General"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-[4px] text-xs font-medium ${statusClass(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-[4px] text-xs font-medium ${
                        article.isFeatured
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.isFeatured ? "Featured" : "Normal"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <KnowledgeBaseActions
                      article={article}
                      handleAction={handleAction}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={articles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
