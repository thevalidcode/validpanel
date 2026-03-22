import { CopyPlus, Edit, Trash2 } from "lucide-react";
import { type FC } from "react";

interface CouponActionButtonsProps {
  handleAction: (action: "Edit" | "Delete" | "Duplicate") => void;
}

const CouponActionButtons: FC<CouponActionButtonsProps> = ({ handleAction }) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => handleAction("Duplicate")}
        className="p-1.5 text-gray-500 hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
        title="Duplicate Coupon"
      >
        <CopyPlus className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAction("Edit")}
        className="p-1.5 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        title="Edit Coupon"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAction("Delete")}
        className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
        title="Delete Coupon"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CouponActionButtons;
