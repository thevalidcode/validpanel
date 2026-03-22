import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
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

      {/* Enterprise / Custom Plan CTA */}
      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 mb-32">
        <div className="relative overflow-hidden rounded-[8px] border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg transition-all hover:shadow-xl md:p-12">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[var(--color-primary)] to-purple-400" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-[4px] bg-purple-50 px-3 py-1 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                <Building2 className="h-3.5 w-3.5" />
                <span>Enterprise</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl">
                For large organizations requiring dedicated infrastructure,
                custom integrations, and SLA-backed support. We'll build a plan
                that fits your scale.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-[4px] border border-gray-200 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Custom Limits
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-[4px] border border-gray-200 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Dedicated Account Manager
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-[4px] border border-gray-200 shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                  Priority Formatting
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                to="/contact-us"
                className="group relative inline-flex items-center justify-center gap-2 rounded-[4px] bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Book a Demo
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-3 text-center text-xs text-gray-500 font-medium">
                No commitment required
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

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
