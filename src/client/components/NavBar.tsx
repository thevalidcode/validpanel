import { useState, useEffect } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/useAppContext";
import { MdClose } from "react-icons/md";
import { FaBars } from "react-icons/fa";

const Navbar: FC = () => {
  const [open, setOpen] = useState(false);
  const { userInfo } = useAppContext();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact-us" },
  ];

  const mobileMenuVariant = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3"
            : "bg-white py-5 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Valid2.svg"
              alt="ValidPanel"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="text-sm font-medium text-gray-600 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!userInfo ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-[var(--color-primary)] px-5 py-2.5 rounded-[4px] shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all"
                >
                  Start Free
                </Link>
              </>
            ) : (
              <Link
                to="/analytics"
                className="text-sm font-semibold text-white bg-[var(--color-primary)] px-5 py-2.5 rounded-[4px] shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all"
              >
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-2xl text-gray-700 p-1"
          >
            {open ? <MdClose /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariant}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[40] md:hidden pt-24 px-6 flex flex-col"
          >
            <div className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center">
              <button
                title="close"
                type="button"
                onClick={() => setOpen(false)}
                className="text-[32px] text-gray-700 "
              >
                <MdClose />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mt-10">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto mb-10 flex flex-col gap-4">
              {!userInfo ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full py-4 rounded-[4px] border border-gray-200 text-center font-semibold text-gray-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="w-full py-4 rounded-[4px] bg-[var(--color-primary)] text-center font-semibold text-white shadow-xl"
                  >
                    Get Started Free
                  </Link>
                </>
              ) : (
                <Link
                  to="/analytics"
                  onClick={() => setOpen(false)}
                  className="w-full py-4 rounded-[4px] bg-[var(--color-primary)] text-center font-semibold text-white shadow-xl"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
