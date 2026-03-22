import type { Role } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";

interface RoleCardProps {
  role: Role;
  maxVisible?: number;
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
}

function RoleCard({ role, maxVisible = 5, onEdit, onDelete }: RoleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasAllAccess = role.permissions.some(
    (p) =>
      p.permission.name === "ALL_ACCESS" || p.permission.name === "ALL ACCESS"
  );

  const visiblePermissions = expanded
    ? role.permissions
    : role.permissions.slice(0, maxVisible);

  const remaining = role.permissions.length - maxVisible;

  return (
    <motion.div
      layout
      key={role.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-[4px] border border-gray-200 p-4 flex flex-col gap-3 bg-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <p className="font-medium text-gray-900">{role.name}</p>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-[4px] text-xs font-medium whitespace-nowrap ${
              hasAllAccess
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {hasAllAccess ? "Full Access" : "Limited"}
          </span>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(role)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Edit role"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(role)}
              className="p-1 text-gray-500 hover:text-red-700 transition-colors"
              aria-label="Delete role"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Permissions */}
      <AnimatePresence initial={false}>
        <motion.div layout className="flex flex-col gap-2 overflow-hidden">
          {visiblePermissions.map((rp) => (
            <motion.div
              key={rp.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <Check className="w-4 h-4 text-green-600 shrink-0" />
              <span>{rp.permission.name.replace(/_/g, " ")}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Expand / Collapse */}
      {role.permissions.length > maxVisible && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-primary hover:underline self-start"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />+{remaining} more
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}

export default RoleCard;
