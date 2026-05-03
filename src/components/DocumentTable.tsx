import dayjs from "dayjs";
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
import { useSortableTable } from "@/hooks/useSortableTable";
import { SortableHeader } from "@/components/SortableHeader";
import { DocumentFormData } from "@/types/document";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { UserRole } from "@/types/user";
import { formatDate, isExpired } from "@/app/utils/date";
import { DocumentValidation } from "./DocumentValidation";
import { DocumentUpload } from "./DocumentUpload";
import { FileCell } from "./FileCell";
import { DocumentHistory } from "./DocumentHistory";
import { useTranslation } from "@/hooks/useTranslation";
import { getDocumentTypeName } from "@/app/utils/document-type-utils";

type SortField = "name" | "uploadedDate" | "expirationDate" | "status";

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
  const { t } = useTranslation();
  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Admin;
  const { sortField, sortDirection, handleSort, sortedData: sortedDocuments } =
    useSortableTable<Document, SortField>(documents, (a, b, field) => {
      switch (field) {
        case "name":           return a.documentType.name.localeCompare(b.documentType.name);
        case "uploadedDate":
          return dayjs(a.uploadedDate ?? 0).valueOf() - dayjs(b.uploadedDate ?? 0).valueOf();
        case "expirationDate": {
          const aE = a.expirationDate ? dayjs(a.expirationDate).valueOf() : Infinity;
          const bE = b.expirationDate ? dayjs(b.expirationDate).valueOf() : Infinity;
          return aE - bE;
        }
        case "status": return String(a.status || "").localeCompare(String(b.status || ""));
      }
    });

  return (
    <Card className="bg-white border border-playBlueLight/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-primary">
          <FileText className="h-5 w-5 text-brand-primary" />
          {t("documents.requiredDocumentation")}{" "}
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
                <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("documents.document")}</SortableHeader>
                <TableHead className="text-brand-primary">{t("documents.file")}</TableHead>
                <SortableHeader field="uploadedDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">
                  {t("documents.uploadDate")}
                </SortableHeader>
                <SortableHeader field="expirationDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">
                  {t("documents.expirationDate")}
                </SortableHeader>
                <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("common.status")}</SortableHeader>
                <TableHead className="text-brand-primary">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium text-brand-primary">
                    {getDocumentTypeName(document.documentType, t)}
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
                        <span title="Documento caducado">
                          <AlertTriangle className="h-4 w-4 text-brand-secondary" />
                        </span>
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
                          documentName={getDocumentTypeName(document.documentType, t)}
                          documentTypeId={document.documentType.id!}
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
