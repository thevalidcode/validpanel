import { Bell } from "lucide-react";
import RevenueTrend, { type TimeRange } from "../RevenueTrend";
import type { FC } from "react";
import AnalyticsSummaryCard, {
  type AnalyticsSummaryCardProps,
} from "./AnalyticsSummaryCard";
import StorePerformanceChart, {
  type StorePerformanceData,
} from "./StorePerformanceChart";
import AllStoresTable, { type StoreData } from "./AllStoresTable";

interface AnalyticsDesktopViewProps {
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  summaryData: AnalyticsSummaryCardProps[];
  storePerformanceData: StorePerformanceData[];
  allStoresData: StoreData[];
  range: TimeRange;
  setRange: (value: TimeRange) => void;
}

const AnalyticsDesktopView: FC<AnalyticsDesktopViewProps> = ({
  dataSets,
  range,
  summaryData,
  storePerformanceData,
  allStoresData,
  setRange,
}) => {
  return (
    <div className="w-full mx-auto space-y-5 hidden md:block ">
      {/* Header */}
      <div className=" w-full flex h-20.5 px-6 justify-between items-center border border-[#E5E7EB] bg-white ">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Store Analytics</h1>
          <p className="text-sm text-gray-500">
            Track your store performance and revenue
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <Bell className="text-[#9CA3AF]" />
          <img
            src="/Sarah.png"
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((data) => (
          <AnalyticsSummaryCard key={data.title} {...data} />
        ))}
      </div>

      <div className="w-full grid grid-cols-2 gap-5">
        <RevenueTrend dataSets={dataSets} range={range} setRange={setRange} />
        <StorePerformanceChart data={storePerformanceData} />
      </div>

      <AllStoresTable data={allStoresData} />
    </div>
  );
};

export default AnalyticsDesktopView;
