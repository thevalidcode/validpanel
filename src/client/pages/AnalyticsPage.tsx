import AnalyticsDesktopView from "../components/analytics/AnalyticsDesktopView";
import AnalyticsMobileView from "../components/analytics/AnalyticsMobileView";
import { Store, Package, Calendar } from "lucide-react";
import type { TimeRange } from "../components/analytics/PlatformActivity";
import { useState } from "react";
import type { AnalyticsSummaryCardProps } from "../components/analytics/AnalyticsSummaryCard";
import { FaStore } from "react-icons/fa";
import Layout from "@/client/components/Layout";
import Loader from "@/components/Loader";
import { useGetUserAnalytics } from "@/hooks/use-user";
import NotFound from "@/components/NotFound";

const AnalyticsPage = () => {
  const { data: analyticsData, isLoading } = useGetUserAnalytics();
  const [range, setRange] = useState<TimeRange>("Last 7 days");

  if (isLoading) {
    return <Loader />;
  }

  if (!analyticsData) {
    return (
      <Layout title="Analytics" description="Platform insights">
        <NotFound
          variant="page"
          title="No analytics available"
          description="We could not find any analytics data for your account yet. Create a store or generate activity to see insights here."
        />
      </Layout>
    );
  }

  const summaryData: AnalyticsSummaryCardProps[] = [
    {
      title: "Total Stores",
      value: analyticsData.stores.total.value.toString(),
      change: analyticsData.stores.total.change,
      changeType: analyticsData.stores.total.change.startsWith("+")
        ? "increase"
        : analyticsData.stores.total.change.startsWith("-")
        ? "decrease"
        : "neutral",
      icon: <FaStore className="text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Active Stores",
      value: analyticsData.stores.active.value.toString(),
      change: analyticsData.stores.active.change,
      changeType: analyticsData.stores.active.change.startsWith("+")
        ? "increase"
        : analyticsData.stores.active.change.startsWith("-")
        ? "decrease"
        : "neutral",
      icon: <Store className="text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      title: "Current Plan",
      value: analyticsData.subscription.currentPlan,
      change: "Active subscription",
      changeType: "increase",
      icon: <Package className="text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      title: "Next Billing Date",
      value: analyticsData.subscription.nextBillingDate
        ? new Date(
            analyticsData.subscription.nextBillingDate
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      change: "Auto-renewal enabled",
      changeType: "increase",
      icon: <Calendar className="text-orange-600" />,
      iconBg: "bg-orange-100",
    },
  ];
  const platformEvents = analyticsData.platformEvents ?? {
    "Last 7 days": [],
    "Last 30 days": [],
    "Last 90 days": [],
  };

  return (
    <Layout
      title="Analytics"
      description="Track stores performance and platform activity."
    >
      <div className="w-full space-y-5 p-6">
        <AnalyticsMobileView
          summaryData={summaryData}
          dataSets={platformEvents}
          range={range}
          setRange={setRange}
          allStores={analyticsData.allStores}
          featuresData={analyticsData.subscription.features}
        />
        <AnalyticsDesktopView
          dataSets={platformEvents}
          summaryData={summaryData}
          featuresData={analyticsData.subscription.features}
          allStoresData={analyticsData.allStores}
          range={range}
          setRange={setRange}
        />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
