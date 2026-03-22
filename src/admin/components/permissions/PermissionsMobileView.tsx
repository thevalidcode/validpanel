import { useState } from "react";
import { Edit2Icon, MoreVertical, Search, Trash } from "lucide-react";
import type { FC } from "react";
import ActionMenu from "@/components/ui/ActionMenu";
import type { Permission } from "@/types";
import { getPermissionIcon } from "./PermissionIcon";
import QuickStats from "./QuickStats";

interface PermissionsMobileViewProps {
  permissions: Permission[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

const PermissionsMobileView: FC<PermissionsMobileViewProps> = ({
  permissions,
  handleAction,
}) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const visiblePermissions = permissions.slice(0, visibleCount);
  const hasMore = visibleCount < permissions.length;

  const onHandleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="flex gap-4 flex-col">
      <div className="mt-6 space-y-4">
        <div className="w-full space-y-3">
          {visiblePermissions.map((permission) => (
            <div
              key={permission.id}
              className="border border-t-4 border-gray-200 rounded-[4px] py-5 px-[17px] hover:border-primary transition-all flex justify-between items-center shadow-sm relative"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  {getPermissionIcon(permission.name)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {permission.name.replace(/_/g, " ")}
                  </span>
                  <span className="text-gray-700 text-sm">Permission</span>
                </div>
              </div>

              {/* Action Menu */}
              <ActionMenu
                icon={<MoreVertical className="text-gray-400" />}
                items={[
                  {
                    label: "Edit",
                    icon: <Edit2Icon className="w-4 h-4 text-blue-700" />,
                    onClick: () => handleAction(permission.uid, "Edit"),
                  },
                  {
                    label: "Delete",
                    icon: <Trash className="w-4 h-4 text-red-700" />,
                    onClick: () => handleAction(permission.uid, "Delete"),
                  },
                ]}
              />
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={onHandleLoadMore}
            className="border border-purple-500 mt-8 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-[4px] font-medium"
          >
            Load More Permissions
          </button>
        )}
      </div>
      <QuickStats
        title="Quick Stats"
        stats={[
          {
            icon: <Search className="w-5 h-5 text-primary" />,
            label: "Total Permissions",
            value: permissions.length,
          },
        ]}
      />
    </div>
  );
};

export default PermissionsMobileView;
