import { type FC } from "react";
import FooterCopyright from "./FooterCopyright";
import FooterNewsletter from "./FooterNewsletter";
import { Link } from "react-router-dom";

const Footer: FC = () => (
  <footer className="bg-[var(--primary)] text-white py-12 min-h-[515px]">
    <div className="container mt-12 px-[16px] md:px-[150px] grid md:grid-cols-3 gap-12">
      <div>
        <h4 className="text-lg font-bold mb-2">ValidPanel</h4>
        <p className="text-sm">
          Sell Smarter. Scale Faster. Manage Everything in One Panel.
        </p>
      </div>
      <div>
        <h5 className="font-semibold mb-2">Pages</h5>
        <ul className="space-y-1 text-sm">
          <li>
            <Link to="/">Homepage</Link>{" "}
          </li>
          <li>
            <Link to="/pricing">Pricing </Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact</Link>
          </li>
        </ul>
      </div>
      <FooterNewsletter />
    </div>
    <FooterCopyright />
    {/* <p className="text-center text-xs mt-8">@2025 ValidPanel. All rights reserved.</p> */}
  </footer>
);

export default Footer;
