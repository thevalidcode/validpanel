import { useEffect, useState } from "react";
import UsersMobileView from "../components/users/UsersMobileView";
import UsersDesktopView from "../components/users/UsersDesktopView";
import Layout from "@/admin/components/Layout";
import {
  useActivateMultipleUsers,
  useBanMultipleUsers,
  useDeleteMultipleUsers,
  useGetUsers,
  type UserWithStoreCount,
  useCreateUser,
} from "@/hooks/use-user";
import Loader from "@/components/Loader";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Ban, Check, Download, Plus, Search } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import NotFound from "@/components/NotFound";
import CreateUserDialog from "../components/users/CreateUserDialog";

const UsersPage = () => {
  const [users, setUsers] = useState<UserWithStoreCount[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string[] | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    uids: string[];
    type: "BAN" | "ACTIVATE";
  } | null>(null);

  const { data: fetchedUsers, isLoading } = useGetUsers();
  const { mutateAsync: createUser, isPending: isCreatePending } =
    useCreateUser();
  const { mutateAsync: deleteUsers, isPending: isDeletePending } =
    useDeleteMultipleUsers();
  const { mutateAsync: banUsers, isPending: isBanPending } =
    useBanMultipleUsers();
  const { mutateAsync: activateUsers, isPending: isActivatePending } =
    useActivateMultipleUsers();

  useEffect(() => {
    if (fetchedUsers) setUsers(fetchedUsers);
  }, [fetchedUsers]);

  if (isLoading) return <Loader />;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusOptions: Option<string>[] = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
  ];

  // Trigger dialogs
  const handleAction = (
    uids: string[],
    action: "Delete" | "Ban" | "Approve"
  ) => {
    if (action === "Delete") setDeleteTarget(uids);
    if (action === "Ban") setActionTarget({ uids, type: "BAN" });
    if (action === "Approve") setActionTarget({ uids, type: "ACTIVATE" });
  };

  // Confirm delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUsers({ uids: deleteTarget });
      setUsers((prev) => prev.filter((u) => !deleteTarget.includes(u.uid)));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm ban / activate
  const handleActionConfirm = async () => {
    if (!actionTarget) return;
    try {
      if (actionTarget.type === "BAN") {
        await banUsers({ uids: actionTarget.uids });
        setUsers((prev) =>
          prev.map((u) =>
            actionTarget.uids.includes(u.uid) ? { ...u, status: "BANNED" } : u
          )
        );
      } else if (actionTarget.type === "ACTIVATE") {
        await activateUsers({ uids: actionTarget.uids });
        setUsers((prev) =>
          prev.map((u) =>
            actionTarget.uids.includes(u.uid) ? { ...u, status: "ACTIVE" } : u
          )
        );
      }
      setActionTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle create user
  const handleCreateUser = async (data: {
    email: string;
    fullName: string;
    password: string;
    referralSource: string;
    additionalInfo?: string;
  }) => {
    try {
      const marketingData: Record<string, any> = {
        source: data.referralSource,
        timestamp: new Date().toISOString(),
        createdBy: "admin",
      };

      if (data.additionalInfo?.trim()) {
        marketingData.additionalInfo = data.additionalInfo.trim();
      }

      await createUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        referralSource: data.referralSource,
        marketingData,
      });

      setShowCreateDialog(false);
      // Refresh users list would happen automatically via react-query
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout
      title="Users Management"
      description="View and manage all created users."
    >
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white px-5 py-3">
          <div className="md:w-[35%] w-full relative items-center">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 outline-0 w-full h-full rounded-lg pr-3 pl-12 py-2 focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
          <CustomSelect
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === filter)}
            placeholder="Status"
            onChange={(selected) => {
              const option = selected as Option<string>;
              setFilter(option.value);
            }}
            className="flex-1"
          />
          <div className="flex gap-2 items-center flex-1 justify-end">
            <button
              onClick={() => setShowCreateDialog(true)}
              className="text-white flex gap-2 border bg-primary items-center w-fit hover:bg-primary/90 px-4 py-2 rounded-lg"
            >
              <Plus className="text-base" />
              <span className="hidden sm:inline-block">Create User</span>
            </button>
            <button className="bg-white text-primary flex gap-2 border border-primary items-center w-fit hover:bg-primary/10 px-4 py-2 rounded-lg">
              <Download className="text-base" />
              <span className="hidden sm:inline-block">Export</span>
            </button>
          </div>
        </div>

        {/* Mobile/ Desktop Views */}
        {filteredUsers.length !== 0 ? (
          <>
            <div className="md:hidden w-full space-y-5">
              <UsersMobileView
                users={filteredUsers}
                handleAction={handleAction}
              />
            </div>
            <div className="hidden md:block">
              <UsersDesktopView
                users={filteredUsers}
                handleAction={handleAction}
              />
            </div>
          </>
        ) : (
          <NotFound title="No users found." className="mt-5" />
        )}
      </div>

      {/* Confirm Ban / Activate */}
      <ConfirmDialog
        open={!!actionTarget}
        title={
          actionTarget?.type === "BAN" ? "Ban User(s)" : "Activate User(s)"
        }
        description={
          actionTarget?.type === "BAN"
            ? "This user will be banned and lose access."
            : "This user will be activated and regain access."
        }
        icon={
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              actionTarget?.type === "BAN"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {actionTarget?.type === "BAN" ? (
              <Ban className="w-6 h-6" />
            ) : (
              <Check className="w-6 h-6" />
            )}
          </div>
        }
        confirmLabel={actionTarget?.type === "BAN" ? "Ban" : "Activate"}
        isLoading={isBanPending || isActivatePending}
        onCancel={() => setActionTarget(null)}
        onConfirm={handleActionConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        title="Delete user(s)"
        description="This user and all its data will be permanently removed. This action cannot be undone."
        isLoading={isDeletePending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        open={showCreateDialog}
        isLoading={isCreatePending}
        onCancel={() => setShowCreateDialog(false)}
        onSubmit={handleCreateUser}
      />
    </Layout>
  );
};

export default UsersPage;
