import { type FC, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface ChartData {
  name: string;
  value: number | null;
}

interface PlanFeatureUsageProps {
  data: ChartData[];
  title?: string;
}

const PlanFeatureUsage: FC<PlanFeatureUsageProps> = ({
  data,
  title = "Plan Usage",
}) => {
  // Memoize chart data for performance
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: "Usage",
          data: data.map((d) => d.value),
          backgroundColor: "#8B5CF6",
          borderRadius: 6,
          barPercentage: 0.6,
        },
      ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
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
          grid: {
            display: false,
          },
          ticks: {
            color: "#4B5563",
            font: { size: 12 },
          },
        },
        y: {
          grid: {
            drawBorder: false,
            color: "#E5E7EB",
          },
          ticks: {
            color: "#4B5563",
            font: { size: 12 },
            callback: (value: any) => {
              if (value >= 1000) return `${value / 1000}k`;
              return value;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="bg-white p-6 rounded-[4px] shadow-sm w-full border border-gray-200">
      <h2 className="text-lg w-full font-bold text-gray-800 mb-4">{title}</h2>
      <div className="h-72 w-full">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PlanFeatureUsage;
