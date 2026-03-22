import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { paginate } from "@/utils/paginate";
import type { Coupon } from "@/types";
import CouponActionButtons from "./CouponActionButtons";
import QuickStats from "./QuickStats";
import { Search } from "lucide-react";

function formatValue(coupon: Coupon) {
  if (coupon.type === "FIXED") {
    return `${coupon.currency || "$"} ${coupon.value}`;
  }
  return `${coupon.value}%`;
}

interface CouponsDesktopViewProps {
  coupons: Coupon[];
  handleAction: (uid: string, action: "Delete" | "Edit" | "Duplicate") => void;
}

export default function CouponsDesktopView({
  coupons,
  handleAction,
}: CouponsDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const { data: paginatedCoupons } = paginate(
    coupons,
    currentPage,
    itemsPerPage,
  );

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {/* Coupons Table */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="overflow-x-auto border border-gray-200 rounded-[4px] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Usage</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCoupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center text-gray-500">
                      <p>No coupons found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {coupon.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatValue(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {coupon.usedCount} /{" "}
                      {coupon.maxUses ? coupon.maxUses : "∞"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <CouponActionButtons
                        handleAction={(action) =>
                          handleAction(coupon.uid, action)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={coupons.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <QuickStats
        title="Quick Stats"
        stats={[
          {
            icon: <Search className="w-5 h-5 text-primary" />,
            label: "Total Coupons",
            value: coupons.length,
          },
          {
            icon: <Search className="w-5 h-5 text-green-600" />,
            label: "Active Coupons",
            value: coupons.filter((c) => c.isActive).length,
          },
        ]}
      />
    </div>
  );
}
