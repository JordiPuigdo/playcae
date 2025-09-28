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
import Link from "next/link";
import { formatDate, isExpired } from "@/app/utils/date";
import { DocumentValidation } from "./DocumentValidation";
import { renderFile } from "./RenderFile";
import { DocumentUpload } from "./DocumentUpload";

interface DocumentsTableProps {
  documents: Document[];
  userRole: UserRole;
  onUpload: (documentId: string, data: DocumentFormData) => void;
  onValidate: (documentId: string, isValid: boolean, comment?: string) => void;
}

export const DocumentsTable = ({
  documents,
  userRole,
  onUpload,
  onValidate,
}: DocumentsTableProps) => {
  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Admin;

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentación Requerida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Archivo</TableHead>
                <TableHead>Fecha Subida</TableHead>
                <TableHead>Fecha Caducidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.documentType.name}
                  </TableCell>
                  <TableCell>{renderFile(document)}</TableCell>
                  <TableCell>{formatDate(document.uploadedDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {formatDate(document.expirationDate)}
                      {isExpired(document.expirationDate) && (
                        <span title="Documento caducado">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        </span>
                      )}
                      {/*isExpiringSoon(document.expiryDate) &&
                        !isExpired(document.expiryDate) && (
                          <span title="Caduca pronto">
                            <AlertTriangle className="h-4 w-4 text-pending" />
                          </span>
                        )*/}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DocumentStatusBadge status={document.status} />
                    {/*document.validatorComment && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {document.validatorComment}
                      </div>
                    )*/}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {canUpload && (
                        <DocumentUpload
                          documentName={document.originalName}
                          hasFile={!!document.storagePath}
                          onUpload={(data) => onUpload(document.id!, data)}
                          canUpload
                        />
                      )}

                      {canValidate && (
                        <DocumentValidation
                          documentName={document.originalName}
                          canValidate={canValidate}
                          onValidate={(isValid, comment) =>
                            onValidate(document.id!, isValid, comment)
                          }
                          document={document}
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
