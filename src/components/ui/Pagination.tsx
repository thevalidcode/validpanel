import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomSelect, { type Option } from "./CustomSelect";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [20, 40, 60, 80, 100],
  className = "",
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    totalItems > itemsPerPage && (
      <div
        className={`mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 ${className}`}
      >
        {/* Left side info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <p>
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>

          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Rows per page</span>
              <CustomSelect
                options={pageSizeOptions.map((size) => ({
                  label: size.toString(),
                  value: size,
                }))}
                value={{ label: itemsPerPage.toString(), value: itemsPerPage }}
                placeholder="Rows per page"
                onChange={(selected) => {
                  const option = selected as Option<number>;
                  onPageSizeChange?.(option.value);
                }}
                className="w-24"
              />
            </div>
          )}
        </div>

        {/* Right side pagination */}
        <div className="flex items-center gap-1 flex-wrap">
          <PageButton
            disabled={currentPage === 1}
            onClick={() => goTo(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </PageButton>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const active = page === currentPage;

            return (
              <PageButton key={page} active={active} onClick={() => goTo(page)}>
                {page}
              </PageButton>
            );
          })}

          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => goTo(currentPage + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </PageButton>
        </div>
      </div>
    )
  );
};
/* ---------- Sub Component ---------- */

interface PageButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const PageButton = ({
  children,
  onClick,
  active = false,
  disabled = false,
}: PageButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-[4px] border transition
        ${
          active
            ? "bg-primary text-white border-primary"
            : "border-gray-200 hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </motion.button>
  );
};
