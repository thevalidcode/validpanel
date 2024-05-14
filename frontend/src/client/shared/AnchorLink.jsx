import { Link } from "react-router-dom";
import "../styles/link.css";

function AnchorLink({ to, name, target }) {
  return (
    <Link to={to} className="cllink" target={target}>
      {name}
    </Link>
  );
}

export default AnchorLink;
