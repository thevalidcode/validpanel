import { FaCheckCircle } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import type { PricingPlanCardProps } from "../../../types/Pricing.types";

function PricingPlanCard({ plan, isAnnual }: PricingPlanCardProps) {
  return (
    <div className="w-full mb-6 px-0">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl shadow-[#8000ff40] p-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left */}
          <div className="w-full md:w-2/3">
            <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
            <p className="uppercase text-sm text-gray-500 mb-4">{plan.idealFor}</p>
            <ul className="space-y-3 mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheckCircle className="text-gray-800 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MdOutlineKeyboardDoubleArrowDown className="text-xl text-gray-400" />
          </div>

          {/* Right */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end justify-between gap-4 text-center md:text-right">
            <div>
              <p className="text-gray-500 text-sm">Starting at</p>
              <h2 className="text-3xl font-bold">
                ${isAnnual ? plan.annually : plan.monthly} <span className="text-sm text-gray-500">USD</span>
              </h2>
              <p className="text-sm text-gray-500">{!isAnnual ? "BILLED PER MONTH" : "BILLED PER YEAR"}</p>
            </div>
            <Link
              to={plan.link}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#6f2cff] hover:bg-[#5a23cc] text-white rounded-full transition"
            >
              {plan.buttonText} <GoArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPlanCard;