import type { CurrencyCode } from "@/lib/currencyConverter";
import type { User } from "./user";

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";
export type TransactionType =
  | "SUBSCRIPTION_PAYMENT"
  | "SUBSCRIPTION_RENEWAL"
  | "SUBSCRIPTION_UPGRADE"
  | "SUBSCRIPTION_DOWNGRADE"
  | "MANUAL_CREDIT"
  | "MANUAL_DEBIT";

export type Transaction = {
  id: number;
  uid: string;
  userUid: string;
  amount: string;
  currency: CurrencyCode;
  status: TransactionStatus;
  type: TransactionType;
  user: User;
  timestamp: Date;
};
