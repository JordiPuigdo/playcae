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
import { es, ca } from "date-fns/locale";
import { useTranslation } from "@/hooks/useTranslation";
import { useSortableTable } from "@/hooks/useSortableTable";
import { SortableHeader } from "@/components/SortableHeader";

type SortField = "technicianName" | "dni" | "company" | "entryTime" | "exitTime" | "duration" | "status";

interface AccessHistoryTableProps {
  history: AccessHistoryEntry[];
  onSelectEntry: (entry: AccessHistoryEntry) => void;
}

export const AccessHistoryTable = ({
  history,
  onSelectEntry,
}: AccessHistoryTableProps) => {
  const { t, locale } = useTranslation();
  const dateLocale = locale === "ca" ? ca : es;

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: dateLocale });
  };

  const calculateDurationMinutes = (entry: AccessHistoryEntry): number => {
    if (!entry.exitTime) return Infinity; // "En instalación" va al final
    const entryTime = new Date(entry.entryTime);
    const exitTime = new Date(entry.exitTime);
    return (exitTime.getTime() - entryTime.getTime()) / (1000 * 60);
  };

  const calculateDuration = (entry: AccessHistoryEntry) => {
    if (!entry.exitTime) return t("accessControl.inFacility");

    const entryTime = new Date(entry.entryTime);
    const exitTime = new Date(entry.exitTime);
    const diff = exitTime.getTime() - entryTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const { sortField, sortDirection, handleSort, sortedData: sortedHistory } =
    useSortableTable<AccessHistoryEntry, SortField>(history, (a, b, field) => {
      switch (field) {
        case "technicianName": return a.technicianName.localeCompare(b.technicianName);
        case "dni":            return a.dni.localeCompare(b.dni);
        case "company":        return a.company.localeCompare(b.company);
        case "entryTime":      return new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime();
        case "exitTime": {
          const aExit = a.exitTime ? new Date(a.exitTime).getTime() : Infinity;
          const bExit = b.exitTime ? new Date(b.exitTime).getTime() : Infinity;
          return aExit - bExit;
        }
        case "duration": return calculateDurationMinutes(a) - calculateDurationMinutes(b);
        case "status":   return a.status.localeCompare(b.status);
      }
    });

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
            <SortableHeader field="technicianName" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("accessControl.technician")}</SortableHeader>
            <SortableHeader field="dni" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("workers.dni")}</SortableHeader>
            <SortableHeader field="company" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("accessControl.company")}</SortableHeader>
            <SortableHeader field="entryTime" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("accessControl.entry")}</SortableHeader>
            <SortableHeader field="exitTime" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("accessControl.exit")}</SortableHeader>
            <SortableHeader field="duration" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("accessControl.duration")}</SortableHeader>
            <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("common.status")}</SortableHeader>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedHistory.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-playBlueLight"
              >
                {t("accessControl.noRecords")}
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
                      {t("accessControl.inFacility")}
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
