export type AdminStatus = "ACTIVE" | "INACTIVE" | "BANNED";

export type Admin = {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  image: string | null;
  apiKey: string;
  status: AdminStatus;
  timestamp: string;
  lastSeen: string;
  roleId: number;
};
