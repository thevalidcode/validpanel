import RevenueTrend, { type TimeRange } from "./RevenueTrend";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
