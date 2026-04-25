export interface UploadLog {
  url: string;
  id: number;
  filename: string;
  mimetype: string;
  collection: string;
  timestamp: Date;
  uid: string;
  size: number;
}

export type CollectionName =
  | "general"
  | "default"
  | "admins"
  | "users"
  | "store"
  | "payment-gateways"
  | "knowledge-base";
