import { useState } from "react";
import { Ban, Check, Edit2Icon, MoreVertical, Trash } from "lucide-react";
import type { FC } from "react";
import ActionMenu from "@/components/ui/ActionMenu";
import type { Admin, Role } from "@/types";
import RoleBadge from "@/components/ui/RoleBadge";
import AdminTabs from "./AdminTabs";
import { useSearchParams } from "react-router-dom";
import RolesView from "./RolesView";
import AdminsActivity from "./AdminsActivity";

interface AdminsMobileViewProps {
  admins: Admin[];
  roles: Role[];
  handleAction: (
    uid: string,
    action: "Delete" | "Ban" | "Approve" | "Edit"
  ) => void;
}

const AdminsMobileView: FC<AdminsMobileViewProps> = ({
  admins,
  roles,
  handleAction,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "admins";
  const [visibleCount, setVisibleCount] = useState(10);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };
  const visibleUsers = admins.slice(0, visibleCount);
  const hasMore = visibleCount < admins.length;

  const onHandleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="mt-6 space-y-4">
      <AdminTabs activeTab={activeTab} onChange={handleTabChange} />
      {activeTab === "admins" ? (
        <div className="w-full space-y-3">
          {visibleUsers.map((admin) => (
            <div
              key={admin.id}
              className="border border-t-4 border-gray-200 rounded-lg py-5 px-[17px] hover:border-primary transition-all flex justify-between items-start shadow-sm relative"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img
                    src={admin.image || "/Sarah.png"}
                    alt={admin.fullName}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{admin.fullName}</span>{" "}
                    <span className="text-gray-700">{admin.email}</span>{" "}
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <RoleBadge roles={[admin.role]} />{" "}
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      admin.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {admin.status}
                  </span>
                </div>
              </div>

              {/* Action Menu */}
              <ActionMenu
                icon={<MoreVertical className="text-gray-400" />}
                items={[
                  {
                    label: "Delete",
                    icon: <Trash className="w-4 h-4 text-red-700" />,
                    onClick: () => handleAction(admin.uid, "Delete"),
                  },
                  {
                    label: "Edit",
                    icon: <Edit2Icon className="w-4 h-4 text-blue-700" />,
                    onClick: () => handleAction(admin.uid, "Edit"),
                  },
                  ...(admin.status === "BANNED"
                    ? [
                        {
                          label: "Approve",
                          icon: <Check className="w-4 h-4 text-green-400" />,
                          onClick: () => handleAction(admin.uid, "Approve"),
                        },
                      ]
                    : [
                        {
                          label: "Ban",
                          icon: <Ban className="w-4 h-4 text-red-400" />,
                          onClick: () => handleAction(admin.uid, "Ban"),
                        },
                      ]),
                ]}
              />
            </div>
          ))}
        </div>
      ) : activeTab === "roles" ? (
        <RolesView roles={roles} />
      ) : (
        <AdminsActivity />
      )}

      {hasMore && (
        <button
          onClick={onHandleLoadMore}
          className="border border-purple-500 mt-8 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium"
        >
          Load More Users
        </button>
      )}
    </div>
  );
};

export default AdminsMobileView;
