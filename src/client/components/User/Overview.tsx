import React from "react";
import {
  ArrowUpIcon,
  ArrowDownRightIcon,
  BellIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
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

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  change: string;
  color: string;
  up?: boolean;
  down?: boolean;
}

interface ActivityProps {
  name: string;
  task: string;
  time: string;
  img: string;
}

interface OrderItemProps {
  icon: string;
  name: string;
  category: string;
  price: string;
}

//  Main Component
const Overview: React.FC<OverviewProps> = ({ onMenuClick }) => {
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [30, 38, 42, 50, 58, 65, 60, 68, 62, 70, 75, 80],
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            className="md:hidden text-gray-700 hover:text-purple-700"
            onClick={onMenuClick}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, Sarah! Here’s what’s happening today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm">
            <PlusIcon className="w-4 h-4" />
            New Stores
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value="$124,350"
          icon="Icon.svg"
          change="+12.5% from last month"
          color="text-green-600"
          up
        />
        <StatCard
          title="Active Users"
          value="8,549"
          icon="Usericon.svg"
          change="+8.2% from last week"
          color="text-blue-600"
          up
        />
        <StatCard
          title="Conversion Rate"
          value="3.24%"
          icon="Rate.svg"
          change="-2.1% from last week"
          color="text-red-600"
          down
        />
        <StatCard
          title="Total Orders"
          value="2,847"
          icon="Orders.svg"
          change="+16.3% from last month"
          color="text-green-600"
          up
        />
      </div>

      {/* Chart + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-gray-700">Revenue Trend</h2>
            <select className="border border-gray-200 rounded-md px-2 py-1 text-sm">
              <option>Last 30 days</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-medium text-gray-700 mb-2">Performance Score</h2>
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            (Performance Metrics Coming Soon)
          </div>
        </div>
      </div>

      {/* Activity + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-medium text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <Activity
              name="John Smith"
              task="completed project 'Website Redesign'"
              time="2 hours ago"
              img="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <Activity
              name="Emma Wilson"
              task="uploaded new designs"
              time="4 hours ago"
              img="https://randomuser.me/api/portraits/women/45.jpg"
            />
            <Activity
              name="Mike Davis"
              task="created new task"
              time="6 hours ago"
              img="https://randomuser.me/api/portraits/men/12.jpg"
            />
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-700">Top Orders</h2>
            <button className="text-sm text-purple-600 hover:underline">
              View All
            </button>
          </div>

          <ul className="space-y-3">
            <OrderItem
              icon="Mac.svg"
              name="MacBook Pro"
              category="Electronics"
              price="$2,499"
            />
            <OrderItem
              icon="Iphone.svg"
              name="iPhone 15"
              category="Electronics"
              price="$999"
            />
            <OrderItem
              icon="Airpod.svg"
              name="AirPods Pro"
              category="Accessories"
              price="$249"
            />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;

// Reusable Components

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  color,
  up,
  down,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1 hover:shadow-sm transition">
    <p className="text-sm text-gray-500">{title}</p>

    <div className="flex justify-between items-center">
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <img src={icon} className="w-10 h-10 text-purple-500" alt={title} />
    </div>
    <div className={`flex items-center gap-1 text-sm ${color}`}>
      {up && <ArrowUpIcon className="w-4 h-4" />}
      {down && <ArrowDownRightIcon className="w-4 h-4" />}
      <span>{change}</span>
    </div>
  </div>
);

const Activity: React.FC<ActivityProps> = ({ name, task, time, img }) => (
  <li className="flex items-center gap-3">
    <img src={img} alt={name} className="w-10 h-10 rounded-full object-cover" />
    <div>
      <p className="text-gray-700 text-sm">
        <span className="font-medium">{name}</span> {task}
      </p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </li>
);

const OrderItem: React.FC<OrderItemProps> = ({
  icon,
  name,
  category,
  price,
}) => (
  <li className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <img src={icon} className="w-10 h-10 text-purple-600" alt={name} />

      <div>
        <p className="font-medium text-gray-700 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
    </div>
    <p className="text-gray-800 font-medium">{price}</p>
  </li>
);
