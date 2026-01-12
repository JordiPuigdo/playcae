import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { AccessHistoryEntry } from "@/types/accessHistory";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortField =
  | "technicianName"
  | "dni"
  | "company"
  | "entryTime"
  | "exitTime"
  | "duration"
  | "status";
type SortDirection = "asc" | "desc" | null;

interface AccessHistoryTableProps {
  history: AccessHistoryEntry[];
  onSelectEntry: (entry: AccessHistoryEntry) => void;
}

export const AccessHistoryTable = ({
  history,
  onSelectEntry,
}: AccessHistoryTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const calculateDurationMinutes = (entry: AccessHistoryEntry): number => {
    if (!entry.exitTime) return Infinity; // "En instalación" va al final
    const entryTime = new Date(entry.entryTime);
    const exitTime = new Date(entry.exitTime);
    return (exitTime.getTime() - entryTime.getTime()) / (1000 * 60);
  };

  const calculateDuration = (entry: AccessHistoryEntry) => {
    if (!entry.exitTime) return "En instalación";

    const entryTime = new Date(entry.entryTime);
    const exitTime = new Date(entry.exitTime);
    const diff = exitTime.getTime() - entryTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Ciclo: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedHistory = useMemo(() => {
    if (!sortField || !sortDirection) return history;

    return [...history].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "technicianName":
          comparison = a.technicianName.localeCompare(b.technicianName);
          break;
        case "dni":
          comparison = a.dni.localeCompare(b.dni);
          break;
        case "company":
          comparison = a.company.localeCompare(b.company);
          break;
        case "entryTime":
          comparison =
            new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime();
          break;
        case "exitTime":
          const aExit = a.exitTime ? new Date(a.exitTime).getTime() : Infinity;
          const bExit = b.exitTime ? new Date(b.exitTime).getTime() : Infinity;
          comparison = aExit - bExit;
          break;
        case "duration":
          comparison =
            calculateDurationMinutes(a) - calculateDurationMinutes(b);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [history, sortField, sortDirection]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1 text-playOrange" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4 ml-1 text-playOrange" />;
    }
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="text-brand-primary cursor-pointer hover:bg-playGrey/80 select-none transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {renderSortIcon(field)}
      </div>
    </TableHead>
  );

  const renderStatusLight = (status: string) => {
    const color =
      status === "Apto"
        ? "bg-playGreen border-playGreen/60"
        : "bg-brand-secondary border-brand-secondary/60";

    return (
      <span
        className={`inline-block w-6 h-6 rounded-full border ${color}`}
      ></span>
    );
  };

  return (
    <div className="border border-playBlueLight/30 rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-playGrey">
            <SortableHeader field="technicianName">Técnico</SortableHeader>
            <SortableHeader field="dni">DNI</SortableHeader>
            <SortableHeader field="company">Empresa</SortableHeader>
            <SortableHeader field="entryTime">Entrada</SortableHeader>
            <SortableHeader field="exitTime">Salida</SortableHeader>
            <SortableHeader field="duration">Duración</SortableHeader>
            <SortableHeader field="status">Estado</SortableHeader>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedHistory.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-playBlueLight"
              >
                No se encontraron registros
              </TableCell>
            </TableRow>
          ) : (
            sortedHistory.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer hover:bg-playGrey/60 transition-colors"
                onClick={() => onSelectEntry(entry)}
              >
                <TableCell className="font-medium text-brand-primary">
                  {entry.technicianName}
                </TableCell>

                <TableCell className="text-brand-primary">
                  {entry.dni}
                </TableCell>

                <TableCell className="text-brand-primary">
                  {entry.company}
                </TableCell>

                <TableCell className="text-brand-primary">
                  {formatDateTime(entry.entryTime)}
                </TableCell>

                <TableCell className="text-brand-primary">
                  {entry.exitTime ? (
                    formatDateTime(entry.exitTime)
                  ) : (
                    <span className="bg-playYellow text-black px-2 py-1 rounded-full border border-playYellow/40 text-xs">
                      En instalación
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-brand-primary">
                  {calculateDuration(entry)}
                </TableCell>

                <TableCell className="text-center">
                  {renderStatusLight(entry.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
