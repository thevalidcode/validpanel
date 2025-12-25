import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/admin/components/Layout";
import {
  useUpdateAdmin,
  useDeleteAdmin,
  useCreateAdmin,
  useGetAdmins,
  useGetRoles,
} from "@/hooks/use-admin";

import Loader from "@/components/Loader";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import { Plus, Search } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import NotFound from "@/components/NotFound";

import AdminsMobileView from "../components/admins/AdminsMobileView";
import AdminDesktopView from "../components/admins/AdminsDesktopView";
import EditAdminDialog, {
  type DialogMode,
} from "../components/admins/EditAdminDialog";

import type { Admin, AdminStatus } from "@/types";

const AdminManagement = () => {
  const [, setSearchParams] = useSearchParams();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");

  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [editTarget, setEditTarget] = useState<Admin | undefined>();
  const [filter, setFilter] = useState<AdminStatus | "ALL">("ALL");
  const [roleFilter, setRoleFilter] = useState<number>(0);

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    uid: string;
    type: "BAN" | "ACTIVATE";
  } | null>(null);

  // Fetch admins and roles
  const { data: fetchedAdmins, isLoading: isAdminsLoading } = useGetAdmins();
  const { data: fetchedRoles, isLoading: isRolesLoading } = useGetRoles();

  const { mutateAsync: deleteAdmin, isPending: isDeletePending } =
    useDeleteAdmin();
  const { mutateAsync: createAdmin, isPending: isCreatePending } =
    useCreateAdmin();
  const { mutateAsync: updateAdmin, isPending: isUpdatePending } =
    useUpdateAdmin();

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const fullName = admin.fullName ?? "";
      const email = admin.email ?? "";

      const matchesSearch =
        fullName.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filter === "ALL" || admin.status === filter;
      const matchesRole = roleFilter === 0 || admin.roleId === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [admins, search, filter, roleFilter]);

  // Update local state when admins fetch completes
  useEffect(() => {
    if (fetchedAdmins) setAdmins(fetchedAdmins);
  }, [fetchedAdmins]);

  if (isAdminsLoading || isRolesLoading) return <Loader />;

  // Filtering logic

  const statusOptions: Option<AdminStatus | "ALL">[] = [
    { label: "All Status", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Banned", value: "BANNED" },
  ];

  const rolesOptions: Option<number>[] = [
    { label: "All Roles", value: 0 },
    ...(fetchedRoles?.roles.map((role) => ({
      label: role.name,
      value: role.id,
    })) || []),
  ];

  // Switch to admins tab
  const switchToAdminsTab = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("tab", "admins");
      return params;
    });
  };

  // Dialog actions
  const handleAction = (
    uid: string,
    action: "Delete" | "Ban" | "Approve" | "Edit"
  ) => {
    switch (action) {
      case "Delete":
        setDeleteTarget(uid);
        break;
      case "Ban":
        setActionTarget({ uid, type: "BAN" });
        break;
      case "Approve":
        setActionTarget({ uid, type: "ACTIVATE" });
        break;
      case "Edit":
        setEditTarget(admins.find((admin) => admin.uid === uid));
        setDialogMode("edit");
        break;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteAdmin(deleteTarget);
      setAdmins((prev) => prev.filter((a) => a.uid !== deleteTarget));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleActionConfirm = async () => {
    if (!actionTarget) return;

    try {
      const newStatus = actionTarget.type === "BAN" ? "BANNED" : "ACTIVE";
      await updateAdmin({ uid: actionTarget.uid, data: { status: newStatus } });

      setAdmins((prev) =>
        prev.map((a) =>
          a.uid === actionTarget.uid ? { ...a, status: newStatus } : a
        )
      );

      setActionTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDialogSubmit = async (data: any) => {
    try {
      if (dialogMode === "create") {
        await createAdmin(data);
      } else if (dialogMode === "edit" && editTarget) {
        await updateAdmin({ uid: editTarget.uid, data });
      }
    } finally {
      setDialogMode(null);
      setEditTarget(undefined);
    }
  };

  return (
    <Layout
      title="Admin Management"
      description="Manage administrator accounts, roles, and permissions."
    >
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white px-5 py-3">
          <div className="md:w-[75%] w-full flex flex-wrap md:flex-nowrap gap-2 items-center">
            <div className="relative w-full md:w-[60%]">
              <input
                type="text"
                placeholder="Search admins..."
                value={search}
                onChange={(e) => {
                  switchToAdminsTab();
                  setSearch(e.target.value);
                }}
                className="flex-1 border border-gray-200 outline-0 w-full h-full rounded-lg pr-3 pl-12 py-2 focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            </div>

            <CustomSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === filter)}
              placeholder="Status"
              onChange={(selected) => {
                switchToAdminsTab();
                setFilter((selected as Option<AdminStatus | "ALL">).value);
              }}
              className="flex-1"
            />

            <CustomSelect
              options={rolesOptions}
              value={rolesOptions.find((opt) => opt.value === roleFilter)}
              placeholder="Role"
              onChange={(selected) => {
                switchToAdminsTab();
                setRoleFilter((selected as Option<number>).value);
              }}
              className="flex-1"
            />
          </div>

          <div className="flex gap-2 items-center flex-1 justify-end">
            <button
              onClick={() => setDialogMode("create")}
              className="text-white flex gap-2 border bg-primary items-center w-fit hover:bg-primary/90 px-4 py-2 rounded-lg"
            >
              <Plus className="text-base" />
              <span>Create Admin</span>
            </button>
          </div>
        </div>

        {/* Admins List */}
        {filteredAdmins.length ? (
          <div className="mt-5">
            <div className="md:hidden w-full space-y-5">
              <AdminsMobileView
                admins={filteredAdmins}
                roles={fetchedRoles?.roles || []}
                handleAction={handleAction}
              />
            </div>
            <div className="hidden md:block">
              <AdminDesktopView
                admins={filteredAdmins}
                roles={fetchedRoles?.roles || []}
                handleAction={handleAction}
              />
            </div>
          </div>
        ) : (
          <NotFound title="No admin found." className="mt-5" />
        )}
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={!!actionTarget}
        title={actionTarget?.type === "BAN" ? "Ban Admin" : "Activate Admin"}
        description={
          actionTarget?.type === "BAN"
            ? "This admin will be banned and lose access."
            : "This admin will be activated and regain access."
        }
        confirmLabel={actionTarget?.type === "BAN" ? "Ban" : "Activate"}
        isLoading={isUpdatePending}
        onCancel={() => setActionTarget(null)}
        onConfirm={handleActionConfirm}
      />

      <DeleteDialog
        open={!!deleteTarget}
        title="Delete admin"
        description="This admin and all related data will be permanently deleted."
        isLoading={isDeletePending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <EditAdminDialog
        open={!!dialogMode}
        mode={dialogMode}
        initialValues={editTarget}
        roles={fetchedRoles?.roles || []}
        isLoading={isCreatePending || isUpdatePending}
        onSubmit={handleDialogSubmit}
        onCancel={() => {
          setDialogMode(null);
          setEditTarget(undefined);
        }}
      />
    </Layout>
  );
};

export default AdminManagement;
