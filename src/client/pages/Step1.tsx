import React, { useEffect, useState } from "react";
import { ShoppingBag, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  getOnboardingDraft,
  setOnboardingDraft,
} from "@/utils/onboarding.utils";
import type { StoreType } from "@/types";
import OnboardingLayout from "../components/onboarding/OnboardingLayout";
import { FaArrowRight } from "react-icons/fa";

const StepOne: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<StoreType | null>(null);

  // Initialize from localStorage if draft exists
  useEffect(() => {
    const draft = getOnboardingDraft();
    if (draft?.storeType) {
      setSelected(draft.storeType || "SHOP");
    }
  }, []);

  const handleNext = (): void => {
    if (!selected) return;

    // Check if SHOP is selected
    if (selected === "SHOP") {
      toast.error("Shop is not available yet, please use a social media store for now");
      return;
    }

    setOnboardingDraft((prev) => ({
      ...prev,
      storeType: selected,
      completedSteps: [...new Set([...(prev.completedSteps ?? []), 1])],
    }));
    navigate("/onboarding/step2");
  };

  const handleSelect = (option: StoreType): void => {
    setSelected(option);
  };

  return (
    <OnboardingLayout
      title="Let’s Get Started"
      description="What type of store would you like to create"
      step={1}
      selected={!!selected}
      onNext={handleNext}
      nextButton={
        <>
          <span>Continue</span>
          <FaArrowRight />
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-6 lg:px-36 sm:px-14 pb-10 pt-6">
        {/* Shop Card */}
        <div
          onClick={() => handleSelect("SHOP")}
          className={`cursor-pointer bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl border-2 transition-all
              ${selected === "SHOP" ? "border-purple-600" : "border-gray-200"}`}
        >
          <div className="mx-auto bg-gradient-to-r from-purple-500 to-purple-700 w-14 h-14 flex items-center justify-center rounded-xl mb-4">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Shop</h3>
          <p className="text-gray-600 text-sm mb-4">
            Perfect for selling physical products. <br />
            Create a professional storefront with product catalogs, inventory
            management, and payment processing.
          </p>
          <div className="flex justify-center space-x-2">
            <span className="bg-[#DCFCE7] text-green-700 text-xs px-3 py-1 rounded-full">
              Physical Goods
            </span>
            <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs px-3 py-1 rounded-full">
              Inventory
            </span>
          </div>
        </div>

        {/* Social Media Store Card */}
        <div
          onClick={() => handleSelect("SOCIAL")}
          className={`cursor-pointer bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition-all border-2
              ${
                selected === "SOCIAL" ? "border-purple-600" : "border-gray-200"
              }`}
        >
          <div className="mx-auto bg-gradient-to-r from-pink-500 to-orange-400 w-14 h-14 flex items-center justify-center rounded-xl mb-4">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Social Media Store
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            Ideal for reselling online services and social media solutions.
            Offer Instagram followers, YouTube views, website traffic, and more
            digital services.
          </p>
          <div className="flex justify-center space-x-2 flex-wrap">
            <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
              Social Services
            </span>
            <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">
              Digital Marketing
            </span>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
              Reselling
            </span>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default StepOne;
