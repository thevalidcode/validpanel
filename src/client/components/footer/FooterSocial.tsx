import { type FC } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import FooterSocialLink from "./FooterSocialLink";


const FooterSocial: FC = () => (
  <div>
    <h5 className="font-semibold mb-4 mt-2">Social Media</h5>
    <div className="flex space-x-4 px-2">
      {/* Replace # with real social link before production */}
      <FooterSocialLink icon={<FaFacebook size={24} />} socialLink="#" />
      <FooterSocialLink icon={<FaTwitter size={24} />} socialLink="#" />
      <FooterSocialLink icon={<FaLinkedin size={24} />} socialLink="#" />
      <FooterSocialLink icon={<FaInstagram size={24} />} socialLink="#" />
    </div>
  </div>
);

export default FooterSocial;