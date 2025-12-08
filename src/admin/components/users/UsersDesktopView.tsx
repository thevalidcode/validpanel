import { Ban, Check, Download, Search, Trash } from "lucide-react";
import { useState, type ChangeEvent } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  stores: number;
  status: "Active" | "Banned";
  avatar: string;
};

const initialUsers: User[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  stores: Math.floor(Math.random() * 5) + 1,
  status: Math.random() > 0.2 ? "Active" : "Banned",
  avatar: `https://i.pravatar.cc/40?img=${(i % 10) + 1}`,
}));

export default function UsersDesktopView() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [accountType, setAccountType] = useState("All Account Types");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    const currentPageUsers = paginatedUsers.map((u) => u.id);
    if (e.target.checked) {
      setSelectedUsers((prev) =>
        Array.from(new Set([...prev, ...currentPageUsers]))
      );
    } else {
      setSelectedUsers((prev) =>
        prev.filter((id) => !currentPageUsers.includes(id))
      );
    }
  };

  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleAction = (id: number, action: "Delete" | "Ban" | "Approve") => {
    if (action === "Delete") {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else if (action === "Ban") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "Banned" } : u))
      );
    } else if (action === "Approve") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "Active" } : u))
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full mx-auto ">
      <div className="py-5 px-6 w-full bg-vgrey-bg">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white h-[92px] px-5 ">
          <div className="w-[35%] relative items-center ">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 w-full h-full rounded-lg pr-3 pl-12 py-2 focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] " />
          </div>
          <select
            title="type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option>All Account Types</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Staff</option>
          </select>
          <select
            value={statusFilter}
            title="ststus"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Banned</option>
          </select>
          <div className="flex gap-2 items-center flex-1 justify-end">
            <button className="bg-white text-primary flex gap-2 border border-primary items-center w-[108px] hover:bg-primary/10 px-4 py-2 rounded-lg">
              <Download className="text-base " />
              <span className="inline-block">Export</span>
            </button>
            <button className="border bg-primary flex items-center  gap-2 text-white hover:bg-primary/90 px-4 py-2 rounded-lg">
              <img src="/images/filter.svg" alt="filter users" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center justify-between border border-gray-200 p-3 rounded-lg mb-3 text-sm">
          <div>
            <input
              type="checkbox"
              title="pagination"
              checked={
                paginatedUsers.every((u) => selectedUsers.includes(u.id)) &&
                paginatedUsers.length > 0
              }
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-gray-600">
              {selectedUsers.length} users selected
            </span>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button className="bg-red-100 text-red-700 border flex items-center gap-1 border-red-300 px-3 py-1 rounded">
              <Ban className=" w-3.5 h-3.5" />
              <span>Ban Selected</span>
            </button>
            <button className="bg-green-100 flex items-center gap-1 text-green-700 border border-green-300 px-3 py-1 rounded">
              <Check className="w-3.5 h-3.5" />
              <span>Approve Selected</span>
            </button>
            <button className="bg-red-50 text-red-600 border flex items-center gap-1 border-red-200 px-3 py-1 rounded">
              <Trash className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
        {/* User Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-3">
                  <input
                    type="checkbox"
                    title="select-all"
                    checked={
                      paginatedUsers.every((u) =>
                        selectedUsers.includes(u.id)
                      ) && paginatedUsers.length > 0
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
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      title="select"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => handleSelectUser(u.id)}
                    />
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {u.name}
                  </td>
                  <td className="p-3 text-gray-700">{u.email}</td>
                  <td className="p-3 text-gray-700">{u.stores}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className="text-purple-600 border border-purple-200 px-2 py-1 rounded hover:bg-purple-50">
                      View
                    </button>
                    {u.status === "Banned" ? (
                      <button
                        onClick={() => handleAction(u.id, "Approve")}
                        className="text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-50"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(u.id, "Ban")}
                        className="text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Ban
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(u.id, "Delete")}
                      className="text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <p>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                } rounded px-3 py-1`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
