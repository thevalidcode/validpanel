import { motion, useAnimation, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAppContext } from "@/context/useAppContext";
import { useNavigate } from "react-router-dom";

// Components
import Hero from "../components/home/Hero";
import Momentum from "../components/home/Momentum";
import Steps from "../components/home/Steps";
import HowItWorksFlow from "../components/home/HowItWorksFlow";
import Features from "../components/home/Features";
import StoreManagementShowcase from "../components/home/StoreManagementShowcase";
import LivePreviewSection from "../components/home/LivePreviewSection";
import LocalToGlobal from "../components/home/LocalToGlobal";
import ValueSection from "../components/home/ValueSection";
import Testimonials from "../components/home/Testimonials";
import LaunchPrompt from "../components/LaunchPrompt";
import CouponShowcase from "@/components/coupons/CouponShowcase";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for "premium" feel
    },
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" }); // Trigger once for cleaner scroll

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      <motion.div variants={childVariants}>{children}</motion.div>
    </motion.div>
  );
};

export default function HomePage() {
  const { userInfo, isAuthLoading } = useAppContext();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isAuthLoading && userInfo) {
      navigate("/analytics");
    }
  }, [isAuthLoading, userInfo, navigate]);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* 1. HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.div>

      {/* 2. MOMENTUM / STATS */}
      <AnimatedSection>
        <Momentum />
      </AnimatedSection>

      {/* 3. GET STARTED IN 6 SIMPLE STEPS (UNTOUCHED) */}
      <AnimatedSection className="bg-white">
        <Steps />
      </AnimatedSection>

      {/* 4. INTERACTIVE FLOW / HOW IT WORKS */}
      <AnimatedSection>
        <HowItWorksFlow />
      </AnimatedSection>

      {/* 5. FEATURES */}
      <AnimatedSection>
        <Features />
      </AnimatedSection>

      {/* 6. INTERACTIVE STORE MANAGEMENT */}
      <AnimatedSection className="bg-gray-50">
        <StoreManagementShowcase />
      </AnimatedSection>

      {/* 7. LIVE PREVIEW */}
      <AnimatedSection>
        <LivePreviewSection />
      </AnimatedSection>

      {/* 8. LOCAL → GLOBAL */}
      <AnimatedSection className="bg-white">
        <LocalToGlobal />
      </AnimatedSection>

      {/* 9. VALUE / POSITIONING */}
      <AnimatedSection>
        <ValueSection />
      </AnimatedSection>

      <AnimatedSection>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CouponShowcase
            context="HOME_PAGE"
            variant="spotlight"
            title="Special Offers For New Stores"
            autoOpenDelayMs={20000}
            autoOpenStorageKey="home_coupon_spotlight_seen_v1"
            signupPath="/register"
          />
        </div>
      </AnimatedSection>

      {/* 9.5 TESTIMONIALS (Consistency Check) */}
      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      {/* 10. FINAL CTA */}
      <AnimatedSection>
        <LaunchPrompt />
      </AnimatedSection>
    </div>
  );
}
