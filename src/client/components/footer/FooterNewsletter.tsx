import { type FC } from "react";
import { FaPaperPlane } from "react-icons/fa";
import FooterSocial from "./FooterSocial";

const FooterNewsletter: FC = () => (
  <div>
    <div>
      <h5 className="font-semibold mb-4 uppercase">
        Subscribe to our Newsletter
      </h5>
      <p className="text-sm">
        <sup className="font-semibold">*</sup> Only valuable resource no bullshit
      </p>
      <div className="flex gap-4 items-end">
        <input
          type="email"
          placeholder="Enter your e-mail"
          className="mt-2 px-4 py-3 rounded-full text-black w-full bg-white outline-0"
        />
        <div className="h-[50px] px-4 rounded-full bg-black flex items-center py-3">
          <FaPaperPlane />
        </div>
      </div>
    </div>
    <FooterSocial />
  </div>
);

export default FooterNewsletter;