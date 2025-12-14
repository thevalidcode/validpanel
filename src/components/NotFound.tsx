import type { FC, ReactNode } from "react";

interface NotFoundProps {
  title: string; // e.g., "No Store Found"
  description?: string; // e.g., "You haven't added any stores yet."
  icon?: ReactNode; // optional icon component
  actionLabel?: string; // e.g., "Add Store"
  onActionClick?: () => void; // optional click handler
}

const NotFound: FC<NotFoundProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition border-l-4 border-l-primary flex flex-col items-center text-center">
      <div className="text-gray-400 mb-4">
        {icon ? (
          icon
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            ?
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}

      {actionLabel && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NotFound;
