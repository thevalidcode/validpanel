import AnalyticsDesktopView from "../components/analytics/AnalyticsDesktopView";
import AnalyticsMobileView from "../components/analytics/AnalyticsMobileView";
import { DollarSign, Users, BarChart3 } from "lucide-react";
import type { TimeRange } from "../components/analytics/RevenueTrend";
import { useState } from "react";
import type { AnalyticsSummaryCardProps } from "../components/analytics/AnalyticsSummaryCard";
import type { StorePerformanceData } from "../components/analytics/StorePerformanceChart";
import type { StoreData } from "../components/analytics/AllStoresTable";
import { FaStore } from "react-icons/fa";
import Layout from "@/client/components/Layout";

const summaryData: AnalyticsSummaryCardProps[] = [
  {
    title: "Total Stores",
    value: "12",
    change: "+2 this month",
    changeType: "increase",
    icon: <FaStore className="text-blue-600" />,
    iconBg: "bg-blue-100",
  },
  {
    title: "Total Revenue",
    value: "$127,340",
    change: "+18.2% vs last month",
    changeType: "increase",
    icon: <DollarSign className="text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+12.5% growth",
    changeType: "increase",
    icon: <Users className="text-purple-600" />,
    iconBg: "bg-purple-100",
  },
  {
    title: "Avg. Revenue/Store",
    value: "$10,612",
    change: "-3.1% vs last month",
    changeType: "decrease",
    icon: <BarChart3 className="text-orange-600" />,
    iconBg: "bg-orange-100",
  },
];

const dataSets: Record<TimeRange, { name: string; value: number }[]> = {
  "Last 7 days": [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 2000 },
    { name: "Wed", value: 1600 },
    { name: "Thu", value: 2200 },
    { name: "Fri", value: 2000 },
    { name: "Sat", value: 2700 },
    { name: "Sun", value: 2300 },
  ],
  "Last 30 days": Array.from({ length: 30 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(1000 + Math.random() * 2000),
  })),
  "Last 90 days": Array.from({ length: 12 }, (_, i) => ({
    name: `W${i + 1}`,
    value: Math.floor(800 + Math.random() * 2500),
  })),
};

const storePerformanceData: StorePerformanceData[] = [
  { name: "Fashion Hub", revenue: 23500 },
  { name: "Tech Store", revenue: 45200 },
  { name: "Home Decor", revenue: 19000 },
  { name: "Sports Gear", revenue: 32300 },
  { name: "Books Corner", revenue: 15800 },
];

const allStoresData: StoreData[] = [
  {
    id: 1,
    name: "Fashion Hub",
    created: "Created 2 months ago",
    category: "Fashion",
    revenue: "$23,450",
    orders: 342,
    status: "Active",
    icon: <FaStore className="text-blue-600" />,
    iconBg: "bg-blue-100",
  },
  {
    id: 2,
    name: "Tech Store",
    created: "Created 4 months ago",
    category: "Electronics",
    revenue: "$45,230",
    orders: 156,
    status: "Active",
    icon: <BarChart3 className="text-green-600" />,
    iconBg: "bg-green-100",
  },
  {
    id: 3,
    name: "Home Decor",
    created: "Created 6 months ago",
    category: "Home & Garden",
    revenue: "$18,690",
    orders: 89,
    status: "Pending",
    icon: <Users className="text-purple-600" />,
    iconBg: "bg-purple-100",
  },
];

const AnalyticsPage = () => {
  const [range, setRange] = useState<TimeRange>("Last 7 days");
  return (
    <Layout
      title="Analytics"
      description="Track all stores performance and platfom's revenue."
    >
      <div className="w-full space-y-5 p-6">
        <AnalyticsMobileView
          summaryData={summaryData}
          dataSets={dataSets}
          range={range}
          setRange={setRange}
          data={storePerformanceData}
        />
        <AnalyticsDesktopView
          dataSets={dataSets}
          summaryData={summaryData}
          storePerformanceData={storePerformanceData}
          allStoresData={allStoresData}
          range={range}
          setRange={setRange}
        />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
