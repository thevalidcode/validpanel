import { type AnalyticsCardProps } from "./AnalyticsCard";
import RevenueTrend, { type TimeRange } from "./RevenueTrend";
import RecentStores from "./RecentStores";
import type { FC } from "react";
import AnalyticsCard from "./AnalyticsCard";
import StorePerformanceChart, {
  type StorePerformanceData,
} from "./StorePerformanceChart";

interface AnalyticsMobileView {
  summaryData: AnalyticsCardProps[];
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
      <div className="grid grid-cols-2 gap-6 md:hidden">
        {summaryData.map((data) => (
          <AnalyticsCard key={data.title} {...data} />
        ))}
      </div>
      <RevenueTrend dataSets={dataSets} range={range} setRange={setRange} />
      <div className="w-full">
        <StorePerformanceChart data={data} />
        <div className="flex justify-between items-center w-full ">
          {[
            { name: "Active", count: "120" },
            { name: "InActive", count: "8,500" },
          ].map((store) => (
            <div key={store.name} className="space-y-1 text-vgrey-text">
              <p className="">{store.name}</p>
              <p className="text-sm">{store.count}</p>
            </div>
          ))}
        </div>
      </div>

      <RecentStores />
    </div>
  );
};

export default AnalyticsMobileView;
