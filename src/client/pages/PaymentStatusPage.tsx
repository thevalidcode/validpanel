import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status")?.toLowerCase();
  const isManual = searchParams.get("platform")?.toLowerCase() === "manual";
  const message = searchParams.get("message");

  // Define content based on status
  const getStatusContent = () => {
    if (isManual) {
      return {
        icon: <Clock className="w-16 h-16 text-yellow-500" />,
        title: "Payment Under Review",
        description:
          "Your payment is currently being checked by our team. Your new subscription will be active once verified. We'll notify you via email when the process is complete.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    }

    switch (status) {
      case "success":
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
          title: "Payment Successful",
          description:
            "Thank you! Your payment has been processed successfully. Your subscription is now active and you can start enjoying all the features immediately.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "failed":
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: "Payment Failed",
          description:
            message ||
            "We were unable to process your payment. Please check your payment details and try again, or use a different payment method.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "pending":
        return {
          icon: <Clock className="w-16 h-16 text-blue-500" />,
          title: "Payment Processing",
          description:
            "Your payment is currently being processed. This may take a few moments. Please do not close this page or click back.",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-gray-400" />,
          title: "Unknown Status",
          description:
            "We couldn't determine the status of your payment. Please check your account or contact support.",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50">
      <AnimatedSection className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden text-center">
          {/* Status Header */}
          <div className={`p-10 flex flex-col items-center ${content.bgColor}`}>
            <div className="mb-6 p-4 bg-white rounded-full shadow-sm ring-1 ring-gray-100">
              {content.icon}
            </div>
            <h1 className={`text-2xl font-bold mb-3 ${content.color}`}>
              {content.title}
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              {content.description}
            </p>
          </div>

          {/* Actions */}
          <div className="p-8 bg-white border-t border-gray-50">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/subscription")}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/70 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-200 group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Subscription
              </button>

              {status === "failed" && (
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Try Another Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
