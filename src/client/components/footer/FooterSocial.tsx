import { type FC } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import FooterSocialLink from "./FooterSocialLink";

const FooterSocial: FC = () => (
  <div>
    <h4 className="text-gray-900 font-bold mb-4">Connect With Us</h4>
    <div className="flex space-x-3">
      <FooterSocialLink
        icon={<FaFacebook size={18} />}
        socialLink="https://facebook.com/validpanel"
      />
      <FooterSocialLink
        icon={<FaTwitter size={18} />}
        socialLink="https://x.com/validpanel"
      />
      <FooterSocialLink
        icon={<FaLinkedin size={18} />}
        socialLink="https://linkedin.com/company/validpanel"
      />
      <FooterSocialLink
        icon={<FaInstagram size={18} />}
        socialLink="https://instagram.com/validpanel"
      />
    </div>
  </div>
);

export default FooterSocial;
