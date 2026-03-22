import { type FC } from "react";
import { FaGlobe, FaShieldAlt, FaBolt, FaHeadset } from "react-icons/fa";

const Momentum: FC = () => {
  return (
    <section className="py-12 border-b border-gray-100 bg-white hidden md:block ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <FaGlobe className="text-3xl text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">
                Global Reach
              </span>
              <span className="text-xs font-medium text-gray-500">
                Sell Anywhere, Anytime
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-3xl text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">
                Secure Payments
              </span>
              <span className="text-xs font-medium text-gray-500">
                Enterprise-Grade Security
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-3">
            <FaBolt className="text-3xl text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">
                Instant Delivery
              </span>
              <span className="text-xs font-medium text-gray-500">
                Automated Processing
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-3">
            <FaHeadset className="text-3xl text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800 leading-tight">
                Expert Support
              </span>
              <span className="text-xs font-medium text-gray-500">
                We're Here 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Momentum;
