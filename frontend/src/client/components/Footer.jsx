import { useContext } from "react";
import "../styles/footer.css";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { siteTitle } = useContext(AppContext);
  return (
    <div className="loclfooter">
      <div className="loclfootercont">
        <Link to="mailto:info@example.com">Contact Us</Link>
        <span>
          © {currentYear} {siteTitle}. All rights reserved.
        </span>
      </div>
    </div>
  );
}

export default Footer;
