import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { StatCard } from "../StatCard";
import { Activity } from "./Activity";
import { SubscriptionItem } from "./SubscriptionItem";
import { useGetOverview } from "@/hooks/use-admin";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

//  Type Definitions
interface OverviewProps {
  onMenuClick: () => void;
}

const Overview: React.FC<OverviewProps> = () => {
  const { data: overviewData, isLoading } = useGetOverview();

  if (isLoading) {
    return <Loader />;
  }

  if (!overviewData) {
    return <NotFound title="Overview Data Not Found" variant="card" />;
  }

  const chartData = {
    labels: overviewData.revenueChart.labels,
    datasets: [
      {
        label: "Revenue",
        data: overviewData.revenueChart.data,
        backgroundColor: "rgba(147, 51, 234, 0.15)",
        borderColor: "#9333EA",
        pointBackgroundColor: "#9333EA",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280" },
      },
      y: {
        grid: { color: "#F3F4F6" },
        ticks: { color: "#6B7280" },
      },
    },
  };

  const statIconMap: Record<string, string> = {
    "Total Revenue": "/Icon.svg",
    "Active Users": "/Usericon.svg",
    "Conversion Rate": "/Rate.svg",
    "Active Subscriptions": "/Orders.svg",
  };

  const getStatIcon = (title: string) => statIconMap[title] ?? "/Icon.svg";

  const subscriptionMetrics = [
    {
      title: "MRR Growth (MoM)",
      value: overviewData.subscriptionHealth.mrrGrowth.value,
      up: overviewData.subscriptionHealth.mrrGrowth.up,
    },
    {
      title: "Churn Rate",
      value: overviewData.subscriptionHealth.churnRate.value,
    },
    {
      title: "ARPU",
      value: overviewData.subscriptionHealth.arpu.value,
    },
    {
      title: "Net Revenue Retention",
      value: overviewData.subscriptionHealth.netRevenueRetention.value,
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {overviewData.stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={getStatIcon(stat.title)}
            change={stat.change}
            color={
              stat.up === undefined
                ? "text-gray-500"
                : stat.up
                ? "text-green-600"
                : "text-red-600"
            }
            up={stat.up}
          />
        ))}
      </div>

      {/* Chart + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-[4px] p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-gray-700">Revenue Trend</h2>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white border border-gray-200 rounded-[4px] p-4">
          <h2 className="font-medium text-gray-700 mb-4">
            Subscription Health
          </h2>

          <div className="space-y-3">
            {subscriptionMetrics.map((metric, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p
                  className={`text-sm font-semibold ${
                    metric.up === undefined
                      ? "text-gray-800"
                      : metric.up
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-[4px] p-4">
          <h2 className="font-medium text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {overviewData.recentActivities.map((activity, idx) => (
              <Activity
                index={idx}
                name={activity.name}
                task={activity.message}
                img={activity.img}
                time={new Date(activity.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-[4px] p-4">
          <div className="flex items-center mb-4">
            <h2 className="font-medium text-gray-700">Top Subscriptions</h2>
          </div>
          <ul className="space-y-3">
            {overviewData.topSubscriptions.map((subscription, idx) => (
              <SubscriptionItem
                key={idx}
                planName={subscription.planName}
                billingCycle={subscription.billingCycle}
                subscribers={subscription.subscribers}
                revenue={subscription.revenue}
                isTrending={subscription.isTrending}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
