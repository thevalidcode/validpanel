import type { Store } from "@/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon, TrashIcon } from "lucide-react";

type ActionButtonsProps = {
  store: Store;
  handleAction: (
    uid: string,
    action: "Delete" | "Resume" | "Pause" | "Edit"
  ) => void;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  store,
  handleAction,
}) => {
  return (
    <div className="flex gap-2 justify-end">
      <button
        className="text-indigo-500 hover:text-indigo-700 transition"
        title="Edit"
        onClick={() => handleAction(store.uid, "Edit")}
      >
        <PencilSquareIcon className="w-5 h-5" />
      </button>

      {store.status === "DISABLED" || store.status === "PENDING" ? (
        <button
          className="text-green-500 hover:text-green-700 transition"
          title="Resume"
          onClick={() => handleAction(store.uid, "Resume")}
        >
          <PlayIcon className="w-5 h-5" />
        </button>
      ) : (
        <button
          className="text-yellow-500 hover:text-yellow-700 transition"
          title="Pause"
          onClick={() => handleAction(store.uid, "Pause")}
        >
          <PauseIcon className="w-5 h-5" />
        </button>
      )}

      <button
        className="text-red-500 hover:text-red-700 transition"
        title="Delete"
        onClick={() => handleAction(store.uid, "Delete")}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
