import React from "react";
import AdminAccount from "../components/account/AdminAccount";
import Layout from "../components/Layout";

const AdminAccountPage: React.FC = () => {
  return (
    <Layout
      title="Account Settings"
      description="View and edit your account details"
    >
      <AdminAccount />
    </Layout>
  );
};

export default AdminAccountPage;