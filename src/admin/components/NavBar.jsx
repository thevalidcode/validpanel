import React from "react";
import Logo from "../../assets/images/ValidPanel.png";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const isPanelRoute = location.pathname.startsWith("/admin/panels");
  return (
    <div className="advpnavbar">
      <img src={Logo} alt="logo" className="advpnavlogo" />
      <div className="advplinks">
        {isPanelRoute && (
          <React.Fragment>
            <Link to="/admin/panels">Panels</Link>
            <Link to="/admin/panels/users">Users</Link>
            <Link to="/admin/panels/orders">Panels Orders</Link>
            <Link to="/admin/users">VP Users</Link>
          </React.Fragment>
        )}
        {!isPanelRoute && (
          <React.Fragment>
            <Link to="/admin/panels">Panels</Link>
            <Link to="/admin/users">Users</Link>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default NavBar;
