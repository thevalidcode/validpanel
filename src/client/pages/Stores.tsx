import { type FC, useMemo, useState } from "react";
import MyStores from "../components/stores/MyStores";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Plus } from "lucide-react";
import CouponShowcase from "@/components/coupons/CouponShowcase";
import { toast } from "sonner";
import CreateResellerStorefrontModal from "../components/stores/StartResellingModal";
import { useGetUserActiveSubscription } from "@/hooks/use-subscription";

const StoreLayout: FC = () => {
  const navigate = useNavigate();
  const [isResellerModalOpen, setIsResellerModalOpen] = useState(false);
  const { data: activeSubscription } = useGetUserActiveSubscription();

  const canUseReselling = useMemo(
    () => Boolean(activeSubscription?.plan?.features?.reselling),
    [activeSubscription],
  );

  const handleCreateStore = (): void => {
    navigate("/stores/create");
  };

  const handleStartReselling = (): void => {
    if (!canUseReselling) {
      toast.error("Reselling is not available on your current plan");
      navigate("/subscription");
      return;
    }

    setIsResellerModalOpen(true);
  };

  return (
    <Layout
      title="My Stores"
      description="View and manage all your created shops and social media stores."
    >
      <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Stores</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage your digital storefronts from one place.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={handleStartReselling}
                className="border border-gray-300 bg-white text-gray-800 px-5 py-2.5 rounded-[4px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm active:scale-95 duration-200"
              >
                Start Reselling
              </button>
              <button
                type="button"
                onClick={handleCreateStore}
                className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-[4px] hover:bg-[var(--color-primary)]/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm active:scale-95 duration-200"
              >
                <Plus size={18} strokeWidth={2.5} />
                Create New Store
              </button>
            </div>
          </div>

          <CouponShowcase
            context="STORES_PAGE"
            variant="compact"
            className="mb-6"
          />

          <div className="bg-white rounded-[4px] border border-gray-200 shadow-sm overflow-hidden p-4">
            <MyStores />
          </div>
        </AnimatedSection>
      </main>

      <CreateResellerStorefrontModal
        open={isResellerModalOpen}
        onClose={() => setIsResellerModalOpen(false)}
      />
    </Layout>
  );
};

export default StoreLayout;
