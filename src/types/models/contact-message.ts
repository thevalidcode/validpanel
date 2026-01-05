export type ContactMessageStatus = "PENDING" | "REPLIED" | "RESOLVED";

export interface ContactMessage {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactStatusPayload {
  status: ContactMessageStatus;
}
