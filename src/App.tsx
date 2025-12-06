import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { QueryProvider } from "./provider/queryProvider";
import { Toaster } from "sonner";
import Loader from "./components/Loader";

// Layouts
import DashLayout from "./layout/DashLayout";
import StoreLayout from "./client/components/User/StoreLayout";

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

// User pages (no admin)
import SettingsPage from "./client/pages/SettingsPage";
import UserOverview from "./client/pages/Useroverview";

// Admin pages (lazy loaded)
const UsersPage = React.lazy(
  () => import("./admin/pages/usersManagement/UsersPage")
);
const AnalyticsPage = React.lazy(
  () => import("./admin/pages/AnalyticsPage/AnalyticsPage")
);
const AdminOrdersPage = React.lazy(
  () => import("./admin/pages/Orders/OrdersPage")
);
const AdminStoresPage = React.lazy(() => import("./admin/pages/AdminStores"));
import AdminSettings from "./admin/pages/Adminsettings";

const App: React.FC = () => {
  return (
    <QueryProvider>
      <AppProvider>
        {/* Global notifications */}
        <Toaster position="top-right" richColors />

        <Router>
          <Routes>
            {/* Public & client routes with Dashboard layout */}
            <Route path="/" element={<DashLayout />}>
              <Route index element={<HomePage />} />
              <Route path="faq" element={<FAQPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="contact-us" element={<ContactUs />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Onboarding & store creation (no layout) */}
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
            <Route path="/overview" element={<UserOverview />} />

            {/* Admin routes with Suspense for lazy loading */}
            <Route
              path="/admin/stores"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminStoresPage />
                </Suspense>
              }
            />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route
              path="/admin/orders"
              element={
                <Suspense fallback={<Loader />}>
                  <AdminOrdersPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <Suspense fallback={<Loader />}>
                  <AnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<Loader />}>
                  <UsersPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </AppProvider>
    </QueryProvider>
  );
};

export default App;
