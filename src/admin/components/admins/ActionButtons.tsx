import type { Admin } from "@/types";
import { Ban, Check, EditIcon, TrashIcon } from "lucide-react";

function ActionButtons({
  handleAction,
  admin,
}: {
  admin: Admin;
  handleAction: (
    uid: string,
    action: "Delete" | "Ban" | "Approve" | "Edit"
  ) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        title="Edit"
        onClick={() => handleAction(admin.uid, "Edit")}
        className="text-blue-700"
      >
        <EditIcon className="w-5 h-5" />
      </button>
      {admin.status === "BANNED" ? (
        <button
          title="Approve"
          onClick={() => handleAction(admin.uid, "Approve")}
          className="text-green-600"
        >
          <Check className="w-5 h-5" />
        </button>
      ) : (
        <button
          title="Ban"
          onClick={() => handleAction(admin.uid, "Ban")}
          className="text-red-400"
        >
          <Ban className="w-5 h-5" />
        </button>
      )}
      <button
        title="Delete"
        onClick={() => handleAction(admin.uid, "Delete")}
        className="text-red-600"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ActionButtons;
