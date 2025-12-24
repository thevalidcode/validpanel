export interface PaginateResult<T> {
  data: T[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  start: number;
  end: number;
}

export function paginate<T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): PaginateResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const data = items.slice(startIndex, endIndex);

  return {
    data,
    currentPage: safePage,
    itemsPerPage,
    totalItems,
    totalPages,
    start: totalItems === 0 ? 0 : startIndex + 1,
    end: Math.min(endIndex, totalItems),
  };
}
