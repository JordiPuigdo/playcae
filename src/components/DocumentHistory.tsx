import { use, useCallback, useEffect, useState } from "react";
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
import { useDocuments } from "@/hooks/useDocuments";
import { formatDate } from "@/app/utils/date";
import { FileCell } from "./FileCell";

interface DocumentHistoryProps {
  workerId?: string;
  companyId?: string;
  documentTypeId: string;
}

export const DocumentHistory = ({
  workerId,
  companyId,
  documentTypeId,
}: DocumentHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getWorkerDocumentsHistory, historicalDocuments, openDocument } =
    useDocuments("");

  const handleOpenHistory = () => {
    if (workerId) {
      getWorkerDocumentsHistory({
        workerId,
        documentTypeId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      });
    }
    if (companyId) {
      getWorkerDocumentsHistory({
        workerId: undefined,
        companyId: companyId,
        documentTypeId,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      });
    }
  };

  const handleOpenDocument = useCallback(async (documentId: string) => {
    await openDocument(documentId);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenHistory}
          className="gap-1 border-playBlueLight text-brand-primary hover:bg-playGrey"
        >
          <History className="h-3 w-3 text-brand-primary" />
          Historial
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] bg-white border border-playBlueLight/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-primary">
            <FileText className="h-5 w-5 text-brand-primary" />
            Historial de Documentos -{" "}
            {historicalDocuments[0]?.documentType.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            </div>
          ) : history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-playGrey">
                  <TableHead className="text-brand-primary">
                    Documento
                  </TableHead>
                  <TableHead className="text-brand-primary">Archivo</TableHead>
                  <TableHead className="text-brand-primary">Fecha</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {historicalDocuments.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium text-brand-primary">
                      {entry.documentType.name}
                    </TableCell>

                    <TableCell>
                      <FileCell document={entry} onOpen={handleOpenDocument} />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-brand-primary">
                        <Calendar className="h-3 w-3 text-playBlueLight" />
                        {formatDate(entry.creationDate)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-playBlueLight mb-4" />
              <h3 className="text-lg font-medium text-brand-primary mb-2">
                Sin historial
              </h3>
              <p className="text-playBlueLight">
                No hay historial de documentos para este trabajador.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
