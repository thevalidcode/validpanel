import { type FC } from "react";
import PageLinks from "./PageLinks";
import type { SignLinksProps } from "../../../types/Nav.types";

const SignLinks: FC<SignLinksProps> = ({ onClick }) => (
  <div className="flex space-x-2 md:space-x-2">
    <PageLinks
      toLink="login"
      title="Log In"
      classes="border border-purple-700 text-purple-700 px-4 py-1 rounded-full"
      click={onClick}
    />
    <PageLinks
      toLink="register"
      title="Sign Up"
      classes="bg-purple-700 text-white px-4 py-1 rounded-full"
      click={onClick}
    />
  </div>
);

export default SignLinks;