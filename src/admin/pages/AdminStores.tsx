import { type JSX } from "react";
import StoreTable from "../components/stores/storeTable";
import Layout from "../components/Layout";

//  Define prop types for StatCard
interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon: string;
}

//  AdminStores Component
export default function AdminStores(): JSX.Element {
  return (
    <Layout
      title="Store Management"
      description="View and manage all created shops and social media stores."
    >
      <main className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Stores"
            value="247"
            color="text-blue-700"
            icon="TotalS.svg"
          />
          <StatCard
            title="Active Stores"
            value="198"
            color="text-green-700"
            icon="ActiveS.svg"
          />
          <StatCard
            title="Paused Stores"
            value="32"
            color="text-yellow-700"
            icon="Pausedstore.svg"
          />
          <StatCard
            title="This Month"
            value="17"
            color="text-purple-700"
            icon="Calender.svg"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <StoreTable />
        </div>
      </main>
    </Layout>
  );
}

//  StatCard Component
function StatCard({ title, value, color, icon }: StatCardProps): JSX.Element {
  return (
    <div
      className={`flex justify-between items-center p-4 rounded-lg border border-gray-300 bg-white ${color}`}
    >
      <div className="text-left">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <img src={icon} alt={`${title} icon`} />
    </div>
  );
}
