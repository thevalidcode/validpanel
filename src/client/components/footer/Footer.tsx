import { type FC } from "react";
import FooterCopyright from "./FooterCopyright";
import FooterNewsletter from "./FooterNewsletter";
import { Link } from "react-router-dom";
import FooterSocial from "./FooterSocial";

const Footer: FC = () => (
  <footer className="bg-gradient-to-br from-[#7d1efe] to-[#5c0fb3] text-white">
    {/* Main Footer Content */}
    <div className="px-[16px] md:px-[150px] pt-16 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Brand Section */}
        <div className="lg:col-span-4">
          <div className="flex items-center mb-4">
            <h3 className="text-2xl font-bold">ValidPanel</h3>
          </div>
          <p className="text-purple-100 text-sm leading-relaxed mb-6">
            Sell Smarter. Scale Faster. Manage Everything in One Panel.
          </p>
          <p className="text-purple-200 text-sm leading-relaxed">
            The all-in-one platform for creating and managing your online store. Launch in minutes, manage effortlessly, and scale your business with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                Homepage
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
          <ul className="space-y-3">
            <li>
              <Link to="/terms-of-service" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-purple-100 hover:text-white transition-colors duration-200 text-sm flex items-center group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-white mr-0 group-hover:mr-2 transition-all duration-200"></span>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="lg:col-span-4">
          <FooterNewsletter />
          <div className="mt-6">
            <FooterSocial />
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <FooterCopyright />
  </footer>
);

export default Footer;
