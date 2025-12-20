"use client";
import { useAppContext } from "@/context/useAppContext";
import type {
  PaymentMethod,
  Subscription,
  SubscriptionPlanInterval,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Custom hook for subscription-related queries and mutations

// get subscriptions
export function useGetUserSubscriptions() {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["subscriptions", userInfo?.uid],
    queryFn: async () => {
      const res = await api.get<Subscription[]>(`/subscriptions`);
      if (!res.data) throw new Error("Failed to fetch subscriptions");
      return res.data;
    },
    enabled: !!userInfo,
  });
}

// ! get subscription by uid for authenticated users
export function useGetUserSubscriptionByUid(uid: string) {
  const { api, userInfo } = useAppContext();
  return useQuery({
    queryKey: ["subscriptions", userInfo?.uid, uid],
    queryFn: async () => {
      const res = await api.get<Subscription>(`/subscriptions/${uid}`);
      if (!res.data) throw new Error("Failed to fetch subscription");
      return res.data;
    },
    enabled: !!userInfo && !!uid,
  });
}

// get active subscription for authenticated user
export function useGetUserActiveSubscription() {
  const { api, userInfo } = useAppContext();
  const uid = userInfo?.uid;

  return useQuery({
    queryKey: ["active-subscription"],
    queryFn: async () => {
      const res = await api.get<Subscription>("/subscriptions/active");
      return res.data;
    },
    enabled: Boolean(uid),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

interface NewSubscription {
  planId: number;
  platform: PaymentMethod;
  redirectUrl: string;
  billingCycle: SubscriptionPlanInterval;
  currency: string;
}

export function useCreateSubscription() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSubscription"],
    mutationFn: async (newSubscription: NewSubscription) => {
      const res = await api.post<{
        status: string;
        url?: string;
        message?: string;
      }>(`/subscriptions`, newSubscription);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({
        queryKey: ["active-subscription"],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create subscription"
      );
      toast.error(errorMsg);
    },
  });
}

interface RenewSubscription {
  planId: number;
  platform: PaymentMethod;
  redirectUrl: string;
  currency: string;
}

export function useRenewSubscription() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["renewSubscription"],
    mutationFn: async (renewSubscription: RenewSubscription) => {
      const res = await api.post<{
        status: string;
        url?: string;
        message?: string;
      }>(`/subscriptions/renew`, renewSubscription);

      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription renewed successfully");
      queryClient.invalidateQueries({
        queryKey: ["active-subscription"],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to renew subscription");
      toast.error(errorMsg);
    },
  });
}

interface UpgradeUserPlanProps {
  planId: number;
  platform: PaymentMethod;
  redirectUrl: string;
  billingCycle: SubscriptionPlanInterval;
  currency: string;
}

export function useUpgradeUserPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["upgrade-plan"],
    mutationFn: async (data: UpgradeUserPlanProps) => {
      const res = await api.patch<{
        status: string;
        url?: string;
        message?: string;
      }>("/subscriptions/upgrade-plan", data);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Plan upgraded successfully");
      queryClient.invalidateQueries({
        queryKey: ["active-subscription"],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to upgrade plan");
      toast.error(errorMsg);
    },
  });
}

interface DowngradeUserPlanProps {
  planId: number;
}

export function useDowngradeUserPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["downgrade-plan"],
    mutationFn: async (data: DowngradeUserPlanProps) => {
      const res = await api.patch<{ success: string }>(
        "/subscriptions/downgrade-plan",
        data
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.success);
      queryClient.invalidateQueries({
        queryKey: ["active-subscription"],
      });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to downgrade plan");
      toast.error(errorMsg);
    },
  });
}
