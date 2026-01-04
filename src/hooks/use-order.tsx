"use client";
import { useAppContext } from "@/context/useAppContext";
import type { NormalizedOrder } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface GetMyOrdersParams {
  storeId: string;
  page?: number;
  limit?: number;
}

interface GetAllOrdersParams {
  page?: number;
  limit?: number;
}

interface OrdersResponse {
  orders: NormalizedOrder[];
}

// Get current user's orders with pagination
export function useGetMyOrders({
  storeId,
  page = 1,
  limit = 10,
}: GetMyOrdersParams) {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["myOrders", storeId, page, limit],
    queryFn: async () => {
      const res = await api.get<OrdersResponse>(
        `/orders/me?storeId=${storeId}&page=${page}&limit=${limit}`
      );
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!storeId && !!userInfo?.uid,
  });
}

// Get all orders for admin with pagination
export function useGetAllOrders({
  page = 1,
  limit = 10,
}: GetAllOrdersParams = {}) {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminOrders", page, limit],
    queryFn: async () => {
      const res = await api.get<OrdersResponse>(
        `/orders?page=${page}&limit=${limit}`
      );
      if (!res.data) throw new Error("Failed to fetch orders");
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}
