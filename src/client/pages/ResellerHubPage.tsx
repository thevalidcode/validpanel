import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Compass, ImageIcon, Layers, Store } from "lucide-react";
import { useAppContext } from "@/context/useAppContext";
import {
  useGetResellerSourceProducts,
  useGetResellerSourceServices,
  useGetResellerSources,
} from "@/hooks/use-reseller";
import { Pagination } from "@/components/ui/Pagination";
import CreateResellerStorefrontModal from "../components/stores/StartResellingModal";
import type {
  ResellerSourceProduct,
  ResellerSourceService,
  ResellerSourceType,
} from "@/types";
import { useGetUserStores } from "@/hooks/use-store";
import NotFound from "@/components/NotFound";

const ResellerHubPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppContext();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [search, setSearch] = useState("");
  const [sourceType, setSourceType] = useState<ResellerSourceType>("SHOP");
  const [selectedSourceId, setSelectedSourceId] = useState<string>("");
  const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [previewPageSize] = useState(12);

  const { data: myStores } = useGetUserStores();

  const { data: sourcesData, isLoading: isSourcesLoading } =
    useGetResellerSources({
      page,
      limit: itemsPerPage,
      search: search.trim() || undefined,
      sourceType,
    });

  const { data: productsData, isLoading: isProductsLoading } =
    useGetResellerSourceProducts(
      sourceType === "SHOP" ? selectedSourceId || undefined : undefined,
    );

  const { data: servicesData, isLoading: isServicesLoading } =
    useGetResellerSourceServices(
      sourceType === "SOCIAL" ? selectedSourceId || undefined : undefined,
    );

  const mySourceUrls = useMemo(() => {
    if (!myStores?.length) return new Set<string>();

    return new Set(
      myStores
        .filter((store) =>
          sourceType === "SOCIAL"
            ? store.type === "SOCIAL"
            : store.type === "SHOP",
        )
        .map((store) => `api.${store.uid}/v2`.toLowerCase()),
    );
  }, [myStores, sourceType]);

  const filteredSources = useMemo(() => {
    const all = sourcesData?.sources || [];
    if (!mySourceUrls.size) return all;

    return all.filter((source) => {
      const sourceUrl = (source.description || "").trim().toLowerCase();
      return !mySourceUrls.has(sourceUrl);
    });
  }, [sourcesData?.sources, mySourceUrls]);

  const selectedStore = useMemo(
    () => filteredSources.find((source) => source.id === selectedSourceId),
    [filteredSources, selectedSourceId],
  );

  const previewItems = useMemo(() => {
    return sourceType === "SOCIAL"
      ? servicesData?.services || []
      : productsData?.products || [];
  }, [sourceType, servicesData?.services, productsData?.products]);

  const paginatedPreviewItems = useMemo(() => {
    const start = (previewPage - 1) * previewPageSize;
    const end = start + previewPageSize;
    return previewItems.slice(start, end);
  }, [previewItems, previewPage, previewPageSize]);

  const isPreviewLoading =
    sourceType === "SOCIAL" ? isServicesLoading : isProductsLoading;

  const handleStartReselling = () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    setIsResellerModalOpen(true);
  };

  const hasNoSources = !isSourcesLoading && filteredSources.length === 0;

  return (
    <main className="bg-white min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <section className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[8px] border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50 p-6 sm:p-8 mb-8 shadow-sm">
          <div className="absolute left-0 top-0 h-1 w-full bg-[var(--color-primary)]" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[4px] border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3">
                <Compass className="w-3.5 h-3.5" />
                Reseller Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Launch Your Next Reseller Storefront
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl">
                Browse trusted suppliers and providers, inspect live catalogs,
                then launch with your own pricing strategy in minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartReselling}
              className="group inline-flex items-center gap-2 rounded-[4px] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/90"
            >
              Start Reselling
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSourceType("SHOP");
              setSelectedSourceId("");
              setPage(1);
              setPreviewPage(1);
            }}
            className={`rounded-[4px] border px-4 py-2 text-sm font-medium transition ${
              sourceType === "SHOP"
                ? "border-[var(--color-primary)] bg-purple-50 text-[var(--color-primary)]"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            Shop Products
          </button>
          <button
            type="button"
            onClick={() => {
              setSourceType("SOCIAL");
              setSelectedSourceId("");
              setPage(1);
              setPreviewPage(1);
            }}
            className={`rounded-[4px] border px-4 py-2 text-sm font-medium transition ${
              sourceType === "SOCIAL"
                ? "border-[var(--color-primary)] bg-purple-50 text-[var(--color-primary)]"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            Social Media Services
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${sourceType === "SOCIAL" ? "providers" : "suppliers"}`}
            className="w-full md:w-[420px] rounded-[4px] border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {hasNoSources ? (
              <NotFound
                title={`No ${sourceType === "SOCIAL" ? "providers" : "suppliers"} found`}
                description={`No eligible ${sourceType === "SOCIAL" ? "social media store providers" : "shop suppliers"} are available right now. This can happen if only your own store exists in the registry.`}
                actionLabel="Refresh"
                onActionClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="h-full"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredSources.map((source) => {
                  const active = source.id === selectedSourceId;
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => {
                        setSelectedSourceId(source.id);
                        setPreviewPage(1);
                      }}
                      className={`text-left rounded-[6px] border p-4 transition ${
                        active
                          ? "border-[var(--color-primary)] bg-purple-50/30"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[6px] border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {source.image ? (
                            <img
                              src={source.image}
                              alt={source.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {source.name}
                            </h3>
                            {source.type === "SOCIAL" ? (
                              <Layers className="w-4 h-4 text-gray-500 shrink-0" />
                            ) : (
                              <Store className="w-4 h-4 text-gray-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {source.type === "SOCIAL" ? "Provider" : "Supplier"}
                            {source.description
                              ? ` · ${source.description}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      {source.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {source.description}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {isSourcesLoading && (
              <div className="mt-4 text-sm text-gray-500">
                Loading sources...
              </div>
            )}

            <Pagination
              className="mt-8"
              currentPage={sourcesData?.meta.page || page}
              totalItems={sourcesData?.meta.total || 0}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setItemsPerPage(size);
                setPage(1);
              }}
            />
          </div>

          <aside className="rounded-[6px] border border-gray-200 bg-white p-4 h-fit">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-base font-semibold text-gray-900">
                {sourceType === "SOCIAL"
                  ? "Service Preview"
                  : "Product Preview"}
              </h2>
              {!!previewItems.length && (
                <span className="text-xs font-medium text-gray-500 rounded-[4px] border border-gray-200 px-2 py-1">
                  {previewItems.length.toLocaleString()} total
                </span>
              )}
            </div>
            {!selectedSourceId && (
              <p className="text-sm text-gray-500">
                Select a store to preview{" "}
                {sourceType === "SOCIAL" ? "services" : "products"}.
              </p>
            )}
            {selectedStore && (
              <p className="text-xs text-gray-500 mb-3">
                From {selectedStore.name}
              </p>
            )}
            {isPreviewLoading && (
              <p className="text-sm text-gray-500">
                Loading {sourceType === "SOCIAL" ? "services" : "products"}...
              </p>
            )}
            {!isPreviewLoading && !!paginatedPreviewItems.length && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sourceType === "SHOP"
                    ? paginatedPreviewItems.map((item) => {
                        const product = item as ResellerSourceProduct;
                        return (
                          <div
                            key={product.productId}
                            className="rounded-[6px] border border-gray-100 bg-gray-50 p-3 min-w-0"
                          >
                            <p className="text-sm font-semibold text-gray-900 break-words line-clamp-2">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 break-words">
                              {product.price} {product.currency}
                            </p>
                          </div>
                        );
                      })
                    : paginatedPreviewItems.map((item) => {
                        const service = item as ResellerSourceService;
                        return (
                          <div
                            key={service.uid}
                            className="rounded-[6px] border border-gray-100 bg-gray-50 p-3 min-w-0"
                          >
                            <p className="text-sm font-semibold text-gray-900 break-words line-clamp-2">
                              {service.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 break-words">
                              {service.price} {service.currency || "USD"}
                            </p>
                          </div>
                        );
                      })}
                </div>

                {previewItems.length > previewPageSize && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPage((current) => Math.max(1, current - 1))
                      }
                      disabled={previewPage === 1}
                      className="rounded-[4px] border border-gray-200 px-3 py-1.5 text-xs text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <p className="text-xs text-gray-500">
                      Page {previewPage} of{" "}
                      {Math.max(
                        1,
                        Math.ceil(previewItems.length / previewPageSize),
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPage((current) =>
                          Math.min(
                            Math.ceil(previewItems.length / previewPageSize),
                            current + 1,
                          ),
                        )
                      }
                      disabled={
                        previewPage >=
                        Math.ceil(previewItems.length / previewPageSize)
                      }
                      className="rounded-[4px] border border-gray-200 px-3 py-1.5 text-xs text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isPreviewLoading &&
              selectedSourceId &&
              sourceType === "SHOP" &&
              !productsData?.products?.length && (
                <p className="text-sm text-gray-500">
                  No products available for preview.
                </p>
              )}
            {!isPreviewLoading &&
              selectedSourceId &&
              sourceType === "SOCIAL" &&
              !servicesData?.services?.length && (
                <p className="text-sm text-gray-500">
                  No services available for preview.
                </p>
              )}
          </aside>
        </div>
      </section>

      <CreateResellerStorefrontModal
        open={isResellerModalOpen}
        onClose={() => setIsResellerModalOpen(false)}
      />
    </main>
  );
};

export default ResellerHubPage;
