import RoleCard from "../RoleCard";
import EditRoleDialog from "./EditRoleDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Plus, Trash2 } from "lucide-react";
import type { Role } from "@/types";
import { useState } from "react";
import {
  useGetPermissions,
  useCreateRoleWithPermissions,
  useUpdateRoleWithPermissions,
  useDeleteRole,
} from "@/hooks/use-admin";

function RolesView({
  roles,
  className = "",
}: {
  roles: Role[];
  className?: string;
}) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    role?: Role;
  }>({
    open: false,
    mode: "create",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    role?: Role;
  }>({ open: false });

  const { data: permissionsData } = useGetPermissions();
  const createRoleMutation = useCreateRoleWithPermissions();
  const updateRoleMutation = useUpdateRoleWithPermissions();
  const deleteRoleMutation = useDeleteRole();

  const allPermissions = permissionsData?.permissions || [];

  const sortedRoles = [...roles].sort((a, b) => {
    const aHasAllAccess = a.permissions.some(
      (p) =>
        p.permission.name === "ALL_ACCESS" || p.permission.name === "ALL ACCESS"
    );
    const bHasAllAccess = b.permissions.some(
      (p) =>
        p.permission.name === "ALL_ACCESS" || p.permission.name === "ALL ACCESS"
    );

    if (aHasAllAccess && !bHasAllAccess) return -1;
    if (!aHasAllAccess && bHasAllAccess) return 1;
    return 0;
  });

  const handleCreateRole = () => {
    setDialogState({ open: true, mode: "create" });
  };

  const handleEditRole = (role: Role) => {
    setDialogState({ open: true, mode: "edit", role });
  };

  const handleDeleteRole = (role: Role) => {
    setDeleteDialog({ open: true, role });
  };

  const handleDialogSubmit = (data: {
    name: string;
    permissionIds: number[];
  }) => {
    if (dialogState.mode === "create") {
      createRoleMutation.mutate(data);
    } else if (dialogState.role) {
      updateRoleMutation.mutate({ uid: dialogState.role.uid, data });
    }
    setDialogState({ open: false, mode: "create" });
  };

  const handleDialogCancel = () => {
    setDialogState({ open: false, mode: "create" });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.role) {
      deleteRoleMutation.mutate(deleteDialog.role.uid);
      setDeleteDialog({ open: false });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false });
  };

  return (
    <div className={`rounded-[4px] bg-white ${className}`}>
      <div className="p-6 flex flex-col border-b rounded-t-lg  border-gray-200">
        <h2 className="text-xl font-semibold inter">Roles & Permission</h2>
        <p className="text-sm text-gray-500">
          Manage administrator roles and access levels
        </p>
      </div>
      <div className="p-6 flex flex-col gap-2">
        {sortedRoles.map((role) => (
          <RoleCard
            role={role}
            key={role.id}
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
          />
        ))}
        <button
          onClick={handleCreateRole}
          className="mt-2 w-full bg-gray-200 rounded-[4px] flex gap-2 items-center px-4 py-2 justify-center
             transition-all duration-150 ease-out
             hover:bg-gray-100 hover:scale-[1.02]
             active:scale-[0.98}"
        >
          <Plus className="w-5 h-5" />
          Create New Role
        </button>
      </div>

      <EditRoleDialog
        open={dialogState.open}
        mode={dialogState.mode}
        allPermissions={allPermissions}
        initialValues={dialogState.role}
        isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
        onCancel={handleDialogCancel}
        onSubmit={handleDialogSubmit}
      />

      <DeleteDialog
        open={deleteDialog.open}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${deleteDialog.role?.name}"? This action cannot be undone.`}
        icon={<Trash2 className="w-6 h-6" />}
        confirmLabel="Delete Role"
        isLoading={deleteRoleMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}

export default RolesView;
