import type { RolePermission } from "./permission";

export interface Role {
  id: number;
  uid: string;
  name: string;
  permissions: RolePermission[];
}