import type { StoreType } from "./store";

export interface ResellerStore {
  uid: string;
  name: string;
  url: string;
  image?: string | null;
  type: StoreType;
  isActive: boolean;
  isInternal: boolean;
  storeId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResellerStoreListResponse {
  resellerStores: ResellerStore[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}
