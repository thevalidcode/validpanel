import { motion } from "framer-motion";
import type { FC } from "react";
import {
  FaStore,
  FaChartLine,
  FaRobot,
  FaLock,
  FaPalette,
  FaTruck,
} from "react-icons/fa";

const featuresData = [
  {
    icon: <FaStore />,
    title: "Store Builder",
    desc: "Drag, drop, and launch. No coding required.",
  },
  {
    icon: <FaChartLine />,
    title: "Analytics",
    desc: "Track every click, sale, and visitor in real-time.",
  },
  {
    icon: <FaRobot />,
    title: "Automation",
    desc: "Auto-process orders and sync inventory.",
  },
  {
    icon: <FaLock />,
    title: "Secure Payments",
    desc: "Bank-grade encryption for every transaction.",
  },
  {
    icon: <FaPalette />,
    title: "Custom Branding",
    desc: "Make it yours with custom domains and themes.",
  },
  {
    icon: <FaTruck />,
    title: "Logistics",
    desc: "Integrated shipping partners for global delivery.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Features: FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-gray-600">
            Powerful tools that grow with your business, from your first sale to
            your millionth.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresData.map((feature, i) => (
            <motion.div variants={item} key={i}>
              <div className="h-full bg-white p-8 rounded-[4px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-purple-50 rounded-[4px] flex items-center justify-center text-[var(--color-primary)] text-2xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
