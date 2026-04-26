import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/Table";
import { SortDirection } from "@/hooks/useSortableTable";

interface SortableHeaderProps<F extends string> {
  field: F;
  sortField: F | null;
  sortDirection: SortDirection;
  onSort: (field: F) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader<F extends string>({
  field,
  sortField,
  sortDirection,
  onSort,
  children,
  className,
}: SortableHeaderProps<F>) {
  const isActive = sortField === field;
  const icon = !isActive
    ? <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />
    : sortDirection === "asc"
      ? <ArrowUp className="h-4 w-4 ml-1 text-playOrange" />
      : sortDirection === "desc"
        ? <ArrowDown className="h-4 w-4 ml-1 text-playOrange" />
        : <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;

  return (
    <TableHead
      className={`cursor-pointer hover:bg-playGrey/80 select-none transition-colors ${className ?? ""}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">{children}{icon}</div>
    </TableHead>
  );
}
