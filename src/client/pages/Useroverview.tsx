import React, { useState } from "react";
import Overview from "./Overview";
import Layout from "../components/Layout";

const Useroverview: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <Layout
      title="Overview"
      description="Welcome back, Sarah! Here’s what’s happening today."
    >
      <main className="flex-1">
        <Overview onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </main>
    </Layout>
  );
};

export default Useroverview;
