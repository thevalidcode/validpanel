import { motion } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import type { PaymentGateway, PaymentGatewayStatus } from "@/types";

interface PGMobileViewProps {
  gateways: PaymentGateway[];
  onEdit: (gateway: PaymentGateway) => void;
  onDelete: (uid: string) => void;
}

const STATUS_COLORS: Record<PaymentGatewayStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  DISABLED: "bg-gray-100 text-gray-700",
};

export default function PGMobileView({
  gateways,
  onEdit,
  onDelete,
}: PGMobileViewProps) {
  return (
    <div className="space-y-3">
      {gateways.map((gateway, idx) => (
        <motion.div
          key={gateway.uid}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white border border-gray-200 rounded-[4px] p-4 space-y-3"
        >
          {/* Header with Image */}
          <div className="flex items-start gap-3">
            {gateway.image && (
              <img
                src={gateway.image}
                alt={gateway.name}
                className="w-12 h-12 rounded-[4px] object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
              <p className="text-xs text-gray-500">{gateway.platform}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                STATUS_COLORS[gateway.status]
              }`}
            >
              {gateway.status}
            </span>
          </div>

          {/* Description */}
          {gateway.description && (
            <p className="text-sm text-gray-600">{gateway.description}</p>
          )}

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Min Amount</p>
              <p className="font-medium text-gray-900">{gateway.min}</p>
            </div>
            <div>
              <p className="text-gray-500">Max Amount</p>
              <p className="font-medium text-gray-900">{gateway.max}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => onEdit(gateway)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-purple-50 rounded-[4px] transition"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(gateway.uid)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-[4px] transition"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
