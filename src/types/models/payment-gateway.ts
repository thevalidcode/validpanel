export type PaymentMethod = "MANUAL" | "FLUTTERWAVE" | "PAYSTACK";
export type PaymentGatewayStatus = "ACTIVE" | "DISABLED";

export type PaymentGateway = {
  name: string;
  id: number;
  uid: string;
  platform: PaymentMethod;
  description: string | null;
  signature: string | null;
  encryptedSecretKey: string | null;
  iv: string | null;
  image: string;
  status: PaymentGatewayStatus;
  createdAt: Date;
  position: number;
  min: string;
  content: string | null;
  max: string;
};
