import { type FC, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import CustomSelect from "@/components/ui/CustomSelect";

export type TimeRange = "Last 7 days" | "Last 30 days" | "Last 90 days";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PlatformActivityProps {
  dataSets: Record<TimeRange, { name: string; value: number }[]>;
  range: TimeRange;
  setRange: (value: TimeRange) => void;
}

const PlatformActivity: FC<PlatformActivityProps> = ({
  dataSets,
  range,
  setRange,
}) => {
  const data = dataSets[range];

  const chartData = useMemo(() => {
    const labels = data.map((d) => d.name);
    const values = data.map((d) => d.value);

    return {
      labels,
      datasets: [
        {
          label: "Events",
          data: values,
          borderColor: "#6366F1",
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, "rgba(99,102,241,0.4)");
            gradient.addColorStop(1, "rgba(99,102,241,0)");
            return gradient;
          },
          fill: true,
          tension: 0.4, // smooth curves
          pointRadius: 4,
          pointBackgroundColor: "#6366F1",
        },
      ],
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#4B5563",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 8,
          cornerRadius: 6,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#4B5563", font: { size: 12 } },
        },
        y: {
          grid: { drawBorder: false, color: "#E5E7EB" },
          ticks: { color: "#4B5563", font: { size: 12 } },
        },
      },
    }),
    []
  );

  return (
    <div className="w-full bg-white border border-gray-200 mx-auto rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg w-full font-semibold text-gray-800">
          Platform Activity
        </h2>

        <CustomSelect<TimeRange>
          value={range ? { label: range, value: range } : undefined}
          onChange={(opt) =>
            setRange(Array.isArray(opt) ? opt[0].value : opt.value)
          }
          options={[
            { label: "Last 7 days", value: "Last 7 days" },
            { label: "Last 30 days", value: "Last 30 days" },
            { label: "Last 90 days", value: "Last 90 days" },
          ]}
          className="w-full"
        />
      </div>

      <div className="h-60 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PlatformActivity;
