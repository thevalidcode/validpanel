import "../styles/footer.css";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="loclfooter">
      <div className="loclfootercont">
        <Link to="mailto:info@example.com">Contact Us</Link>
        <span>© {currentYear} Valid Panel. All rights reserved.</span>
      </div>
    </div>
  );
}

export default Footer;
