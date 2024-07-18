import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import LandingPage from "./client/pages/LandingPage";
import { Notify } from "./client/components/Notification";
import Login from "./client/pages/Login";
import Register from "./client/pages/Register";
import Onboarding from "./client/pages/Onboarding";
import ControlPanel from "./client/pages/ControlPanel";
import Dashboard from "./client/pages/Dashboard";
import Account from "./client/pages/Account";
import Panels from "./admin/pages/Panels";
import AdminLogin from "./admin/pages/AdminLogin";

function App() {
  return (
    <AppProvider>
      <Router>
        <Notify />
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/onboarding" exact element={<Onboarding />} />
          <Route
            path="/control-panel/:panelId"
            exact
            element={<ControlPanel />}
          />
          <Route
            path="/control-panel/:panelId/dashboard"
            exact
            element={<Dashboard />}
          />
          <Route
            path="/control-panel/:panelId/account"
            exact
            element={<Account />}
          />
          <Route path="/admin/panels" exact element={<Panels />} />
          <Route path="/admin/login" exact element={<AdminLogin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
