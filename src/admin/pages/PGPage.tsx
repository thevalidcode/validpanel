import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import Layout from "@/admin/components/Layout";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import EditPGDialog from "@/admin/components/payment-gateway/EditPGDialog";
import PGDesktopView from "@/admin/components/payment-gateway/PGDesktopView";
import PGMobileView from "@/admin/components/payment-gateway/PGMobileView";
import DeleteDialog from "@/components/DeleteDialog";
import CustomSelect, { type Option } from "@/components/ui/CustomSelect";
import type { PaymentGateway, PaymentGatewayStatus } from "@/types";
import {
  useGetAdminPaymentGateways,
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
  useDeletePaymentGateway,
} from "@/hooks/use-payment-gateway";

const STATUS_OPTIONS: Option<PaymentGatewayStatus | "All">[] = [
  { label: "All Status", value: "All" },
  { label: "Active", value: "ACTIVE" },
  { label: "Disabled", value: "DISABLED" },
];

const PAGE_SIZE = 10;

const PGPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PaymentGatewayStatus | "All"
  >("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<PaymentGateway | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [signature, setSignature] = useState<string>("");

  // Hooks
  const { data: gateways, isLoading } = useGetAdminPaymentGateways();
  const { mutateAsync: createPG, isPending: isCreatePending } =
    useCreatePaymentGateway();
  const { mutateAsync: updatePG, isPending: isUpdatePending } =
    useUpdatePaymentGateway();
  const { mutateAsync: deletePG, isPending: isDeletePending } =
    useDeletePaymentGateway();

  // Filter
  const filteredGateways = useMemo(() => {
    if (!gateways) return [];
    return gateways.filter((pg) => {
      const matchesSearch =
        pg.name.toLowerCase().includes(search.toLowerCase()) ||
        pg.description?.toLowerCase().includes(search.toLowerCase()) ||
        pg.platform.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || pg.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [gateways, search, statusFilter]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredGateways.length / PAGE_SIZE)
  );
  const paginatedGateways = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredGateways.slice(start, start + PAGE_SIZE);
  }, [filteredGateways, currentPage]);

  // Handlers
  const handleCreate = async (data: any) => {
    try {
      const result = await createPG(data);
      setDialogMode(null);
      setSignature(result.signature);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const result = await updatePG(data);
      setDialogMode(null);
      setSignature(result.signature);
      setEditTarget(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePG(deleteTarget);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (pg: PaymentGateway) => {
    setEditTarget(pg);
    setDialogMode("edit");
  };

  if (isLoading) return <Loader />;

  return (
    <Layout
      title="Payment Gateways"
      description="Manage and configure all payment gateways."
    >
      <div className="py-5 px-6 w-full">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 bg-white px-5 py-3 rounded-lg border border-gray-200 mb-6"
        >
          <div className="flex-1 relative flex items-center gap-3">
            <div className="flex gap-4 flex-2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, platform..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition text-sm"
              />
            </div>
            <div className="sm:w-40">
              <CustomSelect
                options={STATUS_OPTIONS}
                value={STATUS_OPTIONS.find((s) => s.value === statusFilter)}
                onChange={(option) => {
                  if (Array.isArray(option)) return;
                  const selectedStatus = option.value;
                  if (
                    selectedStatus !== "All" &&
                    (selectedStatus === "ACTIVE" ||
                      selectedStatus === "DISABLED")
                  ) {
                    setStatusFilter(selectedStatus);
                    setCurrentPage(1);
                  } else if (selectedStatus === "All") {
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }
                }}
                placeholder="Filter by status"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDialogMode("create")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#6a18d9] transition font-medium"
          >
            <Plus size={18} />
            Add Gateway
          </motion.button>
        </motion.div>

        {/* Mobile View */}
        {paginatedGateways.length > 0 ? (
          <>
            <div className="block md:hidden">
              <PGMobileView
                gateways={paginatedGateways}
                onEdit={handleEdit}
                onDelete={(uid) => setDeleteTarget(uid)}
              />
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <PGDesktopView
                gateways={paginatedGateways}
                onEdit={handleEdit}
                onDelete={(uid) => setDeleteTarget(uid)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <NotFound title="No payment gateways found." className="mt-8" />
        )}
      </div>

      {/* Dialogs */}
      <EditPGDialog
        open={!!dialogMode}
        mode={dialogMode || "create"}
        initialValues={
          editTarget
            ? {
                uid: editTarget.uid,
                platform: editTarget.platform,
                name: editTarget.name,
                image: editTarget.image,
                min: editTarget.min,
                max: editTarget.max,
                secretKey: "",
                description: editTarget.description || "",
                content: editTarget.content || "",
                status: editTarget.status || "ACTIVE",
              }
            : undefined
        }
        isLoading={isCreatePending || isUpdatePending}
        signature={signature}
        onSubmit={dialogMode === "create" ? handleCreate : handleUpdate}
        onCancel={() => {
          setDialogMode(null);
          setEditTarget(undefined);
        }}
        onSignatureClose={() => setSignature("")}
      />

      <DeleteDialog
        open={!!deleteTarget}
        title="Delete Payment Gateway"
        description="This payment gateway will be permanently deleted. This action cannot be undone."
        isLoading={isDeletePending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default PGPage;
