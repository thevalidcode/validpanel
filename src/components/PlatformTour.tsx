import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaChartLine,
  FaCreditCard,
  FaTags,
  FaEnvelope,
} from "react-icons/fa";

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  route: string;
  features: string[];
  image?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Welcome to Your Dashboard",
    description:
      "Let's take a quick tour to help you get started with ValidPanel. We'll show you the key features and how to make the most of your platform.",
    icon: <FaChartLine className="w-8 h-8 text-purple-600" />,
    route: "/analytics",
    features: [
      "Track your store performance",
      "Monitor platform activity",
      "View subscription details",
      "Get insights at a glance",
    ],
  },
  {
    id: 2,
    title: "Analytics Dashboard",
    description:
      "Your Analytics page gives you a complete overview of your business performance. Track stores, monitor activity, and stay on top of your metrics.",
    icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
    route: "/analytics",
    features: [
      "View total and active stores",
      "Monitor platform events and activity",
      "Check subscription status",
      "Track next billing date",
    ],
    image: "/analytics-preview.svg",
  },
  {
    id: 3,
    title: "Manage Your Stores",
    description:
      "The Stores page is your central hub for managing all your online stores. Create new stores, edit existing ones, and monitor their status.",
    icon: <FaStore className="w-8 h-8 text-green-600" />,
    route: "/stores",
    features: [
      "Create unlimited stores (based on plan)",
      "Customize store appearance",
      "Configure domains and settings",
      "Monitor store performance",
    ],
    image: "/stores-preview.svg",
  },
  {
    id: 4,
    title: "Subscription & Billing",
    description:
      "Manage your subscription, view billing history, and upgrade your plan anytime. Keep track of payments and invoices in one place.",
    icon: <FaCreditCard className="w-8 h-8 text-purple-600" />,
    route: "/subscription",
    features: [
      "View current plan details",
      "Upgrade or downgrade plans",
      "Access billing history",
      "Download invoices",
    ],
    image: "/subscription-preview.svg",
  },
  {
    id: 5,
    title: "Explore Pricing Plans",
    description:
      "Check out available plans and features. Choose the perfect plan for your business needs and scale as you grow.",
    icon: <FaTags className="w-8 h-8 text-orange-600" />,
    route: "/pricing",
    features: [
      "Compare plan features",
      "View pricing options",
      "Switch plans anytime",
      "Monthly or annual billing",
    ],
    image: "/pricing-preview.svg",
  },
  {
    id: 6,
    title: "Need Help? Contact Us",
    description:
      "Have questions or need support? Our team is here to help. Reach out anytime through the Contact page.",
    icon: <FaEnvelope className="w-8 h-8 text-indigo-600" />,
    route: "/contact-us",
    features: [
      "Get quick support",
      "Submit inquiries",
      "Track your messages",
      "Fast response time",
    ],
    image: "/contact-preview.svg",
  },
];

interface PlatformTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function PlatformTour({
  isOpen,
  onClose,
  onComplete,
}: PlatformTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50;

    if (info.offset.x > swipeThreshold) {
      // Swiped right - go to previous
      handlePrevious();
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - go to next
      handleNext();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
    // Navigate to analytics after completing tour
    navigate("/analytics");
  };

  const handleVisitPage = () => {
    const step = tourSteps[currentStep];
    navigate(step.route);
    onClose();
  };

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[9998]"
            onClick={handleSkip}
          />

          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Header */}
              <div className="relative bg-white border-b border-gray-200 p-6">
                <button
                  title="skip"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    {currentTourStep.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        Step {currentStep + 1} of {tourSteps.length}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentTourStep.title}
                    </h2>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-purple-600 rounded-full"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {currentTourStep.description}
                </p>

                {/* Features List */}
                <div className="bg-purple-50 rounded-lg border border-purple-100 p-5 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-purple-600" />
                    Key Features
                  </h3>
                  <div className="space-y-2.5">
                    {currentTourStep.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2.5 text-sm text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mb-4">
                  {tourSteps.map((_, index) => (
                    <button
                      title="step"
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? "w-8 bg-purple-600"
                          : index < currentStep
                            ? "w-1.5 bg-purple-400"
                            : "w-1.5 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-600 hover:text-gray-800 font-medium transition"
                  >
                    Skip Tour
                  </button>

                  <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                      <button
                        onClick={handlePrevious}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition"
                      >
                        Previous
                      </button>
                    )}

                    {currentStep > 0 && currentStep < tourSteps.length - 1 && (
                      <button
                        onClick={handleVisitPage}
                        className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                      >
                        Visit Page
                      </button>
                    )}

                    <button
                      onClick={handleNext}
                      className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center gap-2"
                    >
                      {currentStep === tourSteps.length - 1 ? (
                        <>
                          <Check className="w-4 h-4" />
                          Get Started
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
