import { FaCheckCircle } from "react-icons/fa";
import type { ComparisonTableRow } from "../../../types/Pricing.types";

export default function PricingTable() {
  return (
    <div>
      <h2 className="text-center text-2xl font-semibold mb-6">Compare plan & features</h2>
      <ComparisonTable />
    </div>
  );
}

function ComparisonTable() {
  const data: ComparisonTableRow[] = [
    { category: "Stores allowed", free: "1", standard: "5", pro: "Unlimited" },
    { category: "Custom Domain", free: "-", standard: "✔", pro: "✔" },
    { category: "Unlimited Products", free: "-", standard: "✔", pro: "✔" },
    { category: "Support Type", free: "Basic", standard: "Chat", pro: "Priority" },
    { category: "Reseller Tools", free: "-", standard: "-", pro: "✔" },
    { category: "Payment Integration", free: "✔", standard: "✔", pro: "✔" },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="text-gray-600">
            <th className="py-3">Category</th>
            <th className="py-3">Free</th>
            <th className="py-3">Standard</th>
            <th className="py-3">Pro</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="">
              <td className="py-2">{row.category}</td>
              <td className="py-2">
                {row.free === "✔" ? <FaCheckCircle className="text-purple-600 text-xl" /> : row.free}
              </td>
              <td className="py-2">
                {row.standard === "✔" ? <FaCheckCircle className="text-purple-600 text-xl" /> : row.standard}
              </td>
              <td className="py-2">
                {row.pro === "✔" ? <FaCheckCircle className="text-purple-600 text-xl" /> : row.pro}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}