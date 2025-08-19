import { type FC } from "react";
import PageLinks from "./PageLinks";
import type { SignLinksProps } from "../../../types/Nav.types";

const SignLinks: FC<SignLinksProps> = ({ onClick }) => (
  <div className="flex max-md:flex-col max-md:space-y-4  md:space-x-4 md:text-[10px]">
    <PageLinks
      toLink="login"
      title="Log In"
      classes="border border-[#5F0DB3] text-[#000000] btn-custom font-[500] flex justify-center items-center rounded-full md:w-[79px] h-[32px]"
      click={onClick}
    />
    <PageLinks
      toLink="register"
      title="Sign Up"
      classes="bg-[var(--primary)] text-white font-[500] btn-custom flex justify-center items-center rounded-full md:w-[79px] h-[32px]"
      click={onClick}
    />
  </div>
);

export default SignLinks;