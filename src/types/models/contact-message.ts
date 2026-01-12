export type ContactMessageStatus = "PENDING" | "REPLIED" | "RESOLVED" | "CLOSED";
export type ContactReplySender = "USER" | "ADMIN";

export interface ContactReply {
  id: number;
  uid: string;
  contactMessageId: number;
  sender: ContactReplySender;
  senderName: string | null;
  senderEmail: string | null;
  content: string;
  htmlContent: string | null;
  emailMessageId: string | null;
  inReplyTo: string | null;
  references: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  emailMessageId: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    replies: number;
  };
  replies?: ContactReply[];
}

export interface UpdateContactStatusPayload {
  status: ContactMessageStatus;
}

export interface SendContactReplyPayload {
  message: string;
}
