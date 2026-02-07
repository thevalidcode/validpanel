import { type FC } from "react";
import type { FooterSocialLinkProps } from "../../../types/Footer.types";

const FooterSocialLink: FC<FooterSocialLinkProps> = ({ icon, socialLink }) => (
  <a 
    href={socialLink}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-[var(--primary)] text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:scale-110"
  >
    {icon}
  </a>
);

export default FooterSocialLink;