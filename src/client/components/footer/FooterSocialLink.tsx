import { type FC } from "react";
import { Link } from "react-router-dom";
import type { FooterSocialLinkProps } from "../../../types/Footer.types";

const FooterSocialLink: FC<FooterSocialLinkProps> = ({ icon, socialLink }) => (
  <Link to={socialLink}>{icon}</Link>
);

export default FooterSocialLink;