import React, { useState } from "react";
import Overview from "../components/overview/Overview";
import Layout from "../components/Layout";
import { useAppContext } from "@/context/useAppContext";

const Useroverview: React.FC = () => {
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
        <Overview onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </Layout>
  );
};

export default Useroverview;
