"use client";
import { useAppContext } from "@/context/useAppContext";
import type {
  Coupon,
  DiscountType,
  BillingInterval,
  CouponAppliesTo,
} from "@/types/models/coupon";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ============================================
// ADMIN COUPON HOOKS
// ============================================

export function useGetCoupons() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await api.get<Coupon[]>("/coupons/admin");
      if (!res.data) throw new Error("Failed to fetch coupons");
      return res.data;
    },
    enabled: !!adminInfo?.uid,
  });
}

export function useGetCoupon(uid: string) {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["coupons", uid],
    queryFn: async () => {
      const res = await api.get<Coupon>(`/coupons/admin/${uid}`);
      if (!res.data) throw new Error("Failed to fetch coupon");
      return res.data;
    },
    enabled: !!adminInfo?.uid && !!uid,
  });
}

interface CreateCouponData {
  code: string;
  type: DiscountType;
  value: string; // decimal string
  currency?: string | null;
  maxUses?: number | null;
  perUserLimit?: number | null;
  isActive?: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
  minAmount?: number | null; // minor units
  firstTimeOnly?: boolean;
  contexts?: string[];
  isPublic?: boolean;
  priority?: number;
  autoApply?: boolean;
  highlightText?: string;
  appliesTo?: CouponAppliesTo[];
  rules?: Array<{
    planId?: number | null;
    interval?: BillingInterval | null;
    currency?: string | null;
    region?: string | null;
  }>;
}

export function useCreateCoupon() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createCoupon"],
    mutationFn: async (data: CreateCouponData) => {
      const res = await api.post<{ success: string; coupon: Coupon }>(
        "/coupons/admin",
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Coupon created successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to create coupon");
      toast.error(errorMsg);
    },
  });
}

export function useUpdateCoupon() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCoupon"],
    mutationFn: async ({
      uid,
      ...data
    }: Partial<CreateCouponData> & { uid: string }) => {
      const res = await api.patch<{ success: string; coupon: Coupon }>(
        `/coupons/admin/${uid}`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to update coupon");
      toast.error(errorMsg);
    },
  });
}

export function useDeleteCoupon() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteCoupon"],
    mutationFn: async (uid: string) => {
      const res = await api.delete<{ success: string }>(
        `/coupons/admin/${uid}`,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => {
      const errorMsg = normalizeApiError(error, "Failed to delete coupon");
      toast.error(errorMsg);
    },
  });
}

// ============================================
// PUBLIC COUPON HOOKS
// ============================================

export function useGetPublicCoupons() {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["public-coupons"],
    queryFn: async () => {
      const res = await api.get<Coupon[]>("/coupons");
      if (!res.data) throw new Error("Failed to fetch public coupons");
      return res.data;
    },
  });
}

export function useGetCouponsByContext(context: string) {
  const { api } = useAppContext();
  return useQuery({
    queryKey: ["context-coupons", context],
    queryFn: async () => {
      const res = await api.get<Coupon[]>("/coupons/context", {
        params: { context },
      });
      if (!res.data) throw new Error("Failed to fetch context coupons");
      return res.data;
    },
    enabled: !!context,
  });
}

interface ValidateCouponData {
  code: string;
  planId: number;
  billingCycle: BillingInterval;
  currency: string;
  appliesTo?: CouponAppliesTo;
  amount?: string;
  userId?: number;
  region?: string;
}

interface ValidateCouponResponse {
  success: boolean;
  coupon: Coupon;
  discountAmount?: string;
  discountCurrency?: string;
}

export function useValidateCoupon() {
  const { api } = useAppContext();
  return useMutation({
    mutationKey: ["validateCoupon"],
    mutationFn: async (data: ValidateCouponData) => {
      const res = await api.post<ValidateCouponResponse>(
        "/coupons/validate",
        data,
      );
      return res.data;
    },
    onError: () => {
      // Errors handled by caller commonly, but we can toast too
    //   const errorMsg = normalizeApiError(error, "Invalid coupon");
      // toast.error(errorMsg); // Optional: might want custom handling in UI
    },
  });
}
