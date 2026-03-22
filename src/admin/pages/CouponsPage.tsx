import { useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Coupon } from "@/types";
import CouponsMobileView from "../components/coupons/CouponsMobileView";
import CouponsDesktopView from "../components/coupons/CouponsDesktopView";
import EditCouponDialog from "../components/coupons/EditCouponDialog";
import DeleteDialog from "@/components/DeleteDialog";
import {
  useGetCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "@/hooks/use-coupon";
import Layout from "../components/Layout";
import Loader from "@/components/Loader";

function CouponsPage() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit" | "duplicate";
    coupon?: Coupon;
  }>({
    open: false,
    mode: "create",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    coupon?: Coupon;
  }>({ open: false });

  const { data: couponsData, isLoading } = useGetCoupons();
  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const coupons = couponsData || [];

  const handleCreateCoupon = () => {
    setDialogState({ open: true, mode: "create" });
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setDialogState({ open: true, mode: "edit", coupon });
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setDeleteDialog({ open: true, coupon });
  };

  const handleDuplicateCoupon = (coupon: Coupon) => {
    setDialogState({ open: true, mode: "duplicate", coupon });
  };

  const confirmDelete = async () => {
    if (deleteDialog.coupon) {
      await deleteCouponMutation.mutateAsync(deleteDialog.coupon.uid);
      setDeleteDialog({ open: false });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (dialogState.mode === "create" || dialogState.mode === "duplicate") {
        await createCouponMutation.mutateAsync(data);
      } else if (dialogState.coupon) {
        await updateCouponMutation.mutateAsync({
          uid: dialogState.coupon.uid,
          ...data,
        });
      }
      setDialogState({ ...dialogState, open: false });
    } catch (error) {
      console.error("Failed to save coupon", error);
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Layout title="Coupons" description="Manage discount codes and promotions.">
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <div className="flex w-full flex-col md:flex-row md:items-center gap-3 bg-white px-5 py-3 rounded-[4px] border border-gray-200">
          <div className="relative flex-1 md:w-[60%]">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-200 outline-0 w-full h-full rounded-[4px] pr-3 pl-12 py-2 focus:ring-1 focus:ring-primary transition-all"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          <div className="flex gap-2 items-center justify-end flex-1">
            <button
              onClick={handleCreateCoupon}
              className="text-white flex gap-2 border bg-primary items-center w-fit hover:bg-primary/90 px-4 py-2 rounded-[4px] transition-all font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : (
          <div className="mt-5">
            <div className="hidden lg:block">
              <CouponsDesktopView
                coupons={filteredCoupons}
                handleAction={(uid, action) => {
                  const coupon = coupons.find((c) => c.uid === uid);
                  if (!coupon) return;
                  if (action === "Edit") handleEditCoupon(coupon);
                  if (action === "Delete") handleDeleteCoupon(coupon);
                  if (action === "Duplicate") handleDuplicateCoupon(coupon);
                }}
              />
            </div>
            <div className="lg:hidden">
              <CouponsMobileView
                coupons={filteredCoupons}
                handleAction={(uid, action) => {
                  const coupon = coupons.find((c) => c.uid === uid);
                  if (!coupon) return;
                  if (action === "Edit") handleEditCoupon(coupon);
                  if (action === "Delete") handleDeleteCoupon(coupon);
                  if (action === "Duplicate") handleDuplicateCoupon(coupon);
                }}
              />
            </div>
          </div>
        )}

        {/* Dialogs */}
        <EditCouponDialog
          open={dialogState.open}
          mode={dialogState.mode}
          initialValues={dialogState.coupon}
          isLoading={
            createCouponMutation.isPending || updateCouponMutation.isPending
          }
          onCancel={() => setDialogState({ ...dialogState, open: false })}
          onSubmit={handleSubmit}
        />

        <DeleteDialog
          open={deleteDialog.open}
          title="Delete Coupon"
          description={`Are you sure you want to delete coupon "${deleteDialog.coupon?.code}"? This action cannot be undone.`}
          onCancel={() => setDeleteDialog({ open: false })}
          onConfirm={confirmDelete}
          isLoading={deleteCouponMutation.isPending}
        />
      </div>
    </Layout>
  );
}

export default CouponsPage;
