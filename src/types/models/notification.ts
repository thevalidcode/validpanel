export type NotificationCategory =
  | "SYSTEM"
  | "PAYMENT"
  | "SUBSCRIPTION"
  | "STORE"
  | "USER";

export type NotificationType =
  | "SUBSCRIPTION_PAYMENT"
  | "SUBSCRIPTION_UPGRADE"
  | "SUBSCRIPTION_DOWNGRADE"
  | "SUBSCRIPTION_RENEWAL"
  | "SUBSCRIPTION_EXPIRED"
  | "STORE_APPROVED"
  | "STORE_REJECTED"
  | "STORE_CREATED"
  | "MANUAL_CREDIT"
  | "MANUAL_DEBIT";
  
export type Notification = {
  uid: string;
  message: string;
  title: string;
  id: number;
  userId: number | null;
  createdAt: Date;
  category: NotificationCategory;
  meta: {
    status: "success" | "failed";
    type: NotificationType;
    [key: string]: any;
  };
  isRead: boolean;
};
