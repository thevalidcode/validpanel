import { type FC, useState } from "react";
import { HiMenu,} from "react-icons/hi";
import PageLinks from "./PageLinks";
import SignLinks from "./SignLinks";
import type { NavItem } from "../../../types/Nav.types";
import Overlay from "../general/Overlay";

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { label: "Home", path: "" },
    { label: "Pricing", path: "pricing" },
    { label: "FAQ", path: "faq" },
    { label: "Contact", path: "contact-us" },
  ];

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header className="bg-white sticky top-0 z-50">
        <div className="flex justify-between items-center py-4 px-[16px] md:px-[150px]">
          <PageLinks
            toLink=""
            title="ValidPanel"
            classes="text-[24px] font-bold text-[#6A0DAD]"
          />

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-[34px] text-[13.82px] font-[400]">
            {navItems.map(({ label, path }, i) => (
              <PageLinks key={'NavLink' + i} toLink={path} title={label} />
            ))}
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex space-x-2">
            <SignLinks onClick={handleClose} />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-3xl text-[var(--primary)] z-50 pointer"
            type="button"
          >
            <HiMenu />
          </button>
        </div>
      </header>

      {/* Overlay + Mobile Menu */}
      <Overlay
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        from="right"
      >
        <nav className="flex flex-col space-y-4 mt-6">
          {navItems.map(({ label, path }, i) => (
            <PageLinks
              key={i}
              toLink={path}
              title={label}
              click={() => setIsOpen(false)}
            />
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2">
          <SignLinks onClick={handleClose} />
        </div>
      </Overlay>
    </>
  );
};

export default Navbar;