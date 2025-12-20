import PlatformActivity, { type TimeRange } from "./PlatformActivity";
import AllStores from "./AllStores";
import type { FC } from "react";
import PlanFeatureUsage, { type ChartData } from "./PlanFeatureUsage";
import AnalyticsSummaryCard, {
  type AnalyticsSummaryCardProps,
} from "./AnalyticsSummaryCard";
import type { Store } from "@/types";

interface AnalyticsMobileView {
  summaryData: AnalyticsSummaryCardProps[];
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  range: TimeRange;
  allStores: Store[];
  setRange: (value: TimeRange) => void;
  featuresData: ChartData[];
}

const AnalyticsMobileView: FC<AnalyticsMobileView> = ({
  summaryData,
  dataSets,
  range,
  allStores,
  setRange,
  featuresData,
}) => {
  return (
    <div className="md:hidden w-full space-y-10">
      <div className="grid grid-cols-2 w-full gap-4">
        {summaryData.map((data) => (
          <AnalyticsSummaryCard key={data.title} {...data} />
        ))}
      </div>
      <div className="flex flex-col gap-5 w-full">
        <PlatformActivity
          dataSets={dataSets}
          range={range}
          setRange={setRange}
        />
        <PlanFeatureUsage data={featuresData} />
      </div>

      {allStores.length > 0 && <AllStores stores={allStores} />}
    </div>
  );
};

export default AnalyticsMobileView;
