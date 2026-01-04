"use client";
import { useAppContext } from "@/context/useAppContext";
import type { Transaction } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Get transactions for authenticated user
export function useGetUserTransactions() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["userTransactions"],
    queryFn: async () => {
      const res = await api.get<Transaction[]>(`/transactions`);
      if (!res.data) throw new Error("Failed to fetch transactions");
      return res.data;
    },
    enabled: !!userInfo?.uid,
  });
}

// Get all transactions for admin
export function useGetAdminTransactions() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminTransactions"],
    queryFn: async () => {
      const res = await api.get<Transaction[]>(`/transactions/admin`);
      if (!res.data) throw new Error("Failed to fetch transactions");
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}
