import { type FC } from "react";
import { NavLink } from "react-router-dom";
import type { PageLinksProps } from "../../../types/Nav.types";

const PageLinks: FC<PageLinksProps> = ({ toLink, title, classes, click }) => {
  const linkClass = "text-gray-700 hover:text-purple-700 transition font-medium pointer";
  const activeClass = "text-purple-700 font-bold";

  return (
    <NavLink
      to={`/${toLink}`}
      className={({ isActive }) => (classes ? classes : isActive ? `${linkClass} ${activeClass}` : linkClass)}
      onClick={click}
    >
      {title}
    </NavLink>
  );
};

export default PageLinks;