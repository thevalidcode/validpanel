import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { type FC, useState, useRef } from "react";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { Link } from "react-router-dom";
import {
  FaStore,
  FaArrowRight,
  FaCheckCircle,
  FaBox,
} from "react-icons/fa";

const Hero: FC = () => {
  const [isLiveShopOpen, setIsLiveShopOpen] = useState(false);
  const [isSocialStoreOpen, setIsSocialStoreOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Logic
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Mouse Move Logic for 3D tilt
  const x = useSpring(0, { stiffness: 100, damping: 30 });
  const y = useSpring(0, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPct = (clientX / innerWidth - 0.5) * 20;
    const yPct = (clientY / innerHeight - 0.5) * 20;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20"
    >
      {/* Engineered Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient Orbs */}
      <motion.div
        style={{ y: y1, x: -100 }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
      />
      <motion.div
        style={{ y: y2, x: 100 }}
        className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-[100px] mix-blend-multiply pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div className="text-left space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight"
          >
            Create Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[#9c3aff]">
              Online Store
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-lg leading-relaxed"
          >
            The easiest way to sell products or social media services online. No
            coding skills required. Start your business today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-[4px] font-semibold text-base shadow-xl shadow-purple-500/20 hover:-translate-y-1 transition-transform flex items-center gap-2"
            >
              Start for Free <FaArrowRight />
            </Link>

            <button
              onClick={() => setIsLiveShopOpen(true)}
              className="px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-[4px] font-semibold hover:border-gray-400 transition-colors flex items-center gap-2"
            >
              <FaStore className="text-gray-400" /> Demo Store
            </button>
          </motion.div>

          <div className="flex gap-6 pt-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500" /> No Credit Card
            </span>
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500" /> Free to Start
            </span>
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-green-500" /> Instant Setup
            </span>
          </div>
        </div>

        {/* Right: Engineered UI Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{ rotateX: y, rotateY: x }}
            className="relative z-10 bg-white rounded-[4px] shadow-2xl border border-gray-200 p-2 max-w-md ml-auto"
          >
            {/* Fake Browser UI */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 mb-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-gray-100 rounded-[4px] h-6 w-full max-w-[200px] ml-4 animate-pulse" />
            </div>

            {/* Fake Dashboard Content */}
            <div className="p-4 grid gap-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                    Total Revenue
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    $124,500.00
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                  +12.5%
                </span>
              </div>
              {/* Simulated Chart */}
              <div className="h-[100px] w-full flex items-end gap-2 justify-between mt-4">
                {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-[var(--color-primary)] opacity-10 rounded-sm relative group cursor-pointer hover:opacity-20 transition-all"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 w-full bg-[var(--color-primary)] transition-all duration-500"
                      style={{
                        height: "0%",
                        animation: `grow 1s ease-out ${i * 0.1}s forwards`,
                      }}
                    />
                    <style>{`@keyframes grow { to { height: 100%; } }`}</style>
                  </div>
                ))}
              </div>

              {/* Floating Activity Notification */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
                className="absolute -left-16 bottom-8 bg-white p-4 rounded-[4px] shadow-xl border border-gray-100 flex items-center gap-3 pr-8 w-64"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <FaBox />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    New Order #2891
                  </div>
                  <div className="text-xs text-gray-500">
                    Just now • Mobile App
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative Elements behind */}
          <div className="absolute top-10 right-10 w-full h-full border border-dashed border-gray-300 rounded-[4px] -z-10" />
        </motion.div>
      </div>

      <ConfirmDialog
        open={isLiveShopOpen}
        title="Visit Live Shop Demo?"
        description="You are about to visit a live demo store powered by ValidPanel. This opens in a new tab."
        onConfirm={() => {
          window.open("https://validshop.validpanel.com", "_blank");
          setIsLiveShopOpen(false);
        }}
        onCancel={() => setIsLiveShopOpen(false)}
        confirmLabel="Visit Store"
      />

      <ConfirmDialog
        open={isSocialStoreOpen}
        title="Visit Social Store Demo?"
        description="See how ValidPanel powers social media commerce on validplug.com.ng"
        onConfirm={() => {
          window.open("https://validplug.com.ng", "_blank");
          setIsSocialStoreOpen(false);
        }}
        onCancel={() => setIsSocialStoreOpen(false)}
        confirmLabel="Visit Social Link"
      />
    </section>
  );
};

export default Hero;
