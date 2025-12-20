"use client";
import { useAppContext } from "@/context/useAppContext";
import type { PaymentGateway, PaymentMethod } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
// Custom hook for paymentGateway-related queries and mutations

export interface NewPaymentGateway {
  platform: PaymentMethod;
  name: string;
  image: string;
  min: string;
  max: string;
  secretKey?: string;
  description?: string;
}

export function useCreatePaymentGateway() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createPaymentGateway"],
    mutationFn: async (newPaymentGateway: NewPaymentGateway) => {
      const res = await api.post(`/payment-gateways`, newPaymentGateway);
      if (!res.data.success) {
        throw new Error(
          "Failed to create payment-gateway: No success object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("Payment Gateway created successfully");
      queryClient.invalidateQueries({
        queryKey: ["paymentGateways"],
      });
    },
    onError: (error: unknown) => {
      // Enhanced error extraction to handle various backend formats
      let errorMsg = "An unexpected error occurred";
      if (error instanceof AxiosError) {
        // Try to extract error from common backend formats
        const data = error.response?.data;
        if (typeof data === "string") {
          errorMsg = data;
        } else if (data?.error) {
          errorMsg = data.error;
        } else if (data?.message) {
          errorMsg = data.message;
        } else {
          errorMsg = "Failed to create paymentGateway";
        }
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    },
  });
}

// get paymentGateways
export function useGetUserPaymentGateways() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["paymentGateways"],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(`/payment-gateways`);
      if (!res.data) throw new Error("Failed to fetch payment-gateways");
      return res.data;
    },
  });
}

// ! get paymentGateway by uid for authenticated users
export function useGetUserPaymentGatewayByUid(uid: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["paymentGateways", uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(`/payment-gateways/${uid}`);
      if (!res.data) throw new Error("Failed to fetch payment-gateway");
      return res.data;
    },
    enabled: !!uid,
  });
}
