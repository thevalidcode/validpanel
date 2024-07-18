import Logo from "../../assets/images/ValidPanel.png";
import "../styles/navbar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="advpnavbar">
      <img src={Logo} alt="logo" className="advpnavlogo" />
      <div className="advplinks">
        <Link to="/admin/panels">Panels</Link>
      </div>
    </div>
  );
}

export default NavBar;
