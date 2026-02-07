import { useState } from "react";
import PricingHero from "../components/pricing/PricingHero";
import PricingToggle from "../components/pricing/PricingToggle";
import PricingCard from "../components/pricing/PricingCard";
import PricingTable from "../components/pricing/PricingTable";
import LaunchPrompt from "../components/LaunchPrompt";
import CurrencySwitcher from "@/components/CurrencySwitcher";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  return (
    <div>
      <div className="md:flex px-[20px] py-24 md:items-end md:justify-between md:mx-auto md:w-full md:max-w-6xl">
        <PricingHero />
        <div className="flex flex-col gap-6 items-end">
          <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
          <CurrencySwitcher className="justify-end" />
        </div>
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 mb-20">
        <PricingCard isAnnual={isAnnual} />
      </section>

      <section className="bg-gray-100 py-6">
        <div className="w-full max-w-7xl mx-auto px-4">
          <PricingTable />
        </div>
      </section>

      <LaunchPrompt />
    </div>
  );
}
