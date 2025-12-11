import React from "react";
import UserSettings from "../components/settings/Settings";
import Layout from "../components/Layout";

const Settings: React.FC = () => {
  return (
    <Layout
      title="Account Settings"
      description="View and edit your acccount details"
    >
      <UserSettings />
    </Layout>
  );
};

export default Settings;
