import { useState, type FC } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { PauseIcon } from "lucide-react";

import type { Store, StoreStatus } from "@/types";
import { DateTime } from "@/components/DateTime";
import DeleteDialog from "@/components/DeleteDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import EditStoreDialog from "./EditStoreDialog";
import { useDeleteUserStore, useUpdateStore } from "@/hooks/use-store";
import { StatusBadge } from "@/utils/store.utils";

interface StoreCardProps {
  store: Store;
}

const StoreCard: FC<StoreCardProps> = ({ store }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [targetStatus, setTargetStatus] = useState<StoreStatus | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const { mutateAsync: deleteStore, isPending: isDeletePending } =
    useDeleteUserStore();

  const { mutateAsync: updateStore, isPending: isUpdatePending } =
    useUpdateStore();

  const handleDelete = async () => {
    await deleteStore(store.uid);
    setShowDelete(false);
  };

  const handleStatusConfirm = async () => {
    if (!targetStatus) return;

    await updateStore({
      uid: store.uid,
      data: { status: targetStatus },
    });

    setTargetStatus(null);
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition border-l-4 border-l-primary">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gray-200 rounded-md overflow-hidden">
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                No logo
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">{store.name}</h3>

            <span
              className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                store.type === "SHOP"
                  ? "bg-primary text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {store.type}
            </span>

            <p className="text-xs text-gray-500 mt-1">
              Created on <DateTime date={store.timestamp} />
            </p>
          </div>
        </div>

        <StatusBadge status={store.status} />
      </div>

      <hr className="my-4 border-gray-100" />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => window.open(`https://${store.uid}`, "_blank")}
          className="flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md"
        >
          <EyeIcon className="w-4 h-4" /> View
        </button>

        <button
          type="button"
          onClick={() =>
            window.open(`https://${store.uid}/control-panel/login`, "_blank")
          }
          className="flex items-center gap-1 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md"
        >
          <EyeIcon className="w-4 h-4" /> Admin
        </button>

        <button
          type="button"
          onClick={() => setShowEdit(true)}
          className="flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md"
        >
          <PencilSquareIcon className="w-4 h-4" /> Edit
        </button>

        {store.status == "ACTIVE" && (
          <button
            type="button"
            onClick={() => setTargetStatus("DISABLED")}
            className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-md"
          >
            <PauseIcon className="w-4 h-4" /> Pause
          </button>
        )}

        {store.status === "DISABLED" && (
          <button
            type="button"
            onClick={() => setTargetStatus("ACTIVE")}
            className="flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md"
          >
            <PlayIcon className="w-4 h-4" /> Resume
          </button>
        )}

        <button
          title="delete"
          type="button"
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-1 bg-red-100 text-red-600 text-sm px-3 py-1 rounded-md"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Delete */}
      <DeleteDialog
        open={showDelete}
        title="Delete store"
        description="This store and all its data will be permanently removed."
        isLoading={isDeletePending}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Pause / Resume */}
      <ConfirmDialog
        open={!!targetStatus}
        title={targetStatus === "DISABLED" ? "Pause store" : "Resume store"}
        description={
          targetStatus === "DISABLED"
            ? "This store will be temporarily disabled."
            : "This store will be reactivated."
        }
        icon={
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              targetStatus === "DISABLED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {targetStatus === "DISABLED" ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </div>
        }
        confirmLabel={targetStatus === "DISABLED" ? "Pause" : "Resume"}
        isLoading={isUpdatePending}
        onCancel={() => setTargetStatus(null)}
        onConfirm={handleStatusConfirm}
      />

      {/* Edit */}
      <EditStoreDialog
        open={showEdit}
        initialValues={store}
        isLoading={isUpdatePending}
        onCancel={() => setShowEdit(false)}
        onSubmit={(data) => updateStore({ uid: store.uid, data })}
      />
    </div>
  );
};

export default StoreCard;
