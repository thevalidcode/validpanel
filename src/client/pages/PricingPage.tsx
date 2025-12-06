import { useState } from "react";
import PricingHero from "../components/pricing/PricingHero";
import PricingToggle from "../components/pricing/PricingToggle";
import PricingCard from "../components/pricing/PricingCard";
import PricingTable from "../components/pricing/PricingTable";
import LaunchPrompt from "../components/LaunchPrompt";


export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  return (
    <div>
      <div className="md:flex px-[20px] py-20 md:items-end md:justify-between md:mx-auto md:w-full md:max-w-6xl">
        <PricingHero />
        <PricingToggle isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <PricingCard isAnnual={isAnnual} />
      </section>

      <section className="bg-gray-100 py-12">
        <div className="w-full max-w-7xl mx-auto px-4">
          <PricingTable />
        </div>
      </section>

      <LaunchPrompt />
    </div>
  );
}