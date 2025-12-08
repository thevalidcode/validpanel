import React from "react";
import AdminSettings from "../components/settings/SystemSettings";
import Layout from "../components/Layout";

const AdminScreen: React.FC = () => {
  return (
    <Layout title="Settings" description="View and manage platform's settings.">
      <AdminSettings />
    </Layout>
  );
};

export default AdminScreen;
