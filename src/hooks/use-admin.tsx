"use client";
import { useAppContext } from "@/context/useAppContext";
import type {
  Admin,
  AdminStatus,
  PlatformEvent,
  SubscriptionPlanInterval,
} from "@/types";
import type { Role } from "@/types/models/role";
import type { Permission } from "@/types/models/permission";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Custom hook for admin-related queries and mutations

interface NewAdmin {
  email: string;
  password: string;
  fullName: string;
  roleId: number;
}

export function useCreateAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createAdmin"],
    mutationFn: async (newAdmin: NewAdmin) => {
      const res = await api.post(`/admins`, newAdmin);
      if (!res.data) {
        throw new Error("Failed to create admin");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
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
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["overview-data"],
    queryFn: async () => {
      const res = await api.get<OverviewResponse>(`/admins/overview`);
      if (!res.data) throw new Error("Failed to fetch overview");
      return res.data;
    },
    enabled: !!adminInfo,
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

export function useGetRoles() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await api.get<{ roles: Role[] }>(`/admins/roles`);
      if (!res.data) throw new Error("Failed to fetch roles");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

export function useGetPermissions() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await api.get<{ permissions: Permission[] }>(
        `/admins/permissions`
      );
      if (!res.data) throw new Error("Failed to fetch permissions");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

export function useCreatePermission() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createPermission"],
    mutationFn: async (name: string) => {
      const res = await api.post(`/admins/permissions`, { name });
      if (!res.data) {
        throw new Error("Failed to create permission");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission created successfully");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during permission creation."
      );
      toast.error(errorMsg);
    },
  });
}

export function useGetAdmins() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await api.get<Admin[]>(`/admins`);
      if (!res.data) throw new Error("Failed to fetch admins");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

export function useGetPlatformEvents() {
  const { api, adminInfo } = useAppContext();
  return useQuery({
    queryKey: ["platform-events"],
    queryFn: async () => {
      const res = await api.get<PlatformEvent[]>(`/admins/platform-events`);
      if (!res.data) throw new Error("Failed to fetch platform-events");
      return res.data;
    },
    enabled: !!adminInfo,
  });
}

export const useDeleteAdmin = () => {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/admins/${uid}`);
      if (!res.data) throw new Error("Failed to delete admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to delete admin");
      toast.error(errorMsg);
    },
  });
};

interface UpdateAdminProps {
  data: {
    email?: string;
    fullName?: string;
    image?: string;
    status?: AdminStatus;
    roleId?: number;
  };
  uid: string;
}

export function useUpdateAdmin() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, data }: UpdateAdminProps) => {
      const res = await api.put(`/admins/${uid}`, data);
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Admin updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update admin");
      toast.error(errorMsg);
    },
  });
}

interface UpdateMeProps {
  email?: string;
  fullName?: string;
  image?: string;
  status?: AdminStatus;
}

export function useUpdateMe() {
  const { api, handleSetAdminInfo } = useAppContext();
  return useMutation({
    mutationFn: async (data: UpdateMeProps) => {
      const res = await api.put<{ success: string; admin: Admin }>(
        `/admins/me`,
        data
      );
      if (!res.data) throw new Error("Failed to update admin");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Admin updated successfully");
      handleSetAdminInfo({
        ...data.admin,
      });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update admin");
      toast.error(errorMsg);
    },
  });
}

export function useDeleteRole() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/admins/roles/${uid}`);
      if (!res.data) {
        throw new Error("Failed to delete role");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during role deletion."
      );
      toast.error(errorMsg);
    },
  });
}

interface RoleForm {
  name: string;
  permissionIds: number[];
}

export function useCreateRoleWithPermissions() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createRoleWithPermissions"],
    mutationFn: async (data: RoleForm) => {
      const res = await api.post(`/admins/roles`, data);
      if (!res.data) {
        throw new Error("Failed to create role");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during role creation."
      );
      toast.error(errorMsg);
    },
  });
}

export function useUpdateRoleWithPermissions() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateRoleWithPermissions"],
    mutationFn: async ({ uid, data }: { uid: string; data: RoleForm }) => {
      const res = await api.put(`/admins/roles/${uid}`, data);
      if (!res.data) {
        throw new Error("Failed to update role");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during role update."
      );
      toast.error(errorMsg);
    },
  });
}

type AssignRoleProps = {
  uid: string;
  data: { uid: string };
};

export function useAssignPermissionToRole() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, data }: AssignRoleProps) => {
      const res = await api.put(`/admins/roles/${uid}/permissions`, data);
      if (!res.data) throw new Error("Failed to assign permission");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to assign permission");
      toast.error(errorMsg);
    },
  });
}

interface UpdatePermissionProps {
  data: {
    name: string;
  };
  uid: string;
}

export function useUpdatePermission() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, data }: UpdatePermissionProps) => {
      const res = await api.patch(`/admins/permissions/${uid}`, data);
      if (!res.data) throw new Error("Failed to update permission");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission updated successfully");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: unknown) => {
      const errorMsg = normalizeApiError(error, "Failed to update permission");
      toast.error(errorMsg);
    },
  });
}

export function useDeletePermission() {
  const { api } = useAppContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteRole"],
    mutationFn: async (uid: string) => {
      const res = await api.delete(`/admins/permissions/${uid}`);
      if (!res.data) {
        throw new Error("Failed to delete permission");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: unknown) => {
      let errorMsg = normalizeApiError(
        error,
        "An unexpected error occurred during permission deletion."
      );
      toast.error(errorMsg);
    },
  });
}
