import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface UseSortableTableReturn<T, F extends string> {
  sortField: F | null;
  sortDirection: SortDirection;
  handleSort: (field: F) => void;
  sortedData: T[];
}

export function useSortableTable<T, F extends string>(
  data: T[],
  compareFn: (a: T, b: T, field: F) => number
): UseSortableTableReturn<T, F> {
  const [sortField, setSortField] = useState<F | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: F) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") { setSortDirection(null); setSortField(null); }
      else setSortDirection("asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const cmp = compareFn(a, b, sortField);
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [data, sortField, sortDirection, compareFn]);

  return { sortField, sortDirection, handleSort, sortedData };
}
