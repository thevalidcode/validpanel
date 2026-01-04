import type { FC } from "react";

/* -------------------- TYPES -------------------- */

export type PGStatus = "ACTIVE" | "INACTIVE" | "SANDBOX";

export interface PGFiltersState {
  status: "All" | PGStatus;
  search: string;
}

interface PGFiltersProps {
  filters: PGFiltersState;
  onChange: (next: Partial<PGFiltersState>) => void;
}

/* -------------------- COMPONENT -------------------- */

const PGFilters: FC<PGFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-white border border-gray-200 px-6 py-6 rounded-lg">
        {/* SEARCH */}
        <div className="md:col-span-2">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Gateways
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by name or provider..."
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        {/* STATUS */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) =>
              onChange({
                status: e.target.value as PGFiltersState["status"],
              })
            }
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="All">All</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SANDBOX">Sandbox</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PGFilters;
