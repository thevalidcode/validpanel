import React from "react";
import SystemSettings from "../components/settings/SystemSettings";
import Layout from "../components/Layout";

const AdminSettingsPage: React.FC = () => {
  return (
    <Layout
      title="System Settings"
      description="Configure system-wide settings and preferences"
    >
      <SystemSettings />
    </Layout>
  );
};

export default AdminSettingsPage;