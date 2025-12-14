import RevenueTrend, { type TimeRange } from "./RevenueTrend";
import RecentStores from "./RecentStores";
import type { FC } from "react";
import StorePerformanceChart, {
  type StorePerformanceData,
} from "./StorePerformanceChart";
import AnalyticsSummaryCard, {
  type AnalyticsSummaryCardProps,
} from "./AnalyticsSummaryCard";

interface AnalyticsMobileView {
  summaryData: AnalyticsSummaryCardProps[];
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  range: TimeRange;
  setRange: (value: TimeRange) => void;
  data: StorePerformanceData[];
}

const AnalyticsMobileView: FC<AnalyticsMobileView> = ({
  summaryData,
  dataSets,
  range,
  setRange,
  data,
}) => {
  return (
    <div className="md:hidden w-full space-y-10">
      <div className="grid grid-cols-2 w-full gap-4">
        {summaryData.map((data) => (
          <AnalyticsSummaryCard key={data.title} {...data} />
        ))}
      </div>
      <div className="flex flex-col gap-5 w-full">
        <RevenueTrend dataSets={dataSets} range={range} setRange={setRange} />
        <StorePerformanceChart data={data} />
      </div>

      <RecentStores />
    </div>
  );
};

export default AnalyticsMobileView;
