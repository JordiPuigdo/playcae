import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ScrollArea } from "@/components/ui/Scroll-Area";
import { History, FileText, Calendar, User } from "lucide-react";

interface DocumentHistoryEntry {
  id: string;
  documentId: string;
  documentName: string;
  fileName: string;
  action: "uploaded" | "validated" | "rejected" | "updated";
  actionDate: string;
  performedBy: string;
  comment?: string;
  previousStatus?: string;
  newStatus?: string;
}

interface WorkerDocumentHistoryProps {
  workerId: string;
  workerName: string;
  onFetchHistory: (workerId: string) => Promise<DocumentHistoryEntry[]>;
}

export const WorkerDocumentHistory = ({
  workerId,
  workerName,
  onFetchHistory,
}: WorkerDocumentHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<DocumentHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenHistory = async () => {
    setIsOpen(true);
    setIsLoading(true);

    try {
      const historyData = await onFetchHistory(workerId);
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching document history:", error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadge = (action: DocumentHistoryEntry["action"]) => {
    const variants = {
      uploaded: { variant: "secondary" as const, text: "Subido" },
      validated: { variant: "default" as const, text: "Validado" },
      rejected: { variant: "destructive" as const, text: "Rechazado" },
      updated: { variant: "secondary" as const, text: "Actualizado" },
    };

    const config = variants[action];
    return (
      <Badge
        variant={config.variant}
        className={
          action === "validated"
            ? "bg-success text-white hover:bg-success/80"
            : ""
        }
      >
        {config.text}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenHistory}
          className="gap-1"
        >
          <History className="h-3 w-3" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Documentos - {workerName}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Comentario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.documentName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{entry.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getActionBadge(entry.action)}
                        {entry.previousStatus && entry.newStatus && (
                          <div className="text-xs text-muted-foreground">
                            {entry.previousStatus} → {entry.newStatus}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {formatDate(entry.actionDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {entry.performedBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      {entry.comment && (
                        <span className="text-sm text-muted-foreground">
                          {entry.comment}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Sin historial</h3>
              <p className="text-muted-foreground">
                No hay historial de documentos para este trabajador.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
