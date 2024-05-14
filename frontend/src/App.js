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

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Notify />
        </div>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                <LandingPage />
              </>
            }
          />
          <Route
            path="/login"
            exact
            element={
              <>
                <Login />
              </>
            }
          />
          <Route
            path="/register"
            exact
            element={
              <>
                <Register />
              </>
            }
          />
          <Route
            path="/onboarding"
            exact
            element={
              <>
                <Onboarding />
              </>
            }
          />
          <Route
            path="/control-panel/:panelId"
            exact
            element={
              <>
                <ControlPanel />
              </>
            }
          />
          <Route
            path="/control-panel/:panelId/dashboard"
            exact
            element={
              <>
                <Dashboard />
              </>
            }
          />
          <Route
            path="/control-panel/:panelId/account"
            exact
            element={
              <>
                <Account />
              </>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
