import { useState } from "react";
import type { UserWithStoreCount } from "@/hooks/use-user";
import { Pagination } from "@/components/ui/Pagination";
import CustomCheckbox from "@/components/ui/CustomCheckbox";
import { Ban, Check, Trash } from "lucide-react";
import { paginate } from "@/utils/paginate";

interface UsersDesktopViewProps {
  users: UserWithStoreCount[];
  handleAction: (
    userUids: string[],
    action: "Delete" | "Ban" | "Approve"
  ) => void;
}

export default function UsersDesktopView({
  users,
  handleAction,
}: UsersDesktopViewProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(20);

  const { data: paginatedUsers } = paginate(users, currentPage, usersPerPage);

  const handleSelectAll = (checked: boolean) => {
    const currentPageUsers = paginatedUsers.map((u) => u.uid);
    if (checked) {
      setSelectedUsers((prev) =>
        Array.from(new Set([...prev, ...currentPageUsers]))
      );
    } else {
      setSelectedUsers((prev) =>
        prev.filter((id) => !currentPageUsers.includes(id))
      );
    }
  };

  const handleSelectUser = (uid: string) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter((uid) => uid !== uid) : [...prev, uid]
    );
  };

  return (
    <div>
      {/* Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between border border-gray-200 p-3 rounded-lg my-3 text-sm">
        <CustomCheckbox
          checked={
            paginatedUsers.every((u) => selectedUsers.includes(u.uid)) &&
            paginatedUsers.length > 0
          }
          onChange={handleSelectAll}
          label={`${selectedUsers.length} users selected`}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => handleAction(selectedUsers, "Ban")}
            className="bg-red-100 text-red-700 border flex items-center gap-1 border-red-300 px-3 py-1 rounded"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Ban Selected</span>
          </button>
          <button
            onClick={() => handleAction(selectedUsers, "Approve")}
            className="bg-green-100 flex items-center gap-1 text-green-700 border border-green-300 px-3 py-1 rounded"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve Selected</span>
          </button>
          <button
            onClick={() => handleAction(selectedUsers, "Delete")}
            className="bg-red-50 text-red-600 border flex items-center gap-1 border-red-200 px-3 py-1 rounded"
          >
            <Trash className="w-3.5 h-3.5" />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="p-3">
                <CustomCheckbox
                  checked={
                    paginatedUsers.length > 0 &&
                    paginatedUsers.every((u) => selectedUsers.includes(u.uid))
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3">User Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Number of Stores</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">
                  <CustomCheckbox
                    checked={selectedUsers.includes(u.uid)}
                    onChange={() => handleSelectUser(u.uid)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center  gap-2">
                    <img
                      src={u.image || "/Sarah.png"}
                      alt={u.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    {u.fullName}
                  </div>
                </td>
                <td className="p-3 text-gray-700">{u.email}</td>
                <td className="p-3 text-gray-700">{u.storesCount}</td>
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
                <td className="p-3">
                  <div className="flex gap-2">
                    {u.status === "BANNED" ? (
                      <button
                        onClick={() => handleAction([u.uid], "Approve")}
                        className="text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction([u.uid], "Ban")}
                        className="text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => handleAction([u.uid], "Delete")}
                      className="text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={users.length}
        itemsPerPage={usersPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setUsersPerPage(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
