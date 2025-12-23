import { useState } from "react";
import type { UserWithStoreCount } from "@/hooks/use-user";
import { Ban, Check, MoreVertical, Trash } from "lucide-react";
import type { FC } from "react";
import ActionMenu from "@/components/ui/ActionMenu";

interface UsersMobileViewProps {
  users: UserWithStoreCount[];
  handleAction: (
    userUids: string[],
    action: "Delete" | "Ban" | "Approve"
  ) => void;
}

const UsersMobileView: FC<UsersMobileViewProps> = ({ users, handleAction }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const visibleUsers = users.slice(0, visibleCount);
  const hasMore = visibleCount < users.length;

  const onHandleLoadMore = () => setVisibleCount((prev) => prev + 10);

  return (
    <div className="mt-6 space-y-4">
      <div className="w-full space-y-3">
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="border border-t-4 border-gray-200 rounded-lg py-5 px-[17px] hover:border-primary transition-all flex justify-between items-start shadow-sm relative"
          >
            <div className="space-y-4">
              <p className="font-medium text-gray-900">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex gap-2">
                <span className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full">
                  {user.storesCount} {user.storesCount > 1 ? "Stores" : "Store"}
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            {/* Action Menu */}
            <ActionMenu
              icon={<MoreVertical className="text-gray-400" />}
              items={[
                {
                  label: "Delete",
                  icon: <Trash className="w-4 h-4" />,
                  onClick: () => handleAction([user.uid], "Delete"),
                },
                ...(user.status === "BANNED"
                  ? [
                      {
                        label: "Approve",
                        icon: <Check className="w-4 h-4" />,
                        onClick: () => handleAction([user.uid], "Approve"),
                      },
                    ]
                  : [
                      {
                        label: "Ban",
                        icon: <Ban className="w-4 h-4" />,
                        onClick: () => handleAction([user.uid], "Ban"),
                      },
                    ]),
              ]}
            />
          </div>
        ))}
      </div>

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

export default UsersMobileView;
