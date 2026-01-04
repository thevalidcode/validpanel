import type { FC } from "react";
import { CreditCard, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

import PGFilters, { type PGFiltersState } from "./PGFilters";
import PGSummaryCard from "./PGSummaryCard";
import RecentPGTable, { type PGTableRow } from "./RecentPGTable";

/* -------------------- PROPS -------------------- */

interface PGDesktopViewProps {
  pgs: PGTableRow[];

  filters: PGFiltersState;
  onFiltersChange: (next: Partial<PGFiltersState>) => void;

  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  summaryCounts: {
    total: number;
    active: number;
    inactive: number;
    successRate?: string;
  };
}

/* -------------------- COMPONENT -------------------- */

const PGDesktopView: FC<PGDesktopViewProps> = ({
  pgs,
  filters,
  onFiltersChange,
  currentPage,
  totalPages,
  onPageChange,
  summaryCounts,
}) => {
  return (
    <div className="hidden md:block w-full space-y-6 pt-5">
      {/* FILTERS */}
      <PGFilters filters={filters} onChange={onFiltersChange} />

      {/* SUMMARY */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PGSummaryCard
          title="Total Gateways"
          value={summaryCounts.total.toString()}
          icon={<CreditCard className="text-blue-600" size={20} />}
          iconBgColor="bg-blue-100"
          textColor="text-gray-900"
        />

        <PGSummaryCard
          title="Active Gateways"
          value={summaryCounts.active.toString()}
          icon={<CheckCircle2 className="text-green-600" size={20} />}
          iconBgColor="bg-green-100"
          textColor="text-green-600"
        />

        <PGSummaryCard
          title="Inactive Gateways"
          value={summaryCounts.inactive.toString()}
          icon={<XCircle className="text-red-600" size={20} />}
          iconBgColor="bg-red-100"
          textColor="text-red-600"
        />

        <PGSummaryCard
          title="Success Rate"
          value={summaryCounts.successRate ?? "—"}
          icon={<TrendingUp className="text-purple-600" size={20} />}
          iconBgColor="bg-purple-100"
          textColor="text-purple-600"
        />
      </div>

      {/* TABLE */}
      <div className="px-6">
        <RecentPGTable
          rows={pgs}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PGDesktopView;
