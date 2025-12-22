"use client";
import { useAppContext } from "@/context/useAppContext";
import type { SubscriptionPlanInterval } from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Custom hook for admin-related queries and mutations

interface NewAdmin {
  email: string;
  password: string;
  fullName: string;
  ref?: number;
}

export function useCreateAdmin() {
  const { api, handleSetAdminInfo } = useAppContext();
  return useMutation({
    mutationKey: ["createAdmin"],
    mutationFn: async (newAdmin: NewAdmin) => {
      // Prepare payload with correct types and explicit interface for type safety
      const payload = {
        email: newAdmin.email,
        password: newAdmin.password,
        fullName: newAdmin.fullName,
      };

      const res = await api.post(`/admins`, payload);

      if (!res.data.admin) {
        throw new Error(
          "Failed to create admin: No admin object returned from server."
        );
      }
      return res.data;
    },

    onSuccess: (data) => {
      toast.success("Admin created successfully");
      handleSetAdminInfo({
        ...data.admin,
      });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during admin creation."
      );
      toast.error(errorMsg);
    },
  });
}

interface LoginProps {
  email: string;
  password: string;
}
export function useAdminLogin() {
  const { api, handleSetAdminInfo } = useAppContext();
  const router = useNavigate();
  return useMutation({
    mutationKey: ["adminLogins"],
    mutationFn: async (data: LoginProps) => {
      const res = await api.post(`/admins/me`, {
        email: data.email,
        password: data.password,
      });

      if (!res.data) {
        throw new Error(
          "Failed to login admin: No response data received from server."
        );
      }
      return res.data;
    },
    onSuccess: async (data) => {
      handleSetAdminInfo({
        ...data.admin,
      });
      router("/admin/overview");
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during admin login."
      );
      toast.error(errorMsg);
    },
  });
}

export interface OverviewStatItem {
  title: string;
  value: string;
  change: string;
  up: boolean;
}

export interface RevenueChart {
  labels: string[];
  data: number[];
}

export interface MetricChange {
  value: string;
  up: boolean;
}

export interface MetricValue {
  value: string;
}

export interface SubscriptionHealth {
  mrrGrowth: MetricChange;
  churnRate: MetricValue;
  arpu: MetricValue;
  netRevenueRetention: MetricValue;
}

export interface ActivityItem {
  name: string;
  img: string;
  message: string;
  time: string; // ISO string
}

export interface TopSubscription {
  planName: string;
  billingCycle: SubscriptionPlanInterval;
  subscribers: number;
  revenue: string;
  isTrending?: boolean;
}

export interface OverviewResponse {
  stats: OverviewStatItem[];
  revenueChart: RevenueChart;
  subscriptionHealth: SubscriptionHealth;
  recentActivities: ActivityItem[];
  topSubscriptions: TopSubscription[];
}

export function useGetOverview() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["overview-data"],
    queryFn: async () => {
      const res = await api.get<OverviewResponse>(`/admins/overview`);
      if (!res.data) throw new Error("Failed to fetch overview");
      return res.data;
    },
    enabled: !!userInfo,
  });
}

interface ForgetPasswordProps {
  email: string;
}

export function useForgotPassword() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: ForgetPasswordProps) => {
      const res = await api.post(`/admins/forgot-password`, data);
      if (!res.data) throw new Error("Failed to send email");
      return res.data;
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data?.error || "Failed to send email");
      } else {
        console.error("Failed send email");
      }
    },
  });
}

interface ResetPasswordProps {
  token: string;
  password: string;
}

export function useResetPassword() {
  const { api } = useAppContext();
  return useMutation({
    mutationFn: async (data: ResetPasswordProps) => {
      const res = await api.post(`/admins/reset-password`, data);
      if (!res.data) throw new Error("Failed to reset password");
      return res.data;
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        console.error(
          error.response?.data?.error || "Failed to reset password"
        );
      } else {
        console.error("Failed to reset password");
      }
    },
  });
}
