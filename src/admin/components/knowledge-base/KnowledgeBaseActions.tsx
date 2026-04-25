import { Edit2Icon, MoreVertical, Trash2 } from "lucide-react";
import ActionMenu from "@/components/ui/ActionMenu";
import type { KnowledgeBaseArticle } from "@/types";

interface KnowledgeBaseActionsProps {
  article: KnowledgeBaseArticle;
  handleAction: (uid: string, action: "Delete" | "Edit") => void;
}

export default function KnowledgeBaseActions({
  article,
  handleAction,
}: KnowledgeBaseActionsProps) {
  return (
    <ActionMenu
      icon={<MoreVertical className="text-gray-400" />}
      items={[
        {
          label: "Edit",
          icon: <Edit2Icon className="w-4 h-4 text-blue-700" />,
          onClick: () => handleAction(article.uid, "Edit"),
        },
        {
          label: "Delete",
          icon: <Trash2 className="w-4 h-4 text-red-700" />,
          onClick: () => handleAction(article.uid, "Delete"),
        },
      ]}
    />
  );
}
