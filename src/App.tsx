import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { QueryProvider } from "./provider/queryProvider";
import Loader from "./components/Loader";
import MaintenanceMode from "@/components/MaintenanceMode";
import CustomToaster from "@/components/CustomToaster";
import ScrollToTop from "@/utils/ScrollToTop";

// Layouts
import PublicLayout from "./components/PublicLayout";

// Pages with Navbar & Footer
import HomePage from "./client/pages/HomePage";
import FAQPage from "./client/pages/FAQPage";
import PricingPage from "./client/pages/PricingPage";
import ContactUs from "./client/pages/ContactUs";
import LoginPage from "./client/pages/LoginPage";
import RegisterPage from "./client/pages/RegisterPage";
import ForgetPassword from "./client/pages/ForgetPassword";
import ResetPasswordPage from "./client/pages/ResetPassword";
import NotFoundPage from "./client/pages/NotFoundPage";
import ErrorPage from "./client/pages/ErrorPage";
import TermsOfService from "./client/pages/TermsOfService";
import PrivacyPolicy from "./client/pages/PrivacyPolicy";

// Step pages (no Navbar or Footer)
import Step1 from "./client/pages/Step1";
import Step2 from "./client/pages/Step2";
import Step3 from "./client/pages/Step3";
import Step4 from "./client/pages/Step4";
import Step5 from "./client/pages/Step5";
import Step6 from "./client/pages/Step6";
import CreateStore from "./client/pages/CreateStorePage";
import SettingsPage from "./client/pages/SettingsPage";
import AnalyticsPage from "./client/pages/AnalyticsPage";
import StoresPage from "./client/pages/Stores";
import Subscription from "./client/pages/Subscription";
import UpgradePlan from "./client/pages/UpgradePlan";

// Admin pages
import AdminSettings from "./admin/pages/AdminSettings";
import AdminLogin from "./admin/pages/LoginPage";
import AdminResetPassword from "./admin/pages/ResetPassword";
import AdminForgotPassword from "./admin/pages/ForgetPassword";
import RenewSubscription from "./client/pages/RenewSubscription";

// Admin pages (lazy loaded)
const UsersPage = React.lazy(() => import("./admin/pages/UsersPage"));
const OverviewPage = React.lazy(() => import("./admin/pages/Overview"));
const AdminOrdersPage = React.lazy(() => import("./admin/pages/OrdersPage"));
const AdminPGPage = React.lazy(() => import("./admin/pages/PGPage"));
const AdminStoresPage = React.lazy(() => import("./admin/pages/AdminStores"));
const Notifications = React.lazy(() => import("./admin/pages/Notifications"));
const AdminManagement = React.lazy(
  () => import("./admin/pages/AdminManagement")
);
const Permissions = React.lazy(() => import("./admin/pages/PermissionsPage"));
const AdminAccount = React.lazy(() => import("./admin/pages/AdminAccountPage"));
const SubscriptionPlansPage = React.lazy(
  () => import("./admin/pages/SubscriptionPlansPage")
);
const PaymentsPage = React.lazy(() => import("./admin/pages/PaymentsPage"));
const ContactMessagesPage = React.lazy(
  () => import("./admin/pages/ContactMessagesPage")
);
const ContactMessageDetailPage = React.lazy(
  () => import("./admin/pages/ContactMessageDetailPage")
);

const App: React.FC = () => {
  return (
    <QueryProvider>
      <AppProvider>
        {/* Global notifications */}
        <CustomToaster />

        <MaintenanceMode>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public & client routes with Dashboard layout */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<HomePage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="pricing" element={<PricingPage />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgetPassword />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="admin/login" element={<AdminLogin />} />
                <Route
                  path="admin/forgot-password"
                  element={<AdminForgotPassword />}
                />{" "}
                <Route
                  path="admin/reset-password"
                  element={<AdminResetPassword />}
                />
              </Route>

              {/* Onboarding & store creation (no layout) */}
              <Route path="/onboarding/step1" element={<Step1 />} />
              <Route path="/onboarding/step2" element={<Step2 />} />
              <Route path="/onboarding/step3" element={<Step3 />} />
              <Route path="/onboarding/step4" element={<Step4 />} />
              <Route path="/onboarding/step5" element={<Step5 />} />
              <Route path="/onboarding/step6" element={<Step6 />} />
              <Route path="/stores/create" element={<CreateStore />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route
                path="/subscription/renew"
                element={<RenewSubscription />}
              />
              <Route
                path="/subscription/upgrade-plan/:id"
                element={<UpgradePlan />}
              />

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
                path="/admin/overview"
                element={
                  <Suspense fallback={<Loader />}>
                    <OverviewPage />
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
              <Route
                path="/admin/notifications"
                element={
                  <Suspense fallback={<Loader />}>
                    <Notifications />
                  </Suspense>
                }
              />
              <Route
                path="/admin/admin-management"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminManagement />
                  </Suspense>
                }
              />
              <Route
                path="/admin/permissions"
                element={
                  <Suspense fallback={<Loader />}>
                    <Permissions />
                  </Suspense>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <Suspense fallback={<Loader />}>
                    <PaymentsPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/payment-gateways"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminPGPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/account"
                element={
                  <Suspense fallback={<Loader />}>
                    <AdminAccount />
                  </Suspense>
                }
              />

              <Route
                path="/admin/subscription-plans"
                element={
                  <Suspense fallback={<Loader />}>
                    <SubscriptionPlansPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/contact-messages"
                element={
                  <Suspense fallback={<Loader />}>
                    <ContactMessagesPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin/contact-messages/:uid"
                element={
                  <Suspense fallback={<Loader />}>
                    <ContactMessageDetailPage />
                  </Suspense>
                }
              />

              {/* Error pages */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </MaintenanceMode>
      </AppProvider>
    </QueryProvider>
  );
};

export default App;
