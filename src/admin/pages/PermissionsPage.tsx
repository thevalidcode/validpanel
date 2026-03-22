import { useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Permission } from "@/types";
import PermissionsMobileView from "../components/permissions/PermissionsMobileView";
import PermissionsDesktopView from "../components/permissions/PermissionsDesktopView";
import EditPermissionDialog from "../components/permissions/EditPermissionDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Trash2 } from "lucide-react";
import {
  useGetPermissions,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from "@/hooks/use-admin";
import Layout from "../components/Layout";
import Loader from "@/components/Loader";

function PermissionsPage() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    permission?: Permission;
  }>({
    open: false,
    mode: "create",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    permission?: Permission;
  }>({ open: false });

  const { data: permissionsData, isLoading } = useGetPermissions();
  const createPermissionMutation = useCreatePermission();
  const updatePermissionMutation = useUpdatePermission();
  const deletePermissionMutation = useDeletePermission();

  const permissions = permissionsData?.permissions || [];

  const handleCreatePermission = () => {
    setDialogState({ open: true, mode: "create" });
  };

  const handleEditPermission = (permission: Permission) => {
    setDialogState({ open: true, mode: "edit", permission });
  };

  const handleDeletePermission = (permission: Permission) => {
    setDeleteDialog({ open: true, permission });
  };

  const handleAction = (uid: string, action: "Delete" | "Edit") => {
    const permission = permissions.find((p) => p.uid === uid);
    if (!permission) return;

    if (action === "Edit") {
      handleEditPermission(permission);
    } else if (action === "Delete") {
      handleDeletePermission(permission);
    }
  };

  const handleDialogSubmit = (data: { name: string }) => {
    if (dialogState.mode === "create") {
      createPermissionMutation.mutate(data.name);
    } else if (dialogState.permission) {
      updatePermissionMutation.mutate({
        uid: dialogState.permission.uid,
        data: { name: data.name },
      });
    }
    setDialogState({ open: false, mode: "create" });
  };

  const handleDialogCancel = () => {
    setDialogState({ open: false, mode: "create" });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.permission) {
      deletePermissionMutation.mutate(deleteDialog.permission.uid);
      setDeleteDialog({ open: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false });
  };

  if (isLoading) {
    return <Loader />;
  }

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout
      title="Permissions Management"
      description="Manage system permissions and access controls"
    >
      <div className="p-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-[4px] border border-gray-200 mb-4">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 outline-none rounded-[4px] focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              onClick={handleCreatePermission}
              className="bg-primary text-white px-4 py-2 rounded-[4px] hover:bg-primary/90 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Permission
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <PermissionsMobileView
            permissions={filteredPermissions}
            handleAction={handleAction}
          />
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <PermissionsDesktopView
            permissions={filteredPermissions}
            handleAction={handleAction}
          />
        </div>

        <EditPermissionDialog
          open={dialogState.open}
          mode={dialogState.mode}
          initialValues={dialogState.permission}
          isLoading={
            createPermissionMutation.isPending ||
            updatePermissionMutation.isPending
          }
          onCancel={handleDialogCancel}
          onSubmit={handleDialogSubmit}
        />

        <DeleteDialog
          open={deleteDialog.open}
          title="Delete Permission"
          description={`Are you sure you want to delete the permission "${deleteDialog.permission?.name}"? This action cannot be undone.`}
          icon={<Trash2 className="w-6 h-6" />}
          confirmLabel="Delete Permission"
          isLoading={deletePermissionMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </Layout>
  );
}

export default PermissionsPage;
