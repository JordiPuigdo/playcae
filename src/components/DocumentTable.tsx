import { useState, useMemo } from "react";
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
import {
  FileText,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
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
type SortDirection = "asc" | "desc" | null;

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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Admin;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
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

  const sortedDocuments = useMemo(() => {
    if (!sortField || !sortDirection) return documents;

    return [...documents].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.documentType.name.localeCompare(b.documentType.name);
          break;
        case "uploadedDate":
          const aUpload = a.uploadedDate
            ? new Date(a.uploadedDate).getTime()
            : 0;
          const bUpload = b.uploadedDate
            ? new Date(b.uploadedDate).getTime()
            : 0;
          comparison = aUpload - bUpload;
          break;
        case "expirationDate":
          const aExp = a.expirationDate
            ? new Date(a.expirationDate).getTime()
            : Infinity;
          const bExp = b.expirationDate
            ? new Date(b.expirationDate).getTime()
            : Infinity;
          comparison = aExp - bExp;
          break;
        case "status":
          comparison = String(a.status || "").localeCompare(
            String(b.status || "")
          );
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [documents, sortField, sortDirection]);

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
                <SortableHeader field="name">{t("documents.document")}</SortableHeader>
                <TableHead className="text-brand-primary">{t("documents.file")}</TableHead>
                <SortableHeader field="uploadedDate">
                  {t("documents.uploadDate")}
                </SortableHeader>
                <SortableHeader field="expirationDate">
                  {t("documents.expirationDate")}
                </SortableHeader>
                <SortableHeader field="status">{t("common.status")}</SortableHeader>
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
                        <AlertTriangle
                          className="h-4 w-4 text-brand-secondary"
                          title="Documento caducado"
                        />
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
