import { User, UserCheck, UserPlus } from "lucide-react";

interface ActivityProps {
  name: string;
  img?: string;
  task: string;
  time: string;
}

const activityIcons = [User, UserCheck, UserPlus]; // cycle through these

export const Activity: React.FC<ActivityProps & { index: number }> = ({
  name,
  task,
  time,
  img,
  index,
}) => {
  const Icon = activityIcons[index % activityIcons.length]; // cycle icons based on index
  return (
    <li className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-[4px] transition">
      <div className="flex-shrink-0">
        {img ? (
          <img src={img} alt={name} className="w-8 h-8 rounded-full" />
        ) : (
          <Icon className="w-8 h-8 text-purple-500" />
        )}
      </div>

      <div className="flex flex-col">
        <p className="text-gray-700 text-sm">
          <span className="font-medium">{name}</span> {task}
        </p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </li>
  );
};
