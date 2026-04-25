import { useAppContext } from "@/context/useAppContext";
import type {
  ResellerSourceProductsResponse,
  ResellerSourceServicesResponse,
  ResellerSourcesResponse,
  StartResellingPayload,
  StoreType,
} from "@/types";
import { normalizeApiError } from "@/utils/normalizeApiErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetResellerSources(params?: {
  search?: string;
  page?: number;
  limit?: number;
  sourceType?: StoreType;
}) {
  const { api, userInfo } = useAppContext();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const search = params?.search;
  const sourceType = params?.sourceType ?? "SHOP";

  return useQuery({
    queryKey: [
      "reseller-sources",
      userInfo?.uid || "public",
      page,
      limit,
      search || "",
      sourceType,
    ],
    queryFn: async () => {
      const res = await api.get<ResellerSourcesResponse>("/reseller/sources", {
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          sourceType,
        },
      });
      return res.data;
    },
  });
}

export function useGetResellerSourceProducts(supplierId?: string) {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: [
      "reseller-source-products",
      userInfo?.uid || "public",
      supplierId,
    ],
    queryFn: async () => {
      const res = await api.get<ResellerSourceProductsResponse>(
        `/reseller/shop/${supplierId}/products`,
      );
      return res.data;
    },
    enabled: !!supplierId,
  });
}

export function useGetResellerSourceServices(providerId?: string) {
  const { api, userInfo } = useAppContext();

  return useQuery({
    queryKey: [
      "reseller-source-services",
      userInfo?.uid || "public",
      providerId,
    ],
    queryFn: async () => {
      const res = await api.get<ResellerSourceServicesResponse>(
        `/reseller/smm/${providerId}/services`,
      );
      return res.data;
    },
    enabled: !!providerId,
  });
}

export function useStartReselling() {
  const { api, userInfo } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["start-reselling", userInfo?.uid],
    mutationFn: async (payload: StartResellingPayload) => {
      const res = await api.post("/reseller/start", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reselling started successfully");
      queryClient.invalidateQueries({ queryKey: ["stores", userInfo?.uid] });
    },
    onError: (error: unknown) => {
      const msg = normalizeApiError(error, "Failed to start reselling");
      toast.error(msg);
    },
  });
}
