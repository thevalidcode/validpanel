import { Toaster } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton={true}
      duration={4000}
      visibleToasts={5}
      offset={16}
      gap={12}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group relative flex w-full max-w-[90vw] sm:max-w-md items-start gap-3 sm:gap-3.5 rounded-lg sm:rounded-xl bg-white p-3.5 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 transition-all duration-300 data-[mounted=true]:animate-in data-[closed=true]:animate-out data-[swipe=end]:animate-out data-[mounted=true]:slide-in-from-right-full data-[mounted=true]:fade-in-0 data-[closed=true]:slide-out-to-right-full data-[closed=true]:fade-out-0 data-[swipe=end]:slide-out-to-right-full hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] hover:scale-[1.02] data-[front=false]:scale-[0.97] data-[front=false]:opacity-80",
          title:
            "text-sm sm:text-[15px] font-semibold leading-tight text-gray-900",
          description: "text-xs sm:text-sm leading-relaxed text-gray-600 mt-1",
          actionButton:
            "ml-auto shrink-0 rounded-lg bg-primary px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-[#6a18d9] active:scale-95 shadow-sm",
          cancelButton:
            "shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-95",
          closeButton:
            "absolute right-2 top-2 sm:right-2.5 sm:top-2.5 rounded-md p-1 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100 active:scale-95 opacity-0 group-hover:opacity-100",
          success:
            "border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-white",
          error: "border-l-rose-500 bg-gradient-to-r from-rose-50/50 to-white",
          warning:
            "border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-white",
          info: "border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white",
          default:
            "border-l-primary bg-gradient-to-r from-purple-50/40 to-white",
          loading:
            "border-l-primary bg-gradient-to-r from-purple-50/40 to-white",
        },
      }}
      icons={{
        success: (
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600"
              strokeWidth={2.5}
            />
          </div>
        ),
        error: (
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-rose-100">
            <XCircle
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600"
              strokeWidth={2.5}
            />
          </div>
        ),
        warning: (
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600"
              strokeWidth={2.5}
            />
          </div>
        ),
        info: (
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-100">
            <Info
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600"
              strokeWidth={2.5}
            />
          </div>
        ),
        loading: (
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-purple-100">
            <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ),
      }}
    />
  );
}
