import type { StoreType } from "@/types/models/store";

export type ResellerMarginType = "percentage" | "fixed";
export type ResellerDomainMode = "validpanel" | "custom";
export type ResellerSourceType = StoreType;

export interface ResellableSource {
  id: string;
  name: string;
  type: StoreType;
  image: string;
  description?: string | null;
  itemCount: number;
}

export interface ResellerSourceProduct {
  productId: string;
  name: string;
  description: string | null;
  slug: string;
  imageUrl: string | null;
  galleryUrls: string[];
  price: string | number;
  currency: string;
  min: number;
  max: number;
  status: string;
  stock: number;
  tags: string[];
  brand: string | null;
}

export interface ResellerSourcesResponse {
  sources: ResellableSource[];
  meta: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ResellerSourceProductsResponse {
  sourceSupplier: {
    shopId: number;
    uid: string;
    name: string;
  };
  products: ResellerSourceProduct[];
}

export interface ResellerSourceService {
  uid: string;
  name: string;
  description: string | null;
  category: string;
  type: string;
  min: number;
  max: number;
  icon: string | null;
  price: string | number;
  currency: string | null;
  status: string;
}

export interface ResellerSourceServicesResponse {
  provider: {
    providerId: string;
    sourceUid: string;
    name: string;
    url: string;
  };
  services: ResellerSourceService[];
}

export interface StartResellingPayload {
  supplierId?: string;
  providerId?: string;
  sourceType: StoreType;
  marginType: ResellerMarginType;
  marginValue: number;
  targetStoreUid: string;
}
