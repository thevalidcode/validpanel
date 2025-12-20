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
