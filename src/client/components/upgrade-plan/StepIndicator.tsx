import { Check } from "lucide-react";

interface Props {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4">
        {[
          { num: 1, label: "Plan Selection" },
          { num: 2, label: "Payment" },
        ].map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.num
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step.num ? (
                <Check className="w-5 h-5" />
              ) : (
                step.num
              )}
            </div>
            <span className="ml-3 text-sm font-medium">
              {step.label}
            </span>
            {index < 1 && (
              <div
                className={`w-20 h-0.5 ml-4 ${
                  currentStep > step.num
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
