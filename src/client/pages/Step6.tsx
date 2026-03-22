import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowLeft } from "react-icons/fa";
import {
  clearOnboardingDraft,
  getOnboardingDraft,
} from "@/utils/onboarding.utils";
import { useGetUserSubscriptionPlanByUid } from "@/hooks/use-subscription-plan";
import { useOnboardingSetupStore } from "@/hooks/use-user";

const Step6: React.FC = () => {
  const navigate = useNavigate();
  const draft = getOnboardingDraft();
  const [searchParams] = useSearchParams();
  const subscriptionId = parseInt(searchParams.get("subscriptionId") || "");
  const { data: subscriptionPlan } = useGetUserSubscriptionPlanByUid(
    draft?.planUid || ""
  );
  const { mutateAsync: setupStore, isPending } = useOnboardingSetupStore();

  useEffect(() => {
    if (!subscriptionId) {
      console.warn("Subscription ID missing from URL");
    }
  }, [subscriptionId]);

  const handleBack = (): void => {
    navigate("/onboarding/step5");
  };

  const handleLaunchStore = async (): Promise<void> => {
    if (isPending) return;
    if (
      !draft?.storeType ||
      !draft?.color ||
      !draft?.domain ||
      !draft?.storeName
    )
      return;

    await setupStore({
      type: draft?.storeType,
      subscriptionId,
      name: draft.storeName,
      logoUrl: draft.logoUrl,
      domain: draft.domain,
      color: draft.color,
    });

    clearOnboardingDraft();
    navigate("/stores");
  };

  return (
    <OnboardingLayout
      step={7}
      totalSteps={7}
      title="You’re All Set!"
      description="Your online business is just one click away from going live."
      selected={!!subscriptionId && !isPending}
      onNext={handleLaunchStore}
      onBack={handleBack}
      nextButton={
        <div className="flex items-center gap-2 animate-pulse hover:animate-none">
          <img src="/Jet.svg" alt="Jet" />{" "}
          <span>{isPending ? "Launching..." : "Launch Store"}</span>
        </div>
      }
      backButton={
        <>
          <FaArrowLeft />
          <span>Back</span>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-[4px] w-full grid md:grid-cols-2 gap-6 mx-auto"
      >
        {/* Left Column */}
        <div className="bg-white rounded-[4px] p-6 shadow-lg flex flex-col w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-[#6A0DAD] to-[#8B5CF6] rounded-[4px] p-3 mb-4">
              <Check className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              You’re All Set!
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
              Review your details and launch your store. Your online business is
              just one click away from going live.
            </p>
          </div>

          {/* Store Summary */}
          <div className="bg-purple-50 rounded-[4px] p-6 shadow-inner mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Store Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                {
                  img: "/Store.svg",
                  title: "Store Type",
                  desc: draft?.storeType,
                  bg: "bg-[#DBEAFE]",
                },
                {
                  img: draft?.logoUrl || "/Logo.svg",
                  title: "Logo",
                  desc: "Custom Design",
                  bg: "bg-[#FFEDD5]",
                },
                {
                  img: "/Fashion.svg",
                  title: "Store Name",
                  desc: draft?.storeName,
                  bg: "bg-[#F3E8FF]",
                },
                {
                  img: "/Card2.svg",
                  title: "Payment",
                  desc: `${draft?.selectedPayment}`,
                  bg: "bg-[#D1FAE5]",
                },
                {
                  img: "/URL.svg",
                  title: "Domain",
                  desc: draft?.domain,
                  bg: "bg-[#DCFCE7]",
                },
                {
                  img: "/Star.svg",
                  title: "Features",
                  desc: subscriptionPlan?.name || "Free Plan",
                  bg: "bg-[#E0E7FF]",
                },
              ].map(({ img, title, desc, bg }, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border border-transparent hover:border-gray-100 rounded-[4px] transition-all">
                  <div className={`p-2.5 ${bg} rounded-[4px] shrink-0`}>
                    <img src={img} alt={title} className="w-5 h-5 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-500 text-xs mb-0.5">{title}</p>
                    <p
                      className="font-semibold text-gray-800 truncate"
                      title={desc || ""}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Next Steps */}
          {/* Pre-Launch Checklist */}
          <div className="bg-white border border-gray-200 rounded-[4px] p-5 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">
              Pre-Launch Checklist
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Store configuration completed",
                "Payment gateway connected",
                "Domain configured",
                "SSL certificate active",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="bg-green-500 text-white rounded-[4px] w-5 h-5 flex items-center justify-center">
                    <Check size={16} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-r from-[#8B5CF60D] to-[#6A0DAD0D] rounded-[4px] p-5 shadow-sm border border-purple-400 w-full">
            <h4 className="font-semibold text-gray-800 mb-3">What’s Next?</h4>
            <ul className="space-y-3 text-sm">
              {[
                {
                  num: 1,
                  title: "Add Products",
                  desc: "Start adding your products to the store",
                },
                {
                  num: 2,
                  title: "Configure Payment methods",
                  desc: "Set up your payment method options",
                },
                {
                  num: 3,
                  title: "Marketing Setup",
                  desc: "Plan how to promote your store",
                },
              ].map(({ num, title, desc }) => (
                <li key={num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-[4px] bg-purple-300 border border-purple-400 flex items-center justify-center text-sm font-semibold text-purple-600">
                    {num}
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {title}
                    {"\n"}
                    {desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="bg-white border border-gray-200 rounded-[4px] p-5 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <div className="bg-blue-50 rounded-[4px] p-2">
                <img src="/Help.svg" alt="Help" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-800">Need Help?</h4>
            <p className="text-sm text-gray-500 mb-3">
              Our support team is here to help you get started
            </p>
            <button
              onClick={() => navigate("/contact-us")}
              className="text-[#2563EB] hover:animate-pulse font-medium text-sm bg-[#EFF6FF] px-20 py-2 rounded-[4px] transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
};

export default Step6;
