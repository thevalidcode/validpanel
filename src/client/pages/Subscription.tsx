import Layout from "../components/Layout";
import Loader from "@/components/Loader";
import { useGetUserCurrentSubscription } from "@/hooks/use-subscription";

import SubscriptionTabs from "../components/subscription/SubscriptionTabs";
import OverviewTab from "../components/subscription/OverviewTab";
import PlansTab from "../components/subscription/PlansTab";
import BillingTab from "../components/subscription/BillingTab";
import NoSubscriptionState from "../components/subscription/NoSubscriptionState";
import { useGetUserSubscriptionPlans } from "@/hooks/use-subscription-plan";
import NotFound from "@/components/NotFound";
import { CreditCard } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import CouponShowcase from "@/components/coupons/CouponShowcase";

export default function SubscriptionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const { data: subscription, isLoading } = useGetUserCurrentSubscription();
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
      <Layout title="Subscription" description="Manage your plan">
        <div className="flex items-center justify-center min-h-[60vh]">
          <NotFound
            title="No Subscription Plan Found"
            description="No subscription plan has been created yet."
            variant="page"
            actionLabel="Go Back"
            onActionClick={() => navigate(-1)}
            icon={<CreditCard className="w-10 h-10 mx-auto text-gray-400" />}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Subscription & Billing"
      description="Manage your subscription, view billing history, and upgrade your plan."
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <AnimatedSection>
          <SubscriptionTabs activeTab={activeTab} onChange={handleTabChange} />
          <CouponShowcase
            context="SUBSCRIPTION_PAGE"
            variant="sidebar"
            className="my-4"
            title="Subscription Offers"
          />
          <div className="bg-white rounded-[4px] border border-gray-200 shadow-sm p-6 min-h-[100px]">
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
                currentSubscription={subscription}
                subscriptionPlans={subscriptionPlans}
              />
            )}

            {activeTab === "billing" && (
              <BillingTab />
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
}
