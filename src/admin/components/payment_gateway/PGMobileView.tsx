import type { FC } from "react";
import PGCard, { type PG } from "./PGCard";
import type { PGFiltersState } from "./PGFilters";

/* -------------------- PROPS -------------------- */

interface PGMobileViewProps {
  pgs: PG[];
  filters: PGFiltersState;
  onFiltersChange: (next: Partial<PGFiltersState>) => void;
}

/* -------------------- STATUS TABS -------------------- */

const STATUS_TABS: { label: string; value: PGFiltersState["status"] }[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Sandbox", value: "SANDBOX" },
];

/* -------------------- COMPONENT -------------------- */

const PGMobileView: FC<PGMobileViewProps> = ({
  pgs,
  filters,
  onFiltersChange,
}) => {
  return (
    <div className="md:hidden px-4 pt-5 space-y-5">
      {/* SEARCH */}
      <input
        type="text"
        value={filters.search}
        onChange={(e) => onFiltersChange({ search: e.target.value })}
        placeholder="Search gateways..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* STATUS TABS */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.value;

          return (
            <button
              key={tab.value}
              onClick={() => onFiltersChange({ status: tab.value })}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border ${
                isActive
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* GATEWAY LIST */}
      <div className="space-y-4">
        {pgs.map((pg) => (
          <PGCard key={pg.id} pg={pg} />
        ))}
      </div>

      {/* ADD NEW GATEWAY */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center space-y-4">
        <div className="text-gray-400 text-2xl">＋</div>
        <p className="font-medium text-gray-900">Add New Gateway</p>
        <p className="text-sm text-gray-500">
          Connect a new payment provider to accept payments
        </p>
        <button className="w-full bg-purple-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-purple-700">
          Browse Gateways
        </button>
      </div>
    </div>
  );
};

export default PGMobileView;
