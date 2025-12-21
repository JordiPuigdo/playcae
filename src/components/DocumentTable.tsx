import { Document, EntityStatus } from "@/types/document";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileText, AlertTriangle } from "lucide-react";
import { DocumentFormData } from "@/types/document";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { UserRole } from "@/types/user";
import { formatDate, isExpired } from "@/app/utils/date";
import { DocumentValidation } from "./DocumentValidation";
import { DocumentUpload } from "./DocumentUpload";
import { FileCell } from "./FileCell";
import { DocumentHistory } from "./DocumentHistory";

interface DocumentsTableProps {
  documents: Document[];
  userRole: UserRole;
  onUpload: (documentId: string, data: DocumentFormData) => void;
  onValidate: (
    documentId: string,
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => void;
  onOpen: (documentId: string) => void;
  companyId: string;
  onRefresh?: () => void;
}

export const DocumentsTable = ({
  documents,
  userRole,
  onUpload,
  onValidate,
  onOpen,
  companyId,
  onRefresh,
}: DocumentsTableProps) => {
  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Admin;

  return (
    <Card className="bg-white border border-playBlueLight/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-primary">
          <FileText className="h-5 w-5 text-brand-primary" />
          Documentación Requerida{" "}
          {documents.length > 0 &&
            `(${
              documents.filter((x) => x.status == EntityStatus.Pending).length
            } / ${documents.length})`}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-playGrey">
                <TableHead className="text-brand-primary">Documento</TableHead>
                <TableHead className="text-brand-primary">Archivo</TableHead>
                <TableHead className="text-brand-primary">
                  Fecha Subida
                </TableHead>
                <TableHead className="text-brand-primary">
                  Fecha Caducidad
                </TableHead>
                <TableHead className="text-brand-primary">Estado</TableHead>
                <TableHead className="text-brand-primary">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium text-brand-primary">
                    {document.documentType.name}
                  </TableCell>

                  <TableCell>
                    <FileCell document={document} onOpen={onOpen} />
                  </TableCell>

                  <TableCell className="text-brand-primary">
                    {formatDate(document.uploadedDate)}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-brand-primary">
                      {formatDate(document.expirationDate)}

                      {isExpired(document.expirationDate) && (
                        <AlertTriangle className="h-4 w-4 text-brand-secondary" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <DocumentStatusBadge status={document.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <DocumentHistory
                        companyId={companyId}
                        documentTypeId={document.documentType.id!}
                      />

                      {canUpload && (
                        <DocumentUpload
                          documentName={document.documentType.name}
                          hasFile={!!document.storagePath}
                          onUpload={(data) => onUpload(document.id!, data)}
                          canUpload
                        />
                      )}

                      {canValidate && (
                        <DocumentValidation
                          documentName={document.originalName}
                          canValidate={canValidate}
                          onValidate={(isValid, comment, expiryDate) =>
                            onValidate(
                              document.id!,
                              isValid,
                              comment,
                              expiryDate
                            )
                          }
                          document={document}
                          onSuccess={onRefresh}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
