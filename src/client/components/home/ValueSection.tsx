import type { FC } from "react";

const ValueSection: FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 text-left items-center">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest mb-2">
              Designed for Growth
            </h3>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              More Than Just a Store
            </h2>
            <p className="text-gray-600 mb-6">
              ValidPanel isn't just a tool; it's a partner. We provide the
              infrastructure usually reserved for enterprise-level retail
              giants, scaled down for your agility.
            </p>
            <div className="h-1 w-20 bg-[var(--color-secondary)] rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-[4px] text-center">
              <span className="block text-3xl font-bold text-gray-900 mb-1">
                99.9%
              </span>
              <span className="text-sm text-gray-500">Uptime</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-[4px] text-center">
              <span className="block text-3xl font-bold text-gray-900 mb-1">
                Less than 1s
              </span>
              <span className="text-sm text-gray-500">Load Time</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-[4px] text-center col-span-2">
              <span className="block text-3xl font-bold text-gray-900 mb-1">
                24/7
              </span>
              <span className="text-sm text-gray-500">Support Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
