export type Permission = {
  id: number;
  uid: string;
  name: string;
};

export type RolePermission = {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
};
