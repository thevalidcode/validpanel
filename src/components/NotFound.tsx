import type { FC, ReactNode } from "react";

interface NotFoundProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
  variant?: "inline" | "card" | "page";
}

const NotFound: FC<NotFoundProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onActionClick,
  variant = "card",
}) => {
  const isPage = variant === "page";

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        isPage ? "min-h-[70vh] px-6" : "bg-white rounded-xl border border-gray-200 shadow-xs p-6 m-6",
      ].join(" ")}
    >
      <div className="mb-4">
        {icon ? (
          <div className="text-gray-400">{icon}</div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
            ?
          </div>
        )}
      </div>

      <h3
        className={[
          "font-semibold text-gray-900",
          isPage ? "text-2xl" : "text-lg",
        ].join(" ")}
      >
        {title}
      </h3>

      {description && (
        <p
          className={[
            "text-gray-500 max-w-md",
            isPage ? "mt-3 text-base" : "mt-2 text-sm",
          ].join(" ")}
        >
          {description}
        </p>
      )}

      {actionLabel && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="mt-6 cursor-pointer inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NotFound;
