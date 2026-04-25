import { useMemo, useState } from "react";
import { BookOpenText, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetKnowledgeBasePublic } from "@/hooks/use-knowledge-base";
import { Pagination } from "@/components/ui/Pagination";
import NotFound from "@/components/NotFound";

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data, isLoading } = useGetKnowledgeBasePublic({
    page,
    limit: itemsPerPage,
    search: search.trim() || undefined,
  });

  const categories = useMemo(() => {
    const list = data?.knowledgeBase || [];
    const categorySet = new Set<string>();
    list.forEach((item) => {
      if (item.category) categorySet.add(item.category);
    });
    return ["All", ...Array.from(categorySet)];
  }, [data?.knowledgeBase]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = useMemo(() => {
    const list = data?.knowledgeBase || [];
    if (selectedCategory === "All") return list;
    return list.filter((item) => item.category === selectedCategory);
  }, [data?.knowledgeBase, selectedCategory]);

  return (
    <main className="bg-white min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <section className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[8px] border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="absolute left-0 top-0 h-1 w-full bg-[var(--color-primary)]" />

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[4px] border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Knowledge Base
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Learn The Platform, Faster
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
                Step-by-step guides, practical walkthroughs, and best practices
                to help you launch, manage, and scale your business on
                ValidPanel.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative w-full md:w-[460px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search guides, topics, and tutorials"
                className="w-full rounded-[6px] border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-sm transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[8px] border border-gray-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-2 rounded-[6px] border px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "border-[var(--color-primary)] bg-purple-50 text-[var(--color-primary)] shadow-sm"
                    : "border-transparent bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-gray-500">Loading knowledge base...</div>
        ) : filtered.length === 0 ? (
          <NotFound
            title="No articles found"
            description="Try a different search or category"
            icon={<BookOpenText className="w-10 h-10 mx-auto text-gray-400" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((article) => (
              <Link
                key={article.uid}
                to={`/knowledge-base/${article.slug}`}
                className="group rounded-[8px] border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="h-44 bg-gray-100 overflow-hidden">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <BookOpenText className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-gray-500">
                      {article.category || "General"}
                    </span>
                    {article.isFeatured && (
                      <span className="rounded-[4px] border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-semibold text-gray-900 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {article.summary ||
                      "Read this guide to understand the workflow and best practices."}
                  </p>

                  <div className="mt-4 text-xs text-gray-500">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          className="mt-8"
          currentPage={data?.meta.page || page}
          totalItems={data?.meta.total || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setPage(1);
          }}
        />
      </section>
    </main>
  );
}
