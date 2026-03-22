import { useEffect, useMemo, useState } from "react";
import Layout from "@/admin/components/Layout";
import {
  useGetAdminSubscriptionPlans,
  useDeleteSubscriptionPlan,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useCreateSubscriptionPlanPrice,
  useUpdateSubscriptionPlanPrice,
  useDeleteSubscriptionPlanPrice,
} from "@/hooks/use-subscription-plan";

import Loader from "@/components/Loader";
import { Plus, Search } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import NotFound from "@/components/NotFound";

import SubscriptionPlansMobileView from "../components/subscription-plans/SubscriptionPlansMobileView";
import SubscriptionPlansDesktopView from "../components/subscription-plans/SubscriptionPlansDesktopView";
import EditSubscriptionPlanDialog, {
  type DialogMode,
} from "../components/subscription-plans/EditSubscriptionPlanDialog";

import type { SubscriptionPlan } from "@/types";

const SubscriptionPlansPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [search, setSearch] = useState("");

  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [editTarget, setEditTarget] = useState<SubscriptionPlan | undefined>();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Fetch subscription plans
  const { data: fetchedPlans, isLoading: isPlansLoading } =
    useGetAdminSubscriptionPlans();

  const { mutateAsync: deletePlan, isPending: isDeletePending } =
    useDeleteSubscriptionPlan();
  const { mutateAsync: createPlan, isPending: isCreatePending } =
    useCreateSubscriptionPlan();
  const { mutateAsync: updatePlan, isPending: isUpdatePending } =
    useUpdateSubscriptionPlan();

  const { mutateAsync: createPrice } = useCreateSubscriptionPlanPrice();
  const { mutateAsync: updatePrice } = useUpdateSubscriptionPlanPrice();
  const { mutateAsync: deletePrice } = useDeleteSubscriptionPlanPrice();

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const name = plan.name ?? "";
      const description = plan.description ?? "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [plans, search]);

  // Update local state when plans fetch completes
  useEffect(() => {
    if (fetchedPlans) setPlans(fetchedPlans);
  }, [fetchedPlans]);

  if (isPlansLoading) return <Loader />;

  // Dialog actions
  const handleAction = (uid: string, action: "Delete" | "Edit") => {
    switch (action) {
      case "Delete":
        setDeleteTarget(uid);
        break;
      case "Edit":
        setEditTarget(plans.find((plan) => plan.uid === uid));
        setDialogMode("edit");
        break;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deletePlan(deleteTarget);
      setPlans((prev) => prev.filter((p) => p.uid !== deleteTarget));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDialogSubmit = async (data: any) => {
    try {
      if (dialogMode === "create") {
        await createPlan(data as SubscriptionPlan);
      } else if (dialogMode === "edit" && editTarget) {
        await updatePlan({
          uid: editTarget.uid,
          updates: data as SubscriptionPlan,
        });
      }
    } finally {
      setDialogMode(null);
      setEditTarget(undefined);
    }
  };

  return (
    <Layout
      title="Subscription Plans"
      description="Manage subscription plans, features, and pricing."
    >
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200">
          <div className="relative flex-1 md:w-[60%]">
            <input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 outline-0 w-full h-full rounded-[4px] pr-3 pl-12 py-2 focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          <div className="flex gap-2 items-center justify-end flex-1">
            <button
              onClick={() => setDialogMode("create")}
              className="text-white flex gap-2 border bg-primary items-center w-fit hover:bg-primary/90 px-4 py-2 rounded-[4px] transition-all font-medium"
            >
              <Plus className="text-base" />
              <span>Create Plan</span>
            </button>
          </div>
        </div>

        {/* Plans List */}
        {filteredPlans.length ? (
          <div className="mt-5">
            <div className="md:hidden w-full space-y-5">
              <SubscriptionPlansMobileView
                plans={filteredPlans}
                handleAction={handleAction}
              />
            </div>
            <div className="hidden md:block">
              <SubscriptionPlansDesktopView
                plans={filteredPlans}
                handleAction={handleAction}
              />
            </div>
          </div>
        ) : (
          <NotFound title="No subscription plans found." className="mt-5" />
        )}
      </div>

      {/* Dialogs */}
      <DeleteDialog
        open={!!deleteTarget}
        title="Delete subscription plan"
        description="This subscription plan and all related data will be permanently deleted."
        isLoading={isDeletePending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <EditSubscriptionPlanDialog
        open={!!dialogMode}
        mode={dialogMode}
        initialValues={editTarget}
        isLoading={isCreatePending || isUpdatePending}
        onSubmit={handleDialogSubmit}
        onCancel={() => {
          setDialogMode(null);
          setEditTarget(undefined);
        }}
        onAddPrice={async (planId, data) => {
          return await createPrice({ planId, data });
        }}
        onUpdatePrice={async (planId, priceId, data) => {
          return await updatePrice({ planId, priceId, data });
        }}
        onDeletePrice={async (planId, priceId) => {
          await deletePrice({ planId, priceId });
        }}
      />
    </Layout>
  );
};

export default SubscriptionPlansPage;
