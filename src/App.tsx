import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages with Navbar & Footer
import HomePage from "./client/pages/HomePage";
import FAQPage from "./client/pages/FAQPage";
import PricingPage from "./client/pages/PricingPage";
import ContactUs from "./client/pages/ContactUs";
import LoginPage from "./client/pages/LoginPage";
import RegisterPage from "./client/pages/RegisterPage";

// Step pages (no Navbar or Footer)
import Step1 from "./client/pages/StoreOne";
import Step2 from "./client/pages/Store2";
import Step3 from "./client/pages/Step3";
import Step4 from "./client/pages/Step4";
import Step5 from "./client/pages/Step5";
import Step6 from "./client/pages/Step6";
import Step7 from "./client/pages/Step7";
import CreateStore from "./client/pages/CreateStorePage";
import Dashlayout from "./Layout/DashLayout";
import StoreLayout from "./client/components/User/StoreLayout";
import Adminsettings from "./admin/pages/Adminsettings";
import AdminStores from "./admin/pages/AdminStores";
import SettingsPage from "./client/pages/SettingsPage";
import Useroverview from "./client/pages/Useroverview";
const UsersPage = React.lazy(
  () => import("./admin/pages/usersManagement/UsersPage")
);
const AnalyticsPage = React.lazy(
  () => import("./admin/pages/AnalyticsPage/AnalyticsPage")
);
const AdminOrdersPage = React.lazy(
  () => import("./admin/pages/Orders/OrdersPage")
);

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashlayout />}>
            <Route index element={<HomePage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Routes without layout for users */}
          <Route path="/onboarding/step1" element={<Step1 />} />
          <Route path="/onboarding/step2" element={<Step2 />} />
          <Route path="/onboarding/step3" element={<Step3 />} />
          <Route path="/onboarding/step4" element={<Step4 />} />
          <Route path="/onboarding/step5" element={<Step5 />} />
          <Route path="/onboarding/step6" element={<Step6 />} />
          <Route path="/onboarding/step7" element={<Step7 />} />
          <Route path="/create-store" element={<CreateStore />} />
          <Route path="/stores" element={<StoreLayout />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/overview" element={<Useroverview />} />

          {/* Routes without layout for admins */}
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/settings" element={<Adminsettings />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
