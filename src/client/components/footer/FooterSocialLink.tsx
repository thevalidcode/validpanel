import { type FC } from "react";
import type { FooterSocialLinkProps } from "../../../types/Footer.types";

const FooterSocialLink: FC<FooterSocialLinkProps> = ({ icon, socialLink }) => (
  <a
    href={socialLink}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-[4px] bg-gray-50 text-gray-400 border border-gray-100 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center transition-all duration-200 hover:shadow-md hover:shadow-purple-500/20"
  >
    {icon}
  </a>
);

export default FooterSocialLink;
