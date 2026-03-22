import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import StoreSidebar from "./StoreSidebar";
import { useAppContext } from "@/context/useAppContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import Loader from "@/components/Loader";
import { getOnboardingDraft } from "@/utils/onboarding.utils";
import PlatformTour from "@/components/PlatformTour";
import { useGetUserByUid, useMarkTourAsSeen } from "@/hooks/use-user";

function Layout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (isMobile) return false; // mobile always starts closed
    const saved = localStorage.getItem("sidebarOpen");
    return saved ? JSON.parse(saved) : true; // desktop remembers state
  });

  const [showTour, setShowTour] = useState(false);
  const { userInfo, isAuthLoading, handleSetUserInfo } = useAppContext();
  const navigate = useNavigate();
  const { mutateAsync: markTourAsSeen } = useMarkTourAsSeen();
  const { data: userData } = useGetUserByUid(userInfo?.uid || "");

  useEffect(() => {
    if (isMobile) localStorage.setItem("sidebarOpen", JSON.stringify(false));
  }, [isMobile]);

  useEffect(() => {
    if (isAuthLoading) return;

    const draft = getOnboardingDraft();

    // Not logged in
    if (!userInfo) {
      navigate("/login");
      return;
    }

    // Onboarding already completed - check if user needs to see tour
    if (userInfo.onboardingStep === "COMPLETE") {
      // Show tour if user just completed onboarding and hasn't seen it yet
      if (!userInfo.hasSeenTour) {
        // Small delay to ensure user has landed properly
        const timer = setTimeout(() => {
          setShowTour(true);
        }, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Draft exists and has completed steps
    if (draft?.completedSteps && draft.completedSteps.length > 0) {
      const lastCompletedStep = Math.max(...draft.completedSteps);
      const nextStep = lastCompletedStep + 1;

      navigate(`/onboarding/step${nextStep}`);
      return;
    }

    // No draft or no completed steps
    navigate("/onboarding/step1");
  }, [isAuthLoading, userInfo, navigate]);

  useEffect(() => {
    if (userData) {
      // Merge with userData overriding userInfo fields
      handleSetUserInfo({
        ...userInfo,
        ...userData,
      });
    }
  }, [userData]);

  const handleTourComplete = async () => {
    setShowTour(false);
    try {
      await markTourAsSeen();
    } catch (error) {
      console.error("Failed to mark tour as complete:", error);
    }
  };

  const handleTourClose = () => {
    setShowTour(false);
  };

  if (isAuthLoading) {
    return <Loader />;
  }

  const toggleSidebar = (state?: boolean) => {
    // Only update localStorage for desktop (md+) so desktop remembers its state
    if (!isMobile) {
      setSidebarOpen((prev: boolean) => {
        const nextState = state ?? !prev;
        localStorage.setItem("sidebarOpen", JSON.stringify(nextState));
        return nextState;
      });
    } else {
      // Mobile toggle just updates state, not localStorage
      setSidebarOpen(state ?? !sidebarOpen);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-gray-200 bg-white border-b">
        <h1 className="text-xl font-bold text-purple-700">ValidPanel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600 hover:text-gray-800"
        >
          {sidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-80
  transform transition-transform duration-300 ease-in-out overflow-hidden
  ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-[100%] w-0"}`}
      >
        <StoreSidebar
          isMobile={isMobile}
          onNavClick={() => toggleSidebar(false)}
        />
      </aside>

      {/* Overlay (for mobile sidebar) */}
      {sidebarOpen && isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-gray-100/40 backdrop-blur-sm md:hidden z-50"
        ></div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isMobile ? "" : sidebarOpen ? "ml-64 " : ""
        }`}
      >
        {title && description && (
          <Header
            title={title}
            description={description}
            onToggleSidebar={() => toggleSidebar()}
            isSidebarOpen={sidebarOpen}
          />
        )}
        {children}
      </div>

      {/* Platform Tour */}
      <PlatformTour
        isOpen={showTour}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />
    </div>
  );
}

export default Layout;
