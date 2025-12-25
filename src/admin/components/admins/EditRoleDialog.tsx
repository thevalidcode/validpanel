import { type FC, type FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Shield, ChevronRight, ChevronLeft } from "lucide-react";
import type { Role, Permission } from "@/types";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

export type DialogMode = "create" | "edit";

interface RoleForm {
  name: string;
  permissionIds: number[];
}

interface EditRoleDialogProps {
  open: boolean;
  mode: DialogMode;
  allPermissions: Permission[];
  initialValues?: Role;
  isLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: RoleForm) => void;
}

const EditRoleDialog: FC<EditRoleDialogProps> = ({
  open,
  mode,
  allPermissions,
  initialValues,
  isLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<RoleForm>({
    name: "",
    permissionIds: [],
  });

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({
        name: initialValues.name,
        permissionIds: initialValues.permissions.map((rp) => rp.permission.id),
      });
    } else {
      setForm({
        name: "",
        permissionIds: [],
      });
    }
    setCurrentStep(1);
  }, [mode, initialValues, open]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  };

  const handlePermissionToggle = (permissionId: number, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissionIds: checked
        ? [...prev.permissionIds, permissionId]
        : prev.permissionIds.filter((id) => id !== permissionId),
    }));
  };

  const canProceedToStep2 = form.name.trim() !== "";

  const handleNext = () => {
    if (currentStep === 1 && canProceedToStep2) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 2) {
      onSubmit(form);
    }
  };

  const stepDescriptions = {
    1: "Enter the name for the new role",
    2: "Select the permissions for this role",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">
                    Step {currentStep} of 2
                  </span>
                </div>
                <h3 className="text-lg font-semibold">
                  {mode === "create" ? "Create Role" : "Edit Role"}
                </h3>
                <p className="text-sm text-gray-500">
                  {stepDescriptions[currentStep]}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <Field
                      label="Role Name"
                      icon={<User className="w-4 h-4" />}
                    >
                      <input
                        name="name"
                        title="Role Name"
                        required
                        value={form.name}
                        onChange={handleNameChange}
                        placeholder="Enter role name"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </Field>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="text-sm text-gray-600 mb-4">
                      Select the permissions this role should have:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                      {allPermissions.map((permission) => (
                        <CustomCheckbox
                          key={permission.id}
                          checked={form.permissionIds.includes(permission.id)}
                          onChange={(checked) =>
                            handlePermissionToggle(permission.id, checked)
                          }
                          label={permission.name.replace(/_/g, " ")}
                          size="sm"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {currentStep === 2 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBack();
                    }}
                    disabled={isLoading}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                    disabled={!canProceedToStep2 || isLoading}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                  >
                    {mode === "edit" && isLoading
                      ? "Saving..."
                      : mode === "create" && isLoading
                      ? "Creating..."
                      : mode === "edit"
                      ? "Save Changes"
                      : "Create Role"}
                  </button>
                )}
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditRoleDialog;

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
