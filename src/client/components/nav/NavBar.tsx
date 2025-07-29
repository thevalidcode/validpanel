import { type FC, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import PageLinks from "./PageLinks";
import SignLinks from "./SignLinks";
import type { NavItem } from "../../../types/Nav.types";

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { label: "Home", path: "" },
    { label: "Pricing", path: "pricing" },
    { label: "FAQ", path: "faq" },
    { label: "Contact", path: "contact-us" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center py-4 px-6 md:px-10">
          <PageLinks
            toLink=""
            title="ValidPanel"
            classes="text-2xl font-bold text-purple-700"
          />

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ label, path }, i) => (
              <PageLinks key={i} toLink={path} title={label} />
            ))}
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex space-x-2">
            <SignLinks />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-3xl text-purple-700 z-50 pointer"
            type="button"
          >
            <HiMenu />
          </button>
        </div>
      </header>

      {/* Overlay + Mobile Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Side Drawer Menu */}
          <div className="fixed top-0 right-0 h-full w-[40vw] max-w-[300px] bg-white z-50 p-6 shadow-lg transition-transform duration-300 transform animate-slideIn">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl text-purple-700 mb-4 pointer"
              type="button"
            >
              <HiX />
            </button>

            {/* Mobile Menu */}
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
              <SignLinks />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;