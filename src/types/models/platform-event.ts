import type { Admin } from "./admin";
import type { User } from "./user";

export type PlatformEventCategory =
  | "USER"
  | "ADMIN"
  | "STORE"
  | "SYSTEM"
  | "PAYMENT"
  | "SUBSCRIPTION";

export type PlatformEvent = {
  id: number;
  userId: number | null;
  adminId: number | null;
  uid: string;
  event: string;
  category: PlatformEventCategory;
  entityUid: string | null;
  createdAt: Date;
  user: User | null;
  admin: Admin | null;
};
