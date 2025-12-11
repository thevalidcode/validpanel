import { type FC } from "react";

const FooterCopyright: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex justify-center mt-40">
      <div className="loclfootercont">
        {/* <Link to="mailto:contact@validpanel.com">Contact Us</Link> */}
        <span>
          © {currentYear} Valid Panel. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default FooterCopyright;