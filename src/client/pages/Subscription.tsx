import Layout from "../components/Layout";
import Loader from "@/components/Loader";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";

import SubscriptionTabs from "../components/subscription/SubscriptionTabs";
import OverviewTab from "../components/subscription/OverviewTab";
import PlansTab from "../components/subscription/PlansTab";
import BillingTab from "../components/subscription/BillingTab";
import NoSubscriptionState from "../components/subscription/NoSubscriptionState";
import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import NotFound from "@/components/NotFound";
import { CreditCard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SubscriptionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: subscription, isLoading } = useGetUserActiveSubscription();
  const { data: subscriptionPlans, isLoading: isSubscriptionPlanLoading } =
    useGetUserSubscriptionPlans();
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  if (isLoading || isSubscriptionPlanLoading) {
    return <Loader />;
  }

  if (!subscriptionPlans) {
    return (
      <NotFound
        title="No Subscription Plan Found"
        description="No subscription plan has been created yet."
        variant="page"
        actionLabel="Go Back"
        onActionClick={() => navigate(-1)}
        icon={<CreditCard className="w-10 h-10 mx-auto text-gray-400" />}
      />
    );
  }

  return (
    <Layout
      title="Subscription & Billing"
      description="Manage your subscription, view billing history, and upgrade your plan"
    >
      <div className="p-6">
        <SubscriptionTabs activeTab={activeTab} onChange={handleTabChange} />

        {!subscription && activeTab !== "plans" && (
          <NoSubscriptionState goToPlans={() => handleTabChange("plans")} />
        )}

        {subscription && activeTab === "overview" && (
          <OverviewTab
            subscription={subscription}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === "plans" && (
          <PlansTab
            subscription={subscription!}
            subscriptionPlans={subscriptionPlans}
          />
        )}

        {activeTab === "billing" && <BillingTab />}
      </div>
    </Layout>
  );
}
