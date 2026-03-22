import type { FC } from "react";
import { Pencil, Trash2 } from "lucide-react";

/* -------------------- TYPES -------------------- */

export type PGStatus = "ACTIVE" | "INACTIVE" | "SANDBOX";

export interface PGTableRow {
  id: number;
  name: string;
  providerUrl: string;
  logo: string;
  type: string;
  fee: string;
  status: PGStatus;
  lastUpdated: string;
}

interface RecentPGTableProps {
  rows: PGTableRow[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* -------------------- STATUS BADGE -------------------- */

const StatusBadge: FC<{ status: PGStatus }> = ({ status }) => {
  const styles: Record<PGStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-red-100 text-red-700",
    SANDBOX: "bg-yellow-100 text-yellow-700",
  };

  const label: Record<PGStatus, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    SANDBOX: "Sandbox",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
};

/* -------------------- COMPONENT -------------------- */

const RecentPGTable: FC<RecentPGTableProps> = ({
  rows,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-[4px] shadow-sm">
      {/* HEADER */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Payment Gateways
        </h2>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3">Gateway</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Transaction Fee</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No payment gateways found.
                </td>
              </tr>
            ) : (
              rows.map((pg) => (
                <tr key={pg.id} className="border-t">
                  {/* GATEWAY */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={pg.logo}
                        alt={pg.name}
                        className="w-8 h-8 rounded-[4px] object-contain bg-gray-50"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{pg.name}</p>
                        <p className="text-xs text-gray-500">
                          {pg.providerUrl}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                      {pg.type}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <StatusBadge status={pg.status} />
                  </td>

                  {/* FEE */}
                  <td className="px-6 py-4">{pg.fee}</td>

                  {/* DATE */}
                  <td className="px-6 py-4">{pg.lastUpdated}</td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        title="Edit"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t text-sm">
        <p className="text-gray-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-[4px] disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-[4px] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentPGTable;
