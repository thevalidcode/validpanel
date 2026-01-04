import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { PaymentGateway, PaymentGatewayStatus } from "@/types";

interface PGDesktopViewProps {
  gateways: PaymentGateway[];
  onEdit: (gateway: PaymentGateway) => void;
  onDelete: (uid: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const STATUS_BADGE: Record<PaymentGatewayStatus, { bg: string; text: string }> =
  {
    ACTIVE: { bg: "bg-emerald-100", text: "text-emerald-700" },
    DISABLED: { bg: "bg-gray-100", text: "text-gray-700" },
  };

export default function PGDesktopView({
  gateways,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: PGDesktopViewProps) {
  return (
    <div className="space-y-4">
      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
      >
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Gateway
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Amount Range
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gateways.map((gateway, idx) => (
              <motion.tr
                key={gateway.uid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`border-b border-gray-200 hover:bg-gray-50 transition`}
              >
                {/* Gateway Name & Image */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {gateway.image && (
                      <img
                        src={gateway.image}
                        alt={gateway.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {gateway.name}
                      </p>
                      {gateway.description && (
                        <p className="text-xs text-gray-500">
                          {gateway.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700 font-medium">
                    {gateway.platform}
                  </p>
                </td>

                {/* Amount Range */}
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">
                    {gateway.min} - {gateway.max}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_BADGE[gateway.status].bg
                    } ${STATUS_BADGE[gateway.status].text}`}
                  >
                    {gateway.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit(gateway)}
                      className="p-2 text-primary hover:bg-purple-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(gateway.uid)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between pt-4"
        >
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
