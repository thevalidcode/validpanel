"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Payment } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Custom hook for payment-related queries and mutations

// get payments for authenticated users
export function useGetUserPayments() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await api.get<Payment[]>(`/payments`);
      if (!res.data) throw new Error("Failed to fetch payments");
      return res.data;
    },
  });
}

// ! get payments for authenticated admins
export function useGetPaymentsForAdmins() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["paymentsForAdmin"],
    queryFn: async () => {
      const res = await api.get<Payment>(`/payments/admin`);
      if (!res.data) throw new Error("Failed to fetch payments");
      return res.data;
    },
  });
}
