import { type FC } from "react";
import FooterCopyright from "./FooterCopyright";
import FooterNewsletter from "./FooterNewsletter";

const Footer: FC = () => (
  <footer className="bg-[var(--primary)] text-white py-12 min-h-[515px]">
    <div className="container mt-12 px-[16px] md:px-[150px] grid md:grid-cols-3 gap-12">
      <div>
        <h4 className="text-lg font-bold mb-2">ValidPanel</h4>
        <p className="text-sm">
          Faster payments, expense reports done right. Budgeting made easy.
        </p>
      </div>
      <div>
        <h5 className="font-semibold mb-2">Pages</h5>
        <ul className="space-y-1 text-sm">
          <li>Homepage</li>
          <li>Pricing</li>
          <li>FAQ</li>
          <li>Contact</li>
        </ul>
      </div>
      <FooterNewsletter />
    </div>
    <FooterCopyright />
    {/* <p className="text-center text-xs mt-8">@2025 ValidPanel. All rights reserved.</p> */}
  </footer>
);

export default Footer;