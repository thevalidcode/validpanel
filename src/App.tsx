import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Pages with Navbar & Footer
import HomePage from "./client/pages/HomePage";
import FAQPage from "./client/pages/FAQPage";
import PricingPage from "./client/pages/PricingPage";
import ContactUs from "./client/pages/ContactUs";
import LoginPage from "./client/pages/LoginPage";
import RegisterPage from "./client/pages/RegisterPage";
import StoresPage from "./client/pages/StoresPage";
import CreateStorePage from "./client/pages/CreateStorePage";

// Step pages (no Navbar or Footer)
import Step1 from "./client/pages/StoreOne";
import Step2 from "./client/pages/Store2";
import Step3 from "./client/pages/Step3";
import Step4 from "./client/pages/Step4";
import Step5 from "./client/pages/Step5";
import Step6 from "./client/pages/Step6";
import Step7 from "./client/pages/Step7";
import Store from "./client/pages/User";
// import DashLayout from "./Layout/DashLayout";
import Dashlayout from "./Layout/DashLayout";
import StoreLayout from "./client/components/User/StoreLayout";

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
            <Route path="store" element={<StoresPage />} />
            <Route path="create-store" element={<CreateStorePage />} />
          </Route>

          {/* Routes without layout */}
          <Route path="/step1" element={<Step1 />} />
          <Route path="/step2" element={<Step2 />} />
          <Route path="/step3" element={<Step3 />} />
          <Route path="/step4" element={<Step4 />} />
          <Route path="/step5" element={<Step5 />} />
          <Route path="/step6" element={<Step6 />} />
          <Route path="/step7" element={<Step7 />} />
          <Route path="/user" element={<Store />} />
          <Route path="/dashboard" element={<StoreLayout />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
