import { type FC } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { type Coupon } from "../../../types/models/coupon";
import CouponActionButtons from "./CouponActionButtons";
import QuickStats from "./QuickStats";

interface CouponsMobileViewProps {
  coupons: Coupon[];
  handleAction: (id: string, action: "Edit" | "Delete" | "Duplicate") => void;
}

const CouponsMobileView: FC<CouponsMobileViewProps> = ({
  coupons,
  handleAction,
}) => {
  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500 text-sm">No coupons found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.uid}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {coupon.code}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {coupon.type === "FIXED"
                    ? `${coupon.currency || "$"} ${coupon.value}`
                    : `${coupon.value}%`}{" "}
                  OFF
                </p>
              </div>
              <CouponActionButtons
                handleAction={(action) => handleAction(coupon.uid, action)}
              />
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">Expires</span>
                <span className="font-medium text-gray-900">
                  {coupon.expiresAt
                    ? format(new Date(coupon.expiresAt), "MMM d, yyyy")
                    : "Never"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Usage Limit</span>
                <span className="font-medium text-gray-900">
                  {coupon.maxUses ?? "Unlimited"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Used Count</span>
                <span className="font-medium text-gray-900">
                  {coupon.usedCount}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Status</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    coupon.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
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
};

export default CouponsMobileView;
