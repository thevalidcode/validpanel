import { type FC } from "react";
import { Link } from "react-router-dom";

const FooterCopyright: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-gray-100 text-gray-600">
      <div className="px-[16px] md:px-[150px] py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} ValidPanel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms-of-service"
              className="hover:text-primary text-xs transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-primary text-xs transition-colors duration-200"
            >
              Privacy
            </Link>
            <a
              href="/contact-us"
              className="hover:text-primary text-xs transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCopyright;
