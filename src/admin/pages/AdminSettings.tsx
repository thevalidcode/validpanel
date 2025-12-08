import React from "react";
import SystemSettings from "../components/settings/SystemSettings";
import Layout from "../components/Layout";

const AdminSettings: React.FC = () => {
  return (
    <Layout title="Settings" description="View and manage platform's settings.">
      <SystemSettings />
    </Layout>
  );
};

export default AdminSettings;
