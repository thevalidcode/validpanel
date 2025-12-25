import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { Permission } from "@/types";
import { getPermissionIcon } from "./PermissionIcon";
import PermissionActionButtons from "./PermissionActionButtons";

interface PermissionsDesktopViewProps {
  permissions: Permission[];
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

export default function PermissionsDesktopView({
  permissions,
  handleAction,
}: PermissionsDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [permissionsPerPage, setPermissionsPerPage] = useState(20);

  const { data: paginatedPermissions } = paginate(
    permissions,
    currentPage,
    permissionsPerPage
  );

  return (
    <div>
      {/* Permissions Table */}
      <div className="flex flex-col gap-2">
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="p-3">Icon</th>
                <th className="p-3">Permission Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPermissions.map((permission) => (
                <tr
                  key={permission.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3">
                    <div className="p-2 bg-primary/10 rounded-full w-fit">
                      {getPermissionIcon(permission.name)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {permission.name.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Permission
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <PermissionActionButtons
                      handleAction={handleAction}
                      permission={permission}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={permissions.length}
          itemsPerPage={permissionsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPermissionsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}
