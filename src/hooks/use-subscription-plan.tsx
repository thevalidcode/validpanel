"use client";
import { useAppContext } from "@/context/useAppContext";
import type {
  SubscriptionPlan,
  SubscriptionPlanFeatures,
  SubscriptionPlanStatus,
  PlanPrice,
  BillingInterval,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Custom hook for subscriptionPlan-related queries and mutations

export interface CreateSubscriptionPlanData {
  name: string;
  description?: string | null;
  status?: SubscriptionPlanStatus;
  gracePeriod?: number | null;
  features: SubscriptionPlanFeatures;
  // Prices are usually managed after creation or can be passed optionally if backend supports it
  prices?: Array<{
    interval: BillingInterval;
    price: string;
    tax?: number | null;
    amountInMinor: number;
    currency: string;
    externalId?: string | null;
    isActive?: boolean;
    isDefault?: boolean;
  }>;
}

export function useCreateSubscriptionPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSubscriptionPlan"],
    mutationFn: async (newSubscriptionPlan: CreateSubscriptionPlanData) => {
      const res = await api.post(`/subscription-plans`, newSubscriptionPlan);
      if (!res.data.success) {
        throw new Error(
          "Failed to create subscription-plan: No success object returned from server.",
        );
      }
      return res.data;
    },

    onSuccess: () => {
      toast.success("Subscription Plan created successfully");
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPlans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to create subscription-plan",
      );
      toast.error(errorMsg);
    },
  });
}

// get subscriptionPlans
export function useGetUserSubscriptionPlans() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const res = await api.get<SubscriptionPlan[]>(`/subscription-plans`);
      if (!res.data) throw new Error("Failed to fetch subscriptionPlans");
      return res.data;
    },
  });
}

// ! get subscriptionPlan by uid for authenticated users
export function useGetUserSubscriptionPlanByUid(uid: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["subscriptionPlans", uid],
    queryFn: async () => {
      const res = await api.get<SubscriptionPlan>(`/subscription-plans/${uid}`);
      if (!res.data) throw new Error("Failed to fetch subscriptionPlan");
      return res.data;
    },
    enabled: !!uid,
  });
}

// get all subscriptionPlans (admin route)
export function useGetAdminSubscriptionPlans() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminSubscriptionPlans"],
    queryFn: async () => {
      const res = await api.get<SubscriptionPlan[]>(
        `/subscription-plans/admin`,
      );
      if (!res.data) throw new Error("Failed to fetch subscription plans");
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}

// get subscriptionPlan by uid (admin route)
export function useGetAdminSubscriptionPlanByUid(uid: string) {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminSubscriptionPlans", uid],
    queryFn: async () => {
      const res = await api.get<SubscriptionPlan>(
        `/subscription-plans/admin/${uid}`,
      );
      if (!res.data) throw new Error("Failed to fetch subscription plan");
      return res.data;
    },
    enabled: !!uid && !!adminInfo?.uid,
  });
}

// update subscriptionPlan
export function useUpdateSubscriptionPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSubscriptionPlan"],
    mutationFn: async (data: {
      uid: string;
      updates: Partial<Omit<CreateSubscriptionPlanData, "prices">>;
    }) => {
      const res = await api.patch(
        `/subscription-plans/admin/${data.uid}`,
        data.updates,
      );
      if (!res.data.success) {
        throw new Error(
          "Failed to update subscription-plan: No success object returned from server.",
        );
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription Plan updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPlans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to update subscription-plan",
      );
      toast.error(errorMsg);
    },
  });
}

export function useDeleteSubscriptionPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSubscriptionPlan"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/subscription-plans/admin/${uid}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Subscription Plan deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPlans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(
        error,
        "Failed to delete subscription-plan",
      );
      toast.error(errorMsg);
    },
  });
}

// ============================================
// PLAN PRICE HOOKS
// ============================================

export function useGetAdminSubscriptionPlanPrices(planId: number) {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["adminSubscriptionPlanPrices", planId],
    queryFn: async () => {
      const res = await api.get<PlanPrice[]>(
        `/subscription-plans/admin/${planId}/prices`,
      );
      if (!res.data) throw new Error("Failed to fetch plan prices");
      return res.data;
    },
    enabled: !!adminInfo?.uid && !!planId,
  });
}

export interface CreatePlanPriceData {
  interval: BillingInterval;
  price: string;
  tax?: number | null;
  amountInMinor: number;
  currency: string;
  externalId?: string | null;
  isActive?: boolean;
  isDefault?: boolean;
}

export function useCreateSubscriptionPlanPrice() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createPlanPrice"],
    mutationFn: async ({
      planId,
      data,
    }: {
      planId: number;
      data: CreatePlanPriceData;
    }) => {
      const res = await api.post(
        `/subscription-plans/admin/${planId}/prices`,
        data,
      );
      return res.data;
    },
    onSuccess: (_, { planId }) => {
      toast.success("Plan Price created successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlanPrices", planId],
      });
      // Also invalidate plan queries as prices might be included
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to create plan price");
      toast.error(errorMsg);
    },
  });
}

export function useUpdateSubscriptionPlanPrice() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updatePlanPrice"],
    mutationFn: async ({
      planId,
      priceId,
      data,
    }: {
      planId: number;
      priceId: number;
      data: Partial<CreatePlanPriceData>;
    }) => {
      const res = await api.patch(
        `/subscription-plans/admin/${planId}/prices/${priceId}`,
        data,
      );
      return res.data;
    },
    onSuccess: (_, { planId }) => {
      toast.success("Plan Price updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlanPrices", planId],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update plan price");
      toast.error(errorMsg);
    },
  });
}

export function useDeleteSubscriptionPlanPrice() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deletePlanPrice"],
    mutationFn: async ({
      planId,
      priceId,
    }: {
      planId: number;
      priceId: number;
    }) => {
      const res = await api.delete(
        `/subscription-plans/admin/${planId}/prices/${priceId}`,
      );
      return res.data;
    },
    onSuccess: (_, { planId }) => {
      toast.success("Plan Price deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlanPrices", planId],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriptionPlans"],
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete plan price");
      toast.error(errorMsg);
    },
  });
}
