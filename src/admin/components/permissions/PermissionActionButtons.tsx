import type { Permission } from "@/types";
import { EditIcon, TrashIcon } from "lucide-react";

function PermissionActionButtons({
  handleAction,
  permission,
}: {
  permission: Permission;
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        title="Edit"
        onClick={() => handleAction(permission.uid, "Edit")}
        className="text-blue-700"
      >
        <EditIcon className="w-5 h-5" />
      </button>
      <button
        title="Delete"
        onClick={() => handleAction(permission.uid, "Delete")}
        className="text-red-600"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default PermissionActionButtons;