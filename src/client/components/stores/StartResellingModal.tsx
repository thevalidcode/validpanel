import { useEffect, useMemo, useState, type FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/useAppContext";
import {
  useGetResellerSourceProducts,
  useGetResellerSourceServices,
  useGetResellerSources,
  useStartReselling,
} from "@/hooks/use-reseller";
import { useGetUserStores } from "@/hooks/use-store";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { ResellerMarginType, ResellerSourceType } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  Store,
  TrendingUp,
} from "lucide-react";

interface CreateResellerStorefrontModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateResellerStorefrontModal: FC<CreateResellerStorefrontModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { userInfo } = useAppContext();

  const [sourceType, setSourceType] = useState<ResellerSourceType>("SHOP");
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [targetStoreUid, setTargetStoreUid] = useState("");
  const [marginType, setMarginType] =
    useState<ResellerMarginType>("percentage");
  const [marginValue, setMarginValue] = useState<number>(15);

  const { data: sourcesData, isLoading: isSourcesLoading } =
    useGetResellerSources({ page: 1, limit: 50, sourceType });
  const { data: myStoresData, isLoading: isStoresLoading } = useGetUserStores();
  const { data: productsData, isLoading: isProductsLoading } =
    useGetResellerSourceProducts(
      sourceType === "SHOP" ? selectedSourceId || undefined : undefined,
    );
  const { data: servicesData, isLoading: isServicesLoading } =
    useGetResellerSourceServices(
      sourceType === "SOCIAL" ? selectedSourceId || undefined : undefined,
    );

  const { mutateAsync: startReselling, isPending } = useStartReselling();

  const ownSourceUrls = useMemo(() => {
    if (!myStoresData?.length) return new Set<string>();

    return new Set(
      myStoresData
        .filter((store) =>
          sourceType === "SOCIAL"
            ? store.type === "SOCIAL"
            : store.type === "SHOP",
        )
        .map((store) => `api.${store.uid}/v2`.toLowerCase()),
    );
  }, [myStoresData, sourceType]);

  const filteredSources = useMemo(() => {
    const all = sourcesData?.sources || [];
    if (!ownSourceUrls.size) return all;

    return all.filter((source) => {
      const sourceUrl = (source.description || "").trim().toLowerCase();
      return !ownSourceUrls.has(sourceUrl);
    });
  }, [sourcesData?.sources, ownSourceUrls]);

  const sourceOptions: Option<string>[] = filteredSources.map(
    (source) => ({
      label: `${source.name} (${source.type === "SOCIAL" ? "Provider" : "Supplier"})`,
      value: source.id,
    }),
  );

  const targetStoreOptions: Option<string>[] = useMemo(
    () =>
      (myStoresData || [])
        .filter((store) =>
          sourceType === "SOCIAL"
            ? store.type === "SOCIAL"
            : store.type === "SHOP",
        )
        .map((store) => ({
          label: `${store.name} (${store.uid})`,
          value: store.uid,
        })),
    [myStoresData, sourceType],
  );

  const preview = useMemo(() => {
    const firstProduct = productsData?.products?.[0];
    const firstService = servicesData?.services?.[0];
    const first = sourceType === "SHOP" ? firstProduct : firstService;

    if (!first) {
      return null;
    }

    const basePrice = Number(first.price);
    const computed =
      marginType === "percentage"
        ? basePrice + (basePrice * marginValue) / 100
        : basePrice + marginValue;

    return {
      productName: first.name,
      basePrice,
      computedPrice: Number(computed.toFixed(2)),
      currency: first.currency || "USD",
    };
  }, [productsData, servicesData, sourceType, marginType, marginValue]);

  const hasEligibleStores = targetStoreOptions.length > 0;
  const hasEligibleSources = sourceOptions.length > 0;

  useEffect(() => {
    if (!selectedSourceId) return;
    const stillExists = sourceOptions.some(
      (option) => option.value === selectedSourceId,
    );
    if (!stillExists) {
      setSelectedSourceId("");
    }
  }, [selectedSourceId, sourceOptions]);

  const handleSubmit = async () => {
    await startReselling({
      sourceType,
      ...(sourceType === "SHOP"
        ? { supplierId: selectedSourceId }
        : { providerId: selectedSourceId }),
      targetStoreUid,
      marginType,
      marginValue,
    });

    onClose();
  };

  const canSubmit =
    !!userInfo &&
    hasEligibleSources &&
    !!selectedSourceId &&
    !!targetStoreUid.trim() &&
    marginValue >= 0 &&
    !isPending;

  const sourceTypeOptions: Option<ResellerSourceType>[] = [
    { label: "Shop Products", value: "SHOP" },
    { label: "Social Media Services", value: "SOCIAL" },
  ];

  const marginTypeOptions: Option<ResellerMarginType>[] = [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-[4px] border border-gray-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect Existing Store
                </h3>
                <p className="text-sm text-gray-500">
                  Pick a source catalog and link it to one of your stores.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {!userInfo ? (
                <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="space-y-3">
                      <p>
                        You need a ValidPanel account and at least one existing
                        store before you can start reselling.
                      </p>
                      <p className="text-amber-800">
                        Create your store first, then come back here to connect
                        a supplier or provider and import its catalog.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate("/login");
                          }}
                          className="rounded-[4px] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                        >
                          Log in
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigate("/stores/create");
                          }}
                          className="rounded-[4px] border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900"
                        >
                          Create a store
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-[4px] border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <div className="space-y-2">
                        <p className="font-medium">Seamless account handoff</p>
                        <p className="text-sky-800">
                          Once you start reselling, the{" "}
                          {sourceType === "SOCIAL" ? "provider" : "supplier"}{" "}
                          creates an account for you on their store. You can
                          access it by changing the password or using Google
                          login, and that account will handle balance, orders,
                          tickets, and related store operations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {!hasEligibleStores && (
                    <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="space-y-2">
                          <p>
                            You need an existing{" "}
                            {sourceType === "SOCIAL"
                              ? "Social Media Store"
                              : "Shop"}{" "}
                            store before you can start reselling.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              navigate("/stores/create");
                            }}
                            className="rounded-[4px] border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900"
                          >
                            Create a store
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Field
                    icon={<ShoppingCart className="w-4 h-4" />}
                    label="Catalog Type"
                  >
                    <CustomSelect
                      options={sourceTypeOptions}
                      value={sourceTypeOptions.find(
                        (option) => option.value === sourceType,
                      )}
                      onChange={(selected) => {
                        const nextSourceType = (
                          selected as Option<ResellerSourceType>
                        ).value;
                        setSourceType(nextSourceType);
                        setSelectedSourceId("");
                        setTargetStoreUid("");
                      }}
                      variant="default"
                    />
                  </Field>

                  <Field
                    icon={<ShoppingCart className="w-4 h-4" />}
                    label={sourceType === "SOCIAL" ? "Provider" : "Supplier"}
                  >
                    <CustomSelect
                      options={sourceOptions}
                      value={
                        selectedSourceId
                          ? sourceOptions.find(
                              (option) => option.value === selectedSourceId,
                            )
                          : undefined
                      }
                      placeholder={
                        sourceType === "SOCIAL"
                          ? "Select provider"
                          : "Select supplier"
                      }
                      onChange={(selected) =>
                        setSelectedSourceId((selected as Option<string>).value)
                      }
                      variant="default"
                    />
                    {isSourcesLoading && (
                      <p className="mt-1 text-xs text-gray-500">
                        Loading sources...
                      </p>
                    )}
                    {!isSourcesLoading && !hasEligibleSources && (
                      <p className="mt-1 text-xs text-amber-700">
                        No eligible {sourceType === "SOCIAL" ? "providers" : "suppliers"} found.
                        Your own source stores are automatically excluded.
                      </p>
                    )}
                  </Field>

                  <Field
                    icon={<Store className="w-4 h-4" />}
                    label="Target Store"
                  >
                    <CustomSelect
                      options={targetStoreOptions}
                      value={
                        targetStoreUid
                          ? targetStoreOptions.find(
                              (option) => option.value === targetStoreUid,
                            )
                          : undefined
                      }
                      placeholder="Select one of your existing stores"
                      onChange={(selected) =>
                        setTargetStoreUid((selected as Option<string>).value)
                      }
                      variant="default"
                    />
                    {isStoresLoading && (
                      <p className="mt-1 text-xs text-gray-500">
                        Loading your stores...
                      </p>
                    )}
                    {!isStoresLoading && !hasEligibleStores && (
                      <p className="mt-1 text-xs text-amber-700">
                        You need an existing{" "}
                        {sourceType === "SOCIAL" ? "SOCIAL" : "SHOP"} store
                        before you can start reselling.
                      </p>
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Margin Type"
                    >
                      <CustomSelect
                        options={marginTypeOptions}
                        value={marginTypeOptions.find(
                          (option) => option.value === marginType,
                        )}
                        onChange={(selected) =>
                          setMarginType(
                            (selected as Option<ResellerMarginType>).value,
                          )
                        }
                        variant="default"
                      />
                    </Field>

                    <Field
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Margin Value"
                    >
                      <input
                        id="reseller-margin-value"
                        type="text"
                        value={marginValue}
                        onChange={(event) =>
                          setMarginValue(Number(event.target.value || 0))
                        }
                        placeholder={marginType === "percentage" ? "15" : "100"}
                        className="mt-1 w-full rounded-[4px] border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </Field>
                  </div>

                  {selectedSourceId && preview && (
                    <div className="rounded-[4px] border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          Pricing Preview
                        </h4>
                      </div>

                      {(isProductsLoading || isServicesLoading) && (
                        <p className="text-sm text-gray-500">
                          {sourceType === "SOCIAL"
                            ? "Loading provider services..."
                            : "Loading supplier products..."}
                        </p>
                      )}

                      {!isProductsLoading && !isServicesLoading && !preview && (
                        <p className="text-sm text-gray-500">
                          Select a supplier or provider to preview pricing.
                        </p>
                      )}

                      {preview && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {preview.productName}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Base Price:</span>
                            <span className="font-medium">
                              {preview.basePrice} {preview.currency}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Your Resell Price:</span>
                            <span className="font-medium">
                              {preview.computedPrice} {preview.currency}
                            </span>
                          </div>
                        </div>
                      )}

                      {!!(sourceType === "SOCIAL"
                        ? servicesData?.services?.length
                        : productsData?.products?.length) && (
                        <p className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-500">
                          {sourceType === "SOCIAL"
                            ? `${servicesData?.services?.length || 0} provider services will be imported and synced.`
                            : `${productsData?.products?.length || 0} supplier products will be imported and synced.`}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-shrink-0 justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="rounded-[4px] border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="rounded-[4px] bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                {isPending ? "Starting..." : "Start Reselling"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateResellerStorefrontModal;

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
