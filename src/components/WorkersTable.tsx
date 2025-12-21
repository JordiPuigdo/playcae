import { useState, useEffect, useMemo } from "react";
import { Worker, WorkerFormData, WorkerDocumentFormData } from "@/types/worker";

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

const DEFAULT_EXPIRY_DATE = "0001-01-01T00:00:00";

export const WorkersTable = ({
  workers,
  userRole,
  onCreateWorker,
  onUpdateWorker,
  onDeleteWorker,
  onUploadDocument,
  onValidateDocument,
  onActivateWorker,
  onOpenDocument,
  onRefresh,
}: WorkersTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<Worker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === DEFAULT_EXPIRY_DATE) return "-";
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate || expiryDate === DEFAULT_EXPIRY_DATE) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate || expiryDate === DEFAULT_EXPIRY_DATE) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

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
        title: "Trabajador eliminado",
        description: `${deleteWorker.firstName} ${deleteWorker.lastName} ha sido eliminado correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajador. Inténtalo de nuevo.",
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

  const canUpload = true;
  const canValidate = userRole == UserRole.Admin;
  const canEdit = true;

  const validStates = [EntityStatus.Approved, EntityStatus.ValidatedByAI];
  const rejectedStates = [
    EntityStatus.Rejected,
    EntityStatus.ExpiredByAI,
    EntityStatus.PendingManualy,
  ];

  return (
    <>
      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-brand-primary">
              <Users className="h-5 w-5 text-brand-primary" />
              Trabajadores ({workers.length})
            </CardTitle>

            {canEdit && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2 bg-playOrange hover:bg-playOrange/90 text-white"
              >
                <Plus className="h-4 w-4" />
                Añadir Trabajador
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-playGrey">
                  <TableHead className="w-10" />
                  <TableHead className="text-brand-primary">
                    Trabajador
                  </TableHead>
                  <TableHead className="text-brand-primary">DNI/NIE</TableHead>
                  <TableHead className="text-brand-primary">Puesto</TableHead>
                  <TableHead className="text-brand-primary">
                    Fecha Alta
                  </TableHead>
                  <TableHead className="text-brand-primary">Estado</TableHead>
                  <TableHead className="text-brand-primary">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {workers &&
                  workers.map((worker) => (
                    <React.Fragment key={worker.id}>
                      <TableRow
                        className={`hover:bg-playGrey/50 ${
                          !worker.active ? "opacity-60" : ""
                        }`}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(worker.id!)}
                            className="text-brand-primary"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(worker.id!) ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </TableCell>

                        <TableCell className="font-medium text-brand-primary">
                          <div className="flex items-center gap-2">
                            {worker.firstName} {worker.lastName}
                            {!worker.active && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-playGrey text-brand-primary"
                              >
                                Inactivo
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

                        <TableCell>
                          <div className="flex gap-2">
                            {canEdit && worker.active && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(worker)}
                                className="gap-1 border-playBlueLight text-brand-primary hover:bg-playGrey"
                              >
                                <Edit className="h-3 w-3" />
                                Editar
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
                                Eliminar
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
                                Activar
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
                                  Documentación Requerida
                                </h4>
                              </div>

                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-playGrey">
                                    <TableHead className="text-brand-primary">
                                      Documento
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Archivo
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Fecha Subida
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Fecha Emisión
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Fecha Caducidad
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Estado
                                    </TableHead>
                                    <TableHead className="text-brand-primary">
                                      Acciones
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {worker.documents &&
                                    worker.documents.map((document) => (
                                      <TableRow key={document.id}>
                                        <TableCell className="font-medium text-brand-primary">
                                          {document.documentType.name}
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

                                            <DocumentUpload
                                              documentName={
                                                document.documentType.name
                                              }
                                              hasFile={!!document.storagePath}
                                              canUpload={canUpload}
                                              onUpload={(data) =>
                                                onUploadDocument(
                                                  document.id!,
                                                  data,
                                                  worker.id!
                                                )
                                              }
                                            />

                                            {canValidate && (
                                              <DocumentValidation
                                                documentName={
                                                  document.documentType.name
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
        title="Eliminar Trabajador"
        description="¿Estás seguro de que deseas eliminar este trabajador? Esta acción no se puede deshacer y se perderán todos los documentos asociados."
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
