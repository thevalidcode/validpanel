import type { StoreType } from "./store";

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "FAILED";

export interface NormalizedOrder {
  id: string; // unique across all stores
  storeType: StoreType;
  customer: {
    email: string;
    name: string;
    image?: string;
  };
  amount: string;
  status: OrderStatus;
  createdAt: string; // ISO string
  currency: string;
}
