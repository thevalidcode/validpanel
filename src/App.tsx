import { type FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ContactUs from "./client/pages/ContactUs";
import PricingPage from "./client/pages/PricingPage";
import FAQPage from "./client/pages/FAQPage";
import HomePage from "./client/pages/HomePage";
import Navbar from "./client/components/nav/NavBar";
import Footer from "./client/components/footer/Footer";

const App: FC = () => (
  <AppProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      <Footer />
    </Router>
  </AppProvider>
);

export default App;