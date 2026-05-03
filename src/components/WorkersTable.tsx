import { useState, useEffect, useMemo } from "react";
import { useSortableTable } from "@/hooks/useSortableTable";
import { SortableHeader } from "@/components/SortableHeader";
import { Worker, WorkerFormData, WorkerDocumentFormData } from "@/types/worker";
import { useTranslation } from "@/hooks/useTranslation";
import dayjs from "dayjs";
import { getDocumentTypeName } from "@/app/utils/document-type-utils";
import { formatDate, isExpiringSoon, isExpired } from "@/app/utils/date";

import {
  Users,
  FileText,
  AlertTriangle,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

type SortField = "name" | "cardId" | "position" | "creationDate" | "status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { WorkerStatusBadge } from "./WorkerStatusBadge";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import React from "react";
import { UserRole } from "@/types/user";
import { WorkerForm } from "./WorkerForm";
import { EntityStatus } from "@/types/document";
import { getEntityStatusLabel } from "@/app/utils/enum-utils";
import { DocumentUpload } from "./DocumentUpload";

import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "@/hooks/use-Toast";
import { DocumentHistory } from "./DocumentHistory";
import { DocumentValidation } from "./DocumentValidation";
import { FileCell } from "./FileCell";
import { DocumentStatusBadge } from "./DocumentStatusBadge";

interface WorkersTableProps {
  workers: Worker[];
  userRole: UserRole;
  workersAtLimit?: boolean;
  onCreateWorker: (data: WorkerFormData) => void;
  onUpdateWorker: (workerId: string, data: WorkerFormData) => void;
  onDeleteWorker: (workerId: string) => void;
  onUploadDocument: (
    documentId: string,
    data: WorkerDocumentFormData,
    workerId: string
  ) => void;
  onValidateDocument: (
    workerId: string,
    documentId: string,
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => void;
  onActivateWorker: (workerId: string) => void;
  onOpenDocument: (documentId: string) => void;
  onRefresh?: () => void;
}


export const WorkersTable = ({
  workers,
  userRole,
  workersAtLimit = false,
  onCreateWorker,
  onUpdateWorker,
  onDeleteWorker,
  onUploadDocument,
  onValidateDocument,
  onActivateWorker,
  onOpenDocument,
  onRefresh,
}: WorkersTableProps) => {
  const { t } = useTranslation();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<Worker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { sortField, sortDirection, handleSort, sortedData: sortedWorkers } =
    useSortableTable<Worker, SortField>(workers, (a, b, field) => {
      switch (field) {
        case "name": {
          const aN = `${a.firstName} ${a.lastName}`;
          const bN = `${b.firstName} ${b.lastName}`;
          return aN.localeCompare(bN);
        }
        case "cardId":      return (a.cardId || "").localeCompare(b.cardId || "");
        case "position":    return (a.position || "").localeCompare(b.position || "");
        case "creationDate":
          return dayjs(a.creationDate ?? 0).valueOf() - dayjs(b.creationDate ?? 0).valueOf();
        case "status": return String(a.status || "").localeCompare(String(b.status || ""));
      }
    });

  const PENDING_STATUSES = [
    EntityStatus.Pending,
    EntityStatus.Rejected,
    EntityStatus.Expired,
    EntityStatus.ExpiredByAI,
    EntityStatus.PendingManualy,
  ];

  const workersWithPendingDocs = useMemo(() => {
    return workers
      .filter(
        (worker) =>
          worker.active &&
          worker.documents?.some((doc) => PENDING_STATUSES.includes(doc.status))
      )
      .map((worker) => worker.id!);
  }, [workers]);

  useEffect(() => {
    if (workersWithPendingDocs.length > 0) {
      setExpandedRows(new Set(workersWithPendingDocs));
    }
  }, [workersWithPendingDocs]);

  const toggleRow = (workerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(workerId)) {
      newExpanded.delete(workerId);
    } else {
      newExpanded.add(workerId);
    }
    setExpandedRows(newExpanded);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setIsFormOpen(true);
  };

  const handleCreateWorker = (data: WorkerFormData) => {
    onCreateWorker(data);
    setIsFormOpen(false);
    setEditingWorker(null);
  };

  const handleUpdateWorker = (data: WorkerFormData) => {
    if (editingWorker) {
      onUpdateWorker(editingWorker.id!, data);
      setEditingWorker(null);
      setIsFormOpen(false);
    }
  };

  const handleCloseForm = () => {
    setEditingWorker(null);
    setIsFormOpen(false);
  };

  const handleDeleteClick = (worker: Worker) => {
    setDeleteWorker(worker);
  };

  const handleDeleteWorker = async () => {
    if (!deleteWorker) return;

    setIsDeleting(true);
    try {
      onDeleteWorker(deleteWorker.id!);
      toast({
        title: t("workers.workerDeleted"),
        description: t("workers.workerDeletedDesc", { name: `${deleteWorker.firstName} ${deleteWorker.lastName}` }),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: t("workers.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteWorker(null);
    }
  };

  const handleActivateClick = (worker: Worker) => {
    if (!worker.active) {
      onActivateWorker(worker.id!);
    }
  };

  const canUpload = userRole == UserRole.Company;
  const canValidate = userRole == UserRole.Admin;
  const canEdit = userRole == UserRole.Company;

   return (
    <>
      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-brand-primary">
              <Users className="h-5 w-5 text-brand-primary" />
              {t("workers.count", { count: workers.length })}
            </CardTitle>

            {canEdit && (
              <div className="relative group inline-block">
                <Button
                  onClick={() => !workersAtLimit && setIsFormOpen(true)}
                  disabled={workersAtLimit}
                  className="gap-2 bg-playOrange hover:bg-playOrange/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  {t("workers.addWorker")}
                </Button>
                {workersAtLimit && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded max-w-[260px] text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {t("license.quota.internalWorkersExceeded")}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-playGrey">
                  <TableHead className="w-10" />
                  <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("workers.title")}</SortableHeader>
                  <SortableHeader field="cardId" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("workers.dni")}</SortableHeader>
                  <SortableHeader field="position" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("workers.position")}</SortableHeader>
                  <SortableHeader field="creationDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">
                    {t("workers.registrationDate")}
                  </SortableHeader>
                  <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary">{t("common.status")}</SortableHeader>
                  <TableHead className="text-brand-primary">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedWorkers &&
                  sortedWorkers.map((worker) => (
                    <React.Fragment key={worker.id}>
                      <TableRow
                        className={`hover:bg-playOrange/5 cursor-pointer transition-colors group ${
                          !worker.active ? "opacity-60" : ""
                        }`}
                        onClick={() => toggleRow(worker.id!)}
                      >
                        <TableCell>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform text-playBlueLight ${
                              expandedRows.has(worker.id!) ? "rotate-180" : ""
                            }`}
                          />
                        </TableCell>

                        <TableCell className="font-medium text-brand-primary">
                          <div className="flex items-center gap-2">
                            <span className="group-hover:text-playOrange transition-colors">
                              {worker.firstName} {worker.lastName}
                            </span>
                            {!worker.active && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-playGrey text-brand-primary"
                              >
                                {t("workers.inactive")}
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-sm text-brand-primary">
                          {worker.cardId}
                        </TableCell>

                        <TableCell className="text-brand-primary">
                          {worker.position || "-"}
                        </TableCell>

                        <TableCell className="text-brand-primary">
                          {formatDate(worker.creationDate)}
                        </TableCell>

                        <TableCell>
                          <WorkerStatusBadge status={worker.status} />
                        </TableCell>

                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            {canEdit && worker.active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(worker)}
                                className="gap-1 border-playBlueLight text-brand-primary hover:bg-playGrey"
                              >
                                <Edit className="h-3 w-3" />
                                {t("common.edit")}
                              </Button>
                            )}

                            {canEdit && worker.active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(worker)}
                                className="gap-1 border-playBlueLight text-brand-secondary hover:bg-playGrey"
                              >
                                <Trash2 className="h-3 w-3" />
                                {t("common.delete")}
                              </Button>
                            )}

                            {!worker.active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivateClick(worker)}
                                className="gap-1 border-playGreen text-playGreen hover:bg-playGrey"
                              >
                                <Check className="h-3 w-3" />
                                {t("common.activate")}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRows.has(worker.id!) && (
                        <TableRow>
                          <TableCell colSpan={9} className="p-0">
                            <div className="p-4 bg-playGrey/30">
                              <div className="mb-3">
                                <h4 className="font-medium flex items-center gap-2 text-brand-primary">
                                  <FileText className="h-4 w-4 text-brand-primary" />
                                  {t("workers.requiredDocumentation")}
                                </h4>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-playGrey">
                                    <TableHead className="text-brand-primary">
                                      {t("documents.document")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("documents.file")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("documents.uploadDate")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("documents.issueDate")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("documents.expirationDate")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("common.status")}
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      {t("common.actions")}
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {worker.documents &&
                                    worker.documents.map((document) => (
                                      <TableRow key={document.id}>
                                        <TableCell className="font-medium text-brand-primary">
                                          {getDocumentTypeName(document.documentType, t)}
                                        </TableCell>

                                        <TableCell>
                                          <FileCell
                                            document={document}
                                            onOpen={onOpenDocument}
                                          />
                                        </TableCell>

                                        <TableCell className="text-brand-primary">
                                          {formatDate(document.uploadedDate)}
                                        </TableCell>

                                        <TableCell className="text-brand-primary">
                                          {formatDate(document.issueDate)}
                                        </TableCell>

                                        <TableCell>
                                          <div className="flex items-center gap-2 text-brand-primary">
                                            {formatDate(
                                              document.expirationDate
                                            )}

                                            {isExpired(
                                              document.expirationDate
                                            ) && (
                                              <AlertTriangle className="h-4 w-4 text-brand-secondary" />
                                            )}

                                            {isExpiringSoon(
                                              document.expirationDate
                                            ) &&
                                              !isExpired(
                                                document.expirationDate
                                              ) && (
                                                <AlertTriangle className="h-4 w-4 text-playYellow" />
                                              )}
                                          </div>
                                        </TableCell>

                                        <TableCell className="text-center">
                                          <DocumentStatusBadge
                                            status={document.status}
                                          />
                                        </TableCell>

                                        <TableCell className="w-[140px]">
                                          <div className="flex gap-2">
                                            <DocumentHistory
                                              workerId={worker.id!}
                                              documentTypeId={
                                                document.documentType.id!
                                              }
                                            />
                                          {canUpload && (
                                            <DocumentUpload
                                              documentName={
                                                getDocumentTypeName(document.documentType, t)
                                              }
                                              documentTypeId={document.documentType.id!}
                                              hasFile={!!document.storagePath}
                                              canUpload={canUpload}
                                              onUpload={(data) =>
                                                onUploadDocument(
                                                  document.id!,
                                                  data,
                                                  worker.id!
                                                )
                                              }
                                            />)}

                                            {canValidate && (
                                              <DocumentValidation
                                                documentName={
                                                  getDocumentTypeName(document.documentType, t)
                                                }
                                                canValidate={canValidate}
                                                onValidate={(
                                                  isValid,
                                                  comment,
                                                  expiryDate
                                                ) =>
                                                  onValidateDocument(
                                                    worker.id!,
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
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <WorkerForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={editingWorker ? handleUpdateWorker : handleCreateWorker}
        worker={editingWorker || undefined}
        mode={editingWorker ? "edit" : "create"}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteWorker}
        onClose={() => setDeleteWorker(null)}
        onConfirm={handleDeleteWorker}
        title={t("workers.deleteWorker")}
        description={t("workers.confirmDelete")}
        itemName={
          deleteWorker
            ? `${deleteWorker.firstName} ${deleteWorker.lastName}`
            : undefined
        }
        isLoading={isDeleting}
      />
    </>
  );
};
