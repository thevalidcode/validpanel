import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main error content */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
            Page Not Found
          </h2>

          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Oops! It seems the page you're looking for doesn't exist or has been
            moved. Don't worry, we're here to help!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary/90 transition duration-200 hover:shadow-lg"
            >
              Go to Home
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="inline-flex items-center justify-center rounded-lg bg-white border-2 border-primary px-8 py-3 text-base font-medium text-primary hover:bg-primary/5 transition duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Helpful suggestions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-8 mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What can you do?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                ✓
              </span>
              <span className="text-gray-700">
                Check the URL and make sure it's spelled correctly
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                ✓
              </span>
              <span className="text-gray-700">
                Return to the home page and navigate from there
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                ✓
              </span>
              <span className="text-gray-700">
                Contact our support team if you need assistance
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
