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

interface AccessHistoryTableProps {
  history: AccessHistoryEntry[];
  onSelectEntry: (entry: AccessHistoryEntry) => void;
}

export const AccessHistoryTable = ({
  history,
  onSelectEntry,
}: AccessHistoryTableProps) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
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
            <TableHead className="text-brand-primary">Técnico</TableHead>
            <TableHead className="text-brand-primary">DNI</TableHead>
            <TableHead className="text-brand-primary">Empresa</TableHead>
            <TableHead className="text-brand-primary">Entrada</TableHead>
            <TableHead className="text-brand-primary">Salida</TableHead>
            <TableHead className="text-brand-primary">Duración</TableHead>
            <TableHead className="text-brand-primary">Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-playBlueLight"
              >
                No se encontraron registros
              </TableCell>
            </TableRow>
          ) : (
            history.map((entry) => (
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
