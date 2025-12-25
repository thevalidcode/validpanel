import { type FC, useMemo } from "react";
import type { Role } from "@/types/models/role";

interface RoleBadgeProps {
  roles?: Role[];
  maxVisible?: number;
}

const COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-yellow-100 text-yellow-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
  "bg-teal-100 text-teal-700",
];

const getColorByRoleName = (name?: string) => {
  if (!name) return "bg-gray-100 text-gray-700";
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    COLORS.length;
  return COLORS[index];
};

const RoleBadge: FC<RoleBadgeProps> = ({ roles = [], maxVisible = 5 }) => {
  const visibleRoles = roles.slice(0, maxVisible);
  const remaining = roles.length - visibleRoles.length;

  const rendered = useMemo(
    () =>
      visibleRoles.map((role) => {
        const hasAllAccess = role.permissions?.some(
          (p) =>
            p?.permission?.name === "ALL_ACCESS" ||
            p?.permission?.name === "ALL ACCESS"
        );

        return (
          <span
            key={role.id ?? role.name ?? Math.random()}
            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              hasAllAccess
                ? "bg-red-100 text-red-700"
                : getColorByRoleName(role.name)
            }`}
          >
            {role.name ?? "Unknown Role"}
          </span>
        );
      }),
    [visibleRoles]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {rendered}
      {remaining > 0 && (
        <span className="text-xs text-gray-500">+{remaining} more</span>
      )}
    </div>
  );
};

export default RoleBadge;
