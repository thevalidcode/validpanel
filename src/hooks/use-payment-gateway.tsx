"use client";
import { useAppContext } from "@/context/useAppContext";
import type { PaymentGateway, PaymentMethod } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  content: string | null;
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
      const errorMsg = normalizeApiError(
        error,
        "Failed to create payment-gateway"
      );
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

// get admin paymentGateways
export function useGetAdminPaymentGateways() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminPaymentGateways"],
    queryFn: async () => {
      const res = await api.get<PaymentGateway[]>(`/payment-gateways/admin`);
      if (!res.data) throw new Error("Failed to fetch payment-gateways");
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}

// get admin paymentGateway by uid
export function useGetAdminPaymentGatewayByUid(uid: string) {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminPaymentGateways", uid],
    queryFn: async () => {
      const res = await api.get<PaymentGateway>(
        `/payment-gateways/admin/${uid}`
      );
      if (!res.data) throw new Error("Failed to fetch payment-gateway");
      return res.data;
    },
    enabled: !!uid && !!adminInfo?.uid,
  });
}

export interface UpdatePaymentGateway {
  uid: string;
  platform: PaymentMethod;
  name: string;
  image: string;
  min: string;
  max: string;
  secretKey?: string;
  description?: string;
  content?: string | null;
}

export function useUpdatePaymentGateway() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatePaymentGateway"],
    mutationFn: async (updateData: UpdatePaymentGateway) => {
      const res = await api.patch<{ success: string; signature: string }>(
        `/payment-gateways`,
        updateData
      );
      if (!res.data.success) {
        throw new Error(
          "Failed to update payment-gateway: No success response from server."
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("Payment Gateway updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminPaymentGateways"],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentGateways"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update payment-gateway"
      );
      toast.error(errorMsg);
    },
  });
}

export function useDeletePaymentGateway() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deletePaymentGateway"],
    mutationFn: async (uid: string) => {
      const res = await api.delete<{ success: string }>(`/payment-gateways`, {
        data: { uid },
      });
      if (!res.data.success) {
        throw new Error(
          "Failed to delete payment-gateway: No success response from server."
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("Payment Gateway deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminPaymentGateways"],
      });
      queryClient.invalidateQueries({
        queryKey: ["paymentGateways"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete payment-gateway"
      );
      toast.error(errorMsg);
    },
  });
}
