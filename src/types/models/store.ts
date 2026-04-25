import type { User } from "./user";

export type StoreStatus =
  | "ACTIVE"
  | "PENDING"
  | "CANCELED"
  | "DISABLED"
  | "EXPIRED";

export type StoreType = "SOCIAL" | "SHOP" | "DIGITAL";

export type Store = {
  name: string;
  storeId: number;
  uid: string;
  description: string | null;
  ssl: boolean;
  plan: string;
  type: StoreType;
  status: StoreStatus;
  timestamp: Date;
  ownerId: number;
  logoUrl: string;
  color: string;
  resellingEnabled: boolean;
};

export type StoreWithOwner = Store & {
  owner: User;
};
