import { type FC } from "react";
import { useAppContext } from "../../../context/AppContext";

const FooterCopyright: FC = () => {
  const currentYear = new Date().getFullYear();
  const { siteTitle } = useAppContext();

  return (
    <div className="flex justify-center mt-8">
      <div className="loclfootercont">
        {/* <Link to="mailto:contact@validpanel.com">Contact Us</Link> */}
        <span>
          © {currentYear} {siteTitle}. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default FooterCopyright;