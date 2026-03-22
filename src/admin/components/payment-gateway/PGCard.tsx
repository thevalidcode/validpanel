import type { FC } from "react";
import { MoreVertical } from "lucide-react";

/* -------------------- TYPES -------------------- */

export type PGStatus = "ACTIVE" | "INACTIVE" | "SANDBOX";

export interface PG {
  id: number;
  uid: string;
  name: string;
  description: string;
  logo: string;
  fee: string;
  status: PGStatus;
  lastUpdated: string;
}

interface PGCardProps {
  pg: PG;
}

/* -------------------- STATUS BADGE -------------------- */

const StatusBadge: FC<{ status: PGStatus }> = ({ status }) => {
  const styles: Record<PGStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
    SANDBOX: "bg-yellow-100 text-yellow-700",
  };

  const labelMap: Record<PGStatus, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SANDBOX: "Sandbox",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {labelMap[status]}
    </span>
  );
};

/* -------------------- COMPONENT -------------------- */

const PGCard: FC<PGCardProps> = ({ pg }) => {
  const { name, description, logo, fee, status, lastUpdated } = pg;

  const primaryAction = status === "INACTIVE" ? "Activate" : "Configure";

  return (
    <div className="bg-white rounded-[4px] border border-gray-200 p-4 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt={name}
            className="w-10 h-10 rounded-[4px] object-contain bg-gray-50"
          />
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>

        <button
          aria-label="Open gateway actions"
          className="text-gray-400 hover:text-gray-600"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
      </div>

      {/* META */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Transaction Fee</p>
          <p className="font-medium text-gray-900">{fee}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Updated</p>
          <p className="font-medium text-gray-900">{lastUpdated}</p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button className="flex-1 border border-gray-300 rounded-[4px] py-2 text-sm font-medium hover:bg-gray-50">
          {primaryAction}
        </button>

        <button className="flex-1 bg-purple-600 text-white rounded-[4px] py-2 text-sm font-medium hover:bg-purple-700">
          Test
        </button>
      </div>
    </div>
  );
};

export default PGCard;
