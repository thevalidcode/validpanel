import { useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import type { ResellerStore, StoreType } from "@/types";
import Layout from "../components/Layout";
import Loader from "@/components/Loader";
import DeleteDialog from "@/components/DeleteDialog";
import ResellerStoresDesktopView from "../components/reseller-stores/ResellerStoresDesktopView";
import ResellerStoresMobileView from "../components/reseller-stores/ResellerStoresMobileView";
import EditResellerStoreDialog from "../components/reseller-stores/EditResellerStoreDialog";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import {
  useCreateResellerStoreAdmin,
  useDeleteResellerStoreAdmin,
  useGetResellerStoresAdmin,
  useUpdateResellerStoreAdmin,
} from "@/hooks/use-reseller-store";

function ResellerStoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | StoreType>("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    resellerStore?: ResellerStore;
  }>({
    open: false,
    mode: "create",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    resellerStore?: ResellerStore;
  }>({ open: false });

  const { data, isLoading } = useGetResellerStoresAdmin({ limit: 100 });
  const createMutation = useCreateResellerStoreAdmin();
  const updateMutation = useUpdateResellerStoreAdmin();
  const deleteMutation = useDeleteResellerStoreAdmin();

  const stores = data?.resellerStores || [];

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const bySearch =
        !searchTerm.trim() ||
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.url.toLowerCase().includes(searchTerm.toLowerCase());

      const byType = typeFilter === "ALL" || store.type === typeFilter;

      const byStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? store.isActive : !store.isActive);

      return bySearch && byType && byStatus;
    });
  }, [stores, searchTerm, typeFilter, statusFilter]);

  const handleCreate = () => {
    setDialogState({ open: true, mode: "create" });
  };

  const handleEdit = (resellerStore: ResellerStore) => {
    setDialogState({ open: true, mode: "edit", resellerStore });
  };

  const handleDelete = (resellerStore: ResellerStore) => {
    setDeleteDialog({ open: true, resellerStore });
  };

  const handleSubmit = async (payload: {
    name: string;
    url: string;
    image?: string | null;
    type?: StoreType;
    isActive: boolean;
  }) => {
    if (dialogState.mode === "create") {
      await createMutation.mutateAsync({
        name: payload.name,
        url: payload.url,
        image: payload.image,
        type: payload.type || "SHOP",
        isActive: payload.isActive,
      });
      setDialogState({ open: false, mode: "create" });
      return;
    }

    if (!dialogState.resellerStore) return;

    await updateMutation.mutateAsync({
      uid: dialogState.resellerStore.uid,
      name: payload.name,
      url: payload.url,
      image: payload.image,
      isActive: payload.isActive,
    });
    setDialogState({ open: false, mode: "create" });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.resellerStore) return;
    await deleteMutation.mutateAsync(deleteDialog.resellerStore.uid);
    setDeleteDialog({ open: false });
  };

  const typeOptions: Option<string>[] = [
    { label: "All Types", value: "ALL" },
    { label: "Shop", value: "SHOP" },
    { label: "Social", value: "SOCIAL" },
    { label: "Digital", value: "DIGITAL" },
  ];

  const statusOptions: Option<string>[] = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  return (
    <Layout
      title="Reseller Stores"
      description="Manage internal and external reseller source registries."
    >
      <div className="py-5 px-6 w-full">
        <div className="flex w-full flex-col xl:flex-row xl:items-center gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search reseller stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-200 outline-0 w-full rounded-[4px] pr-3 pl-12 py-2 focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          <div className="w-full xl:w-48">
            <CustomSelect
              options={typeOptions}
              value={typeOptions.find((option) => option.value === typeFilter)}
              onChange={(selected) =>
                setTypeFilter((selected as Option<"ALL" | StoreType>).value)
              }
            />
          </div>

          <div className="w-full xl:w-48">
            <CustomSelect
              options={statusOptions}
              value={statusOptions.find(
                (option) => option.value === statusFilter,
              )}
              onChange={(selected) =>
                setStatusFilter(
                  (selected as Option<"ALL" | "ACTIVE" | "INACTIVE">).value,
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
              <span>Create Reseller Store</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : (
          <div className="mt-5">
            <div className="hidden lg:block">
              <ResellerStoresDesktopView
                stores={filteredStores}
                handleAction={(uid, action) => {
                  const store = stores.find((item) => item.uid === uid);
                  if (!store) return;
                  if (action === "Edit") handleEdit(store);
                  if (action === "Delete") handleDelete(store);
                }}
              />
            </div>

            <div className="lg:hidden">
              <ResellerStoresMobileView
                stores={filteredStores}
                handleAction={(uid, action) => {
                  const store = stores.find((item) => item.uid === uid);
                  if (!store) return;
                  if (action === "Edit") handleEdit(store);
                  if (action === "Delete") handleDelete(store);
                }}
              />
            </div>
          </div>
        )}

        <EditResellerStoreDialog
          open={dialogState.open}
          mode={dialogState.mode}
          initialValues={dialogState.resellerStore}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onCancel={() => setDialogState({ open: false, mode: "create" })}
          onSubmit={handleSubmit}
        />

        <DeleteDialog
          open={deleteDialog.open}
          title="Delete Reseller Store"
          description={`Are you sure you want to delete reseller store "${deleteDialog.resellerStore?.name}"? This action cannot be undone.`}
          icon={<Trash2 className="w-6 h-6" />}
          confirmLabel="Delete Reseller Store"
          isLoading={deleteMutation.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ open: false })}
        />
      </div>
    </Layout>
  );
}

export default ResellerStoresPage;
