import PlatFormActivity, { type TimeRange } from "./PlatformActivity";
import type { FC } from "react";
import AnalyticsSummaryCard, {
  type AnalyticsSummaryCardProps,
} from "./AnalyticsSummaryCard";
import PlanFeatureUsage, { type ChartData } from "./PlanFeatureUsage";
import AllStoresTable from "./AllStoresTable";
import type { Store } from "@/types";

interface AnalyticsDesktopViewProps {
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  summaryData: AnalyticsSummaryCardProps[];
  featuresData: ChartData[];
  allStoresData: Store[];
  range: TimeRange;
  setRange: (value: TimeRange) => void;
}

const AnalyticsDesktopView: FC<AnalyticsDesktopViewProps> = ({
  dataSets,
  range,
  summaryData,
  featuresData,
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
        <PlatFormActivity
          dataSets={dataSets}
          range={range}
          setRange={setRange}
        />
        <PlanFeatureUsage data={featuresData} />
      </div>

      {allStoresData.length > 0 && <AllStoresTable data={allStoresData} />}
    </div>
  );
};

export default AnalyticsDesktopView;
