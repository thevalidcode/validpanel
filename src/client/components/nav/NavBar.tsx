import { useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../../context/useAppContext";
import { MdClose } from "react-icons/md";

const Navbar: FC = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAppContext();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact-us" },
  ];

  const mobileMenuVariant = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-white absolute top-0 z-50 shadow-sm h-[80px] w-full flex items-center">
        <div className="flex justify-between items-center h-full w-full py-0 px-[16px] md:px-[150px]">
          {/* Brand */}
          <Link to="/" className="flex items-center h-full overflow-hidden">
            <img
              src="Valid2.svg"
              alt="ValidPanel Logo"
              className="h-15 w-40 object-cover md:block hidden"
            />
            <p className="font-bold text-primary md:hidden block">ValidPanel</p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-[40px] text-[15px] font-medium text-gray-700">
            {navItems.map(({ label, path }, i) => (
              <Link
                key={i}
                to={path}
                className="hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex space-x-3">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="border border-primary text-primary px-5 py-2 rounded-full text-[15px] shadow-[0_4px_13.33px_rgba(106,13,173,0.25)]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-primary text-white px-5 py-2 rounded-full text-[15px] shadow-[0_4px_13.33px_rgba(106,13,173,0.25)]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            title="open"
            onClick={() => setOpen(!open)}
            className="md:hidden relative h-6 w-8 flex flex-col justify-between items-center"
          >
            <motion.span className="block h-[2px] bg-gray-700 w-full rounded" />
            <motion.span className="block h-[2px] bg-gray-700 w-full rounded" />
            <motion.span className="block h-[2px] bg-gray-700 w-full rounded" />
          </button>
        </div>
      </header>

      {/* MOBILE FULL SCREEN MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariant}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 h-full w-full bg-white text-gray-900 z-[999] md:hidden shadow-xl"
          >
            {/* Header inside drawer */}
            <div className="flex justify-between items-center px-5 pt-6 pb-4 border-b border-neutral-200">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center h-full overflow-hidden"
              >
                <img
                  src="Valid2.svg"
                  alt="ValidPanel Logo"
                  className="h-15 w-40 object-cover md:block hidden"
                />
                <p className="font-bold text-primary md:hidden block">
                  ValidPanel
                </p>
              </Link>

              <button
                type="button"
                title="close"
                onClick={() => setOpen(false)}
                className="text-[32px] text-gray-700"
              >
                <MdClose />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col mt-4">
              {navItems.map(({ label, path }, i) => (
                <Link
                  key={i}
                  to={path}
                  onClick={() => setOpen(false)}
                  className="flex justify-between items-center w-full text-left px-5 py-4 text-[17px] font-medium border-b border-neutral-200 hover:bg-gray-50 transition"
                >
                  {label}
                  <span className="text-[18px]">{">"}</span>
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            {!user && (
              <div className="mt-19 px-5 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="border border-primary text-primary py-3 rounded-4xl text-[16px] text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="bg-primary text-white py-3 rounded-4xl text-[16px] text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
