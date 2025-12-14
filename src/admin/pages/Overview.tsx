import React, { useState } from "react";
import OverviewComponent from "../components/overview/Overview";
import Layout from "@/admin/components/Layout";
import { useAppContext } from "@/context/useAppContext";

const Overview: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { userInfo } = useAppContext();

  return (
    <Layout
      title="Overview"
      description={`Welcome back, ${
        userInfo?.fullName?.split(" ")[0] || "User"
      } Here’s what’s happening today.`}
    >
      <main className="flex-1">
        <OverviewComponent onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </Layout>
  );
};

export default Overview;
