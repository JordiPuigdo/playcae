import { useState } from "react";
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
import { renderFile } from "./RenderFile";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "@/hooks/use-Toast";
import { WorkerDocumentHistory } from "./WorkerDocumentHistory";

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
    comment?: string
  ) => void;
  onActivateWorker: (workerId: string) => void;
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
}: WorkersTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteWorker, setDeleteWorker] = useState<Worker | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const canValidate = true;
  const canEdit = true;

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Trabajadores ({workers.length})
            </CardTitle>
            {canEdit && (
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
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
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>DNI/NIE</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Fecha Alta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers &&
                  workers.map((worker) => (
                    <React.Fragment key={worker.id}>
                      <TableRow
                        key={worker.id}
                        className={`hover:bg-muted/50 ${
                          !worker.active ? "opacity-60" : ""
                        }`}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(worker.id!)}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedRows.has(worker.id!) ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {worker.firstName} {worker.lastName}
                            {!worker.active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {worker.cardId}
                        </TableCell>
                        <TableCell>{worker.position || "-"}</TableCell>
                        <TableCell>{formatDate(worker.creationDate)}</TableCell>
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
                                className="gap-1"
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
                                className="gap-1 text-destructive hover:text-destructive"
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
                                className="gap-1 text-success hover:text-success"
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
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4 bg-muted/30">
                              <div className="mb-3">
                                <h4 className="font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Documentación Requerida
                                </h4>
                              </div>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Archivo</TableHead>
                                    <TableHead>Fecha Subida</TableHead>
                                    <TableHead>Fecha Emisión</TableHead>
                                    <TableHead>Fecha Caducidad</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {worker.documents &&
                                    worker.documents.map((document) => (
                                      <TableRow key={document.id}>
                                        <TableCell className="font-medium">
                                          {document.documentType.name}
                                        </TableCell>
                                        <TableCell>
                                          {renderFile(document)}
                                        </TableCell>
                                        <TableCell>
                                          {formatDate(document.uploadedDate)}
                                        </TableCell>
                                        <TableCell>
                                          {formatDate(document.issueDate)}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            {formatDate(
                                              document.expirationDate
                                            )}
                                            {isExpired(
                                              document.expirationDate
                                            ) && (
                                              <span title="Documento caducado">
                                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                              </span>
                                            )}
                                            {isExpiringSoon(
                                              document.expirationDate
                                            ) &&
                                              !isExpired(
                                                document.expirationDate
                                              ) && (
                                                <span title="Caduca pronto">
                                                  <AlertTriangle className="h-4 w-4 text-pending" />
                                                </span>
                                              )}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="space-y-1">
                                            <Badge
                                              variant={
                                                document.status ===
                                                EntityStatus.Approved
                                                  ? "default"
                                                  : document.status ===
                                                    EntityStatus.Rejected
                                                  ? "destructive"
                                                  : "secondary"
                                              }
                                              className={
                                                document.status ===
                                                EntityStatus.Approved
                                                  ? "bg-success text-white hover:bg-success/80"
                                                  : document.status ===
                                                    EntityStatus.Rejected
                                                  ? "bg-pending text-white hover:bg-pending/80"
                                                  : ""
                                              }
                                            >
                                              {getEntityStatusLabel(
                                                document.status
                                              )}
                                            </Badge>
                                            {/*document.validatorComment && (
                                              <div className="text-xs text-muted-foreground">
                                                {document.validatorComment}
                                              </div>
                                            )*/}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-2">
                                            <WorkerDocumentHistory
                                              workerId={worker.id!}
                                              documentTypeId={
                                                document.documentType.id!
                                              }
                                            />
                                            {
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
                                            }
                                            {/*canValidate &&
                                          document.fileName &&
                                          document.status === 'Pendiente' && (
                                            <DocumentValidation
                                              documentName={document.name}
                                              canValidate={canValidate}
                                              onValidate={(isValid, comment) =>
                                                onValidateDocument(
                                                  worker.id,
                                                  document.id,
                                                  isValid,
                                                  comment
                                                )
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

      {
        <WorkerForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={editingWorker ? handleUpdateWorker : handleCreateWorker}
          worker={editingWorker || undefined}
          mode={editingWorker ? "edit" : "create"}
        />
      }

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
