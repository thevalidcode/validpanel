import { type FC } from "react";
import FooterCopyright from "./FooterCopyright";
import FooterNewsletter from "./FooterNewsletter";
import { Link } from "react-router-dom";
import FooterSocial from "./FooterSocial";
import { FaRocket } from "react-icons/fa";

const Footer: FC = () => (
  <footer className="bg-white border-t border-gray-100 text-gray-600 font-sans pt-16 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <h3 className="text-3xl font-extrabold text-[var(--color-primary)] mb-6 tracking-tight">
            ValidPanel
          </h3>
          <p className="text-sm leading-relaxed mb-6 text-gray-500">
            Build your online store in seconds. Whether you sell products or
            social media services, we provide the tools you need to grow.
          </p>
          <div className="text-[var(--color-primary)]">
            <FooterSocial />
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-gray-900 font-bold mb-6">Platform</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-gray-900 font-bold mb-6">Legal & Support</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link
                to="/terms-of-service"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <FooterNewsletter />
          <div className="mt-8 pt-8 border-t border-gray-100">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:text-[#5c0fb3] transition-colors"
            >
              <FaRocket /> Start Building Free
            </Link>
          </div>
        </div>
      </div>
      <FooterCopyright />
    </div>
  </footer>
);

export default Footer;
