import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { Admin } from "@/types";
import RoleBadge from "@/components/ui/RoleBadge";
import ActionButtons from "./ActionButtons";
import type { Role } from "@/types";
import { Users2Icon } from "lucide-react";
import RolesView from "./RolesView";
import AdminsActivity from "./AdminsActivity";

interface AdminDesktopViewProps {
  admins: Admin[];
  roles: Role[];
  handleAction: (
    uid: string,
    action: "Delete" | "Ban" | "Approve" | "Edit"
  ) => void;
}

export default function AdminDesktopView({
  admins,
  roles,
  handleAction,
}: AdminDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [adminPerPage, setUAdminsPerPage] = useState(20);

  const { data: paginatedAdmins } = paginate(admins, currentPage, adminPerPage);

  return (
    <div>
      {/* Admin Table */}
      <div className="flex flex-wrap gap-4">
        {/* Left Container */}{" "}
        <div className="flex-2 flex flex-col gap-2">
          <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.image || "/Sarah.png"}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{u.fullName}</span>{" "}
                          <span className="text-gray-700">{u.email}</span>{" "}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <RoleBadge roles={[u.role]} />
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {new Date(u.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <ActionButtons handleAction={handleAction} admin={u} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={admins.length}
            itemsPerPage={adminPerPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setUAdminsPerPage(size);
              setCurrentPage(1);
            }}
          />

          <AdminsActivity />
        </div>{" "}
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <RolesView roles={roles} />
            <div className="rounded-lg bg-white">
              <div className="p-6 flex flex-col border-b rounded-t-lg  border-gray-200">
                <h2 className="text-xl font-semibold inter">Quick Stats</h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center justify-center">
                    <div className="p-2 bg-purple-200 rounded-full flex items-center justify-center">
                      <Users2Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-gray-700">Total Admins</span>
                  </div>
                  <span>{admins.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
    </div>
  );
}
