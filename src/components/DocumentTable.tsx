import { Document } from "@/types/document";

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
import { DocumentUpload } from "./DocumentUpload";
import { DocumentValidation } from "./DocumentValidation";
import { UserRole } from "@/types/user";

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
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Company;

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
                  <TableCell>
                    {document.documentType ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {document.documentType.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sin archivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(document.uploadDate)}</TableCell>
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
                      {/*canUpload && (
                        <DocumentUpload
                          documentName={document.name}
                          hasFile={!!document.fileName}
                          onUpload={(data) => onUpload(document.id, data)}
                        />
                      )*/}
                      {/*canValidate &&
                        document.fileName &&
                        document.status === "Pendiente" && (
                          <DocumentValidation
                            documentName={document.name}
                            canValidate={canValidate}
                            onValidate={(isValid, comment) =>
                              onValidate(document.id, isValid, comment)
                            }
                          />
                        )*/}
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
