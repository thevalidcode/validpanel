import { useState } from "react";
import PricingHero from "../components/pricing/PricingHero";
import PricingToggle from "../components/pricing/PricingToggle";
import PricingCard from "../components/pricing/PricingCard";
import PricingTable from "../components/pricing/PricingTable";
import LaunchPrompt from "../components/LaunchPrompt";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import AnimatedSection from "@/components/AnimatedSection";
import Testimonials from "../components/home/Testimonials";
import CouponShowcase from "@/components/coupons/CouponShowcase";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <PricingHero />

      {/* Controls Section */}
      <AnimatedSection className="relative z-20 mb-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />

          <div className="flex items-center gap-3 bg-white p-1.5 px-3 rounded-[4px] shadow-sm border border-gray-200">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Currency:
            </span>
            <CurrencySwitcher />
          </div>

          <div className="w-full max-w-5xl">
            <CouponShowcase
              context="PRICING_PAGE"
              variant="banner"
              title="Limited Time Offers"
              maxItems={3}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing Cards */}
      <section className="w-full max-w-7xl mx-auto px-4 mb-32">
        <PricingCard isAnnual={isAnnual} />
      </section>

      {/* Comparison Table */}
      <AnimatedSection className="bg-white py-24 border-t border-gray-100">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Compare Features
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A detailed breakdown of what's included in each plan.
            </p>
          </div>
          <PricingTable />
        </div>
      </AnimatedSection>

      {/* Social Proof */}
      <div className="py-20 bg-gray-50/50">
        <Testimonials />
      </div>

      {/* Final CTA */}
      <LaunchPrompt />
    </div>
  );
}
