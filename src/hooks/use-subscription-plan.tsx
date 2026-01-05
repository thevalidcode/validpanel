"use client";
import { useAppContext } from "@/context/useAppContext";
import type {
  SubscriptionPlan,
  SubscriptionPlanFeatures,
  SubscriptionPlanInterval,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Custom hook for subscriptionPlan-related queries and mutations

export interface NewSubscriptionPlan {
  name: string;
  price: string;
  currency: string;
  description: string | null;
  features: SubscriptionPlanFeatures;
  interval: SubscriptionPlanInterval;
  discountForAnnually: number | null;
  tax: number | null;
}

export function useCreateSubscriptionPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createSubscriptionPlan"],
    mutationFn: async (newSubscriptionPlan: NewSubscriptionPlan) => {
      const res = await api.post(`/subscription-plans`, newSubscriptionPlan);
      if (!res.data.success) {
        throw new Error(
          "Failed to create subscription-plan: No success object returned from server."
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
        "Failed to create subscription-plan"
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
        `/subscription-plans/admin`
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
        `/subscription-plans/admin/${uid}`
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
      updates: Partial<NewSubscriptionPlan>;
    }) => {
      const res = await api.patch(
        `/subscription-plans/admin/${data.uid}`,
        data.updates
      );
      if (!res.data.success) {
        throw new Error(
          "Failed to update subscription-plan: No success object returned from server."
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
        "Failed to update subscription-plan"
      );
      toast.error(errorMsg);
    },
  });
}

// delete subscriptionPlan by uid
export function useDeleteSubscriptionPlan() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSubscriptionPlan"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/subscription-plans/admin/${uid}`);
      if (!res.data.success) {
        throw new Error(
          "Failed to delete subscription-plan: No success object returned from server."
        );
      }
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
        "Failed to delete subscription-plan"
      );
      toast.error(errorMsg);
    },
  });
}
