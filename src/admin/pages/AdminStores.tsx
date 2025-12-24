import { useEffect, useState, type JSX } from "react";
import StoreTable from "../components/stores/StoreTable";
import Layout from "../components/Layout";
import {
  useAdminUpdateStore,
  useApproveStore,
  useDeleteStore,
  useGetStores,
  useGetStoreStats,
  usePauseStore,
} from "@/hooks/use-store";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import { PauseIcon, PlayIcon, ShoppingBagIcon } from "lucide-react";
import { StatCard } from "../components/stores/StatCard";
import type { StoreWithOwner } from "@/types";
import DeleteDialog from "@/components/DeleteDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditStoreDialog from "@/components/EditStoreDialog";

//  AdminStores Component
export default function AdminStores(): JSX.Element {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    uid: string;
    type: "RESUME" | "PAUSE";
  } | null>(null);
  const [editTarget, setEditTarget] = useState("");
  const [stores, setStores] = useState<StoreWithOwner[]>([]);

  const { data: fetchedStores, isLoading } = useGetStores();
  const { data: stats, isLoading: isStatsLoading } = useGetStoreStats();
  const { mutateAsync: deleteStore, isPending: isDeletePending } =
    useDeleteStore();
  const { mutateAsync: approveStore, isPending: isApprovePending } =
    useApproveStore();
  const { mutateAsync: pauseStore, isPending: isPausePending } =
    usePauseStore();
  const { mutateAsync: updateStore, isPending: isUpdatePending } =
    useAdminUpdateStore();

  useEffect(() => {
    if (fetchedStores) setStores(fetchedStores);
  }, [fetchedStores]);

  if (isLoading || isStatsLoading) {
    return <Loader />;
  }

  // Trigger dialogs
  const handleAction = (
    uid: string,
    action: "Delete" | "Resume" | "Pause" | "Edit"
  ) => {
    if (action === "Delete") setDeleteTarget(uid);
    if (action === "Resume") setActionTarget({ uid, type: "RESUME" });
    if (action === "Pause") setActionTarget({ uid, type: "PAUSE" });
    if (action === "Edit") setEditTarget(uid);
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteStore({ uid: deleteTarget });
      setStores((prev) => prev.filter((u) => !deleteTarget.includes(u.uid)));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm suspend / approve
  const handleActionConfirm = async () => {
    if (!actionTarget) return;
    try {
      if (actionTarget.type === "PAUSE") {
        await pauseStore({ uid: actionTarget.uid });
        setStores((prev) =>
          prev.map((u) =>
            actionTarget.uid === u.uid ? { ...u, status: "DISABLED" } : u
          )
        );
      } else if (actionTarget.type === "RESUME") {
        await approveStore({ uid: actionTarget.uid });
        setStores((prev) =>
          prev.map((u) =>
            actionTarget.uid === u.uid ? { ...u, status: "ACTIVE" } : u
          )
        );
      }
      setActionTarget(null);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Layout
      title="Store Management"
      description="View and manage all created shops and social media stores."
    >
      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Stores"
            value={stats?.total.toString() || "0"}
            color="text-blue-700"
            icon="/TotalS.svg"
          />
          <StatCard
            title="Active Stores"
            value={stats?.active.toString() || "0"}
            color="text-green-700"
            icon="/ActiveS.svg"
          />
          <StatCard
            title="Paused Stores"
            value={stats?.paused.toString() || "0"}
            color="text-yellow-700"
            icon="/Pausedstore.svg"
          />
          <StatCard
            title="This Month"
            value={stats?.createdThisMonth.toString() || "0"}
            color="text-purple-700"
            icon="/Calender.svg"
          />
        </div>

        {/* Table Section */}
        {stores && stores.length !== 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
            <StoreTable stores={stores} handleAction={handleAction} />
          </div>
        ) : (
          <NotFound
            title="No store has been created yet!"
            variant="card"
            icon={<ShoppingBagIcon />}
          />
        )}
        {/* Confirm Ban / Activate */}
        <ConfirmDialog
          open={!!actionTarget}
          title={
            actionTarget?.type === "PAUSE" ? "Pause Store" : "Resume Store"
          }
          description={
            actionTarget?.type === "PAUSE"
              ? "This store will be paused and lose access."
              : "This store will be resumed and regain access."
          }
          icon={
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                actionTarget?.type === "PAUSE"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {actionTarget?.type === "PAUSE" ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </div>
          }
          confirmLabel={actionTarget?.type === "PAUSE" ? "Pause" : "Resume"}
          isLoading={isPausePending || isApprovePending}
          onCancel={() => setActionTarget(null)}
          onConfirm={handleActionConfirm}
        />
        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          open={!!deleteTarget}
          title="Delete store"
          description="This store and all its data will be permanently removed. This action cannot be undone."
          isLoading={isDeletePending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />

        {/* Edit */}
        <EditStoreDialog
          open={editTarget !== ""}
          initialValues={stores.find((s) => s.uid === editTarget)!}
          isLoading={isUpdatePending}
          onCancel={() => setEditTarget("")}
          onSubmit={(data) => updateStore({ uid: editTarget, data })}
        />
      </main>
    </Layout>
  );
}
