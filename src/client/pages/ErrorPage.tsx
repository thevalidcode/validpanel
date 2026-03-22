import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  description?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 500,
  title = "Something Went Wrong",
  description = "We encountered an unexpected error. Our team has been notified and is working to fix it.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main error content */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-[4px] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            {statusCode}
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            {title}
          </h2>

          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            {description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-[4px] bg-white border-2 border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-[4px] bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 transition duration-200 hover:shadow-lg"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="inline-flex items-center justify-center rounded-[4px] bg-white border-2 border-primary px-8 py-3 text-base font-medium text-primary hover:bg-primary/5 transition duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Support information */}
        <div className="bg-white rounded-[4px] border border-gray-200 shadow-xs p-8 mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          <p className="text-gray-700 mb-6">
            If this problem persists, please contact our support team. We're
            available to help you resolve any issues as quickly as possible.
          </p>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-[4px] bg-primary/10 text-primary text-sm font-medium mr-3 flex-shrink-0">
                📧
              </span>
              <span className="text-gray-700">
                Email us at:{" "}
                <a
                  href="mailto:support@validpanel.com"
                  className="text-primary font-medium hover:underline"
                >
                  support@validpanel.com
                </a>
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-[4px] bg-primary/10 text-primary text-sm font-medium mr-3 flex-shrink-0">
                💬
              </span>
              <span className="text-gray-700">
                Use our{" "}
                <button
                  onClick={() => navigate("/contact-us")}
                  className="text-primary font-medium hover:underline"
                >
                  contact form
                </button>{" "}
                to reach out
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3 flex-shrink-0">
                ❓
              </span>
              <span className="text-gray-700">
                Check our{" "}
                <button
                  onClick={() => navigate("/faq")}
                  className="text-primary font-medium hover:underline"
                >
                  FAQ section
                </button>{" "}
                for common issues
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
