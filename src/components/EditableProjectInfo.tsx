"use client";

import { useState } from "react";
import {
  HardHat,
  MapPin,
  Calendar,
  Building2,
  Edit,
  Save,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-Dialog";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Project, ProjectStatus, UpdateProjectData } from "@/types/project";
import { formatDate } from "@/app/utils/date";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.Active]: "Activa",
  [ProjectStatus.PendingClosure]: "Pendiente de cierre",
  [ProjectStatus.Closed]: "Cerrada",
  [ProjectStatus.ClosedBySystem]: "Cerrada automáticamente",
  [ProjectStatus.Cancelled]: "Cancelada",
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.Active]: "bg-green-100 text-green-700",
  [ProjectStatus.PendingClosure]: "bg-yellow-100 text-yellow-700",
  [ProjectStatus.Closed]: "bg-gray-100 text-gray-600",
  [ProjectStatus.ClosedBySystem]: "bg-gray-100 text-gray-500",
  [ProjectStatus.Cancelled]: "bg-red-100 text-red-600",
};

interface EditableProjectInfoProps {
  project: Project;
  onUpdate: (data: UpdateProjectData) => Promise<void>;
  onClose: () => Promise<void>;
  onCancel: () => Promise<void>;
  companiesToRelease?: number;
}

export const EditableProjectInfo = ({
  project,
  onUpdate,
  onClose,
  onCancel,
  companiesToRelease = 0,
}: EditableProjectInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [form, setForm] = useState<UpdateProjectData>({
    name: project.name,
    description: project.description,
    address: project.address,
    startDate: project.startDate?.split("T")[0] ?? "",
    endDate: project.endDate?.split("T")[0] ?? "",
    pendingClosureDays: project.pendingClosureDays,
    closureGracePeriodDays: project.closureGracePeriodDays,
  });

  const isEditable =
    project.status === ProjectStatus.Active ||
    project.status === ProjectStatus.PendingClosure;

  const handleEditStart = () => {
    setForm({
      name: project.name,
      description: project.description,
      address: project.address,
      startDate: project.startDate?.split("T")[0] ?? "",
      endDate: project.endDate?.split("T")[0] ?? "",
      pendingClosureDays: project.pendingClosureDays,
      closureGracePeriodDays: project.closureGracePeriodDays,
    });
    setIsEditing(true);
  };

  const handleEditCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    setIsSaving(true);
    try {
      await onUpdate(form);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseConfirm = async () => {
    setIsClosing(true);
    try {
      await onClose();
      setShowCloseDialog(false);
    } finally {
      setIsClosing(false);
    }
  };

  const handleCancelConfirm = async () => {
    setIsCancelling(true);
    try {
      await onCancel();
      setShowCancelDialog(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Card className="border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-brand-primary">
            <div className="flex items-center gap-2">
              <HardHat className="h-5 w-5 text-brand-primary" />
              Información de la Obra
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[project.status]}`}
              >
                {STATUS_LABELS[project.status]}
              </span>
              {isEditable && !isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditStart} className="gap-1">
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCloseDialog(true)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cerrar obra
                  </Button>
                  {project.status === ProjectStatus.Active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelDialog(true)}
                      className="border-red-400 text-red-700 hover:bg-red-50"
                    >
                      Cancelar obra
                    </Button>
                  )}
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !form.name || !form.startDate || !form.endDate}
                    className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEditCancel} className="gap-1">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name ?? ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Dirección</label>
                <input
                  type="text"
                  value={form.address ?? ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Fecha inicio <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={form.startDate ?? ""}
                  onChange={(date) => setForm({ ...form, startDate: date })}
                  max={form.endDate || undefined}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Fecha fin <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={form.endDate ?? ""}
                  onChange={(date) => setForm({ ...form, endDate: date })}
                  min={form.startDate || undefined}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Días aviso cierre</label>
                <input
                  type="number"
                  min={0}
                  value={form.pendingClosureDays ?? ""}
                  onChange={(e) => setForm({ ...form, pendingClosureDays: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Días periodo de gracia</label>
                <input
                  type="number"
                  min={0}
                  value={form.closureGracePeriodDays ?? ""}
                  onChange={(e) => setForm({ ...form, closureGracePeriodDays: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <HardHat className="h-4 w-4" />
                  Nombre
                </div>
                <div className="font-semibold text-brand-primary">{project.name}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Inicio
                </div>
                <div className="text-sm text-brand-primary">{formatDate(project.startDate)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Calendar className="h-4 w-4" />
                  Fin
                </div>
                <div className="text-sm text-brand-primary">{formatDate(project.endDate)}</div>
              </div>

              {project.address && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Dirección
                  </div>
                  <div className="text-sm text-brand-primary">{project.address}</div>
                </div>
              )}

              {project.siteName && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Building2 className="h-4 w-4" />
                    Centro de trabajo
                  </div>
                  <div className="text-sm font-medium text-brand-primary">{project.siteName}</div>
                </div>
              )}

              {project.description && (
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    Descripción
                  </div>
                  <div className="text-sm text-brand-primary">{project.description}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Días aviso cierre</div>
                <div className="text-sm text-brand-primary">{project.pendingClosureDays}d</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Periodo de gracia</div>
                <div className="text-sm text-brand-primary">{project.closureGracePeriodDays}d</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog confirmar cerrar obra */}
      <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirmar cierre de obra
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              <span>
                Al cerrar <strong>{project.name}</strong>, las empresas que no estén en otras obras
                activas entrarán en un{" "}
                <strong>periodo de gracia de {project.closureGracePeriodDays} días</strong> antes de
                desactivarse.
              </span>
              {companiesToRelease > 0 && (
                <span className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 text-orange-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    <strong>{companiesToRelease}</strong> empresa
                    {companiesToRelease !== 1 ? "s" : ""} se liberarán (sin otras obras activas).
                  </span>
                </span>
              )}
              {companiesToRelease === 0 && (
                <span className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Todas las empresas siguen activas en otras obras.</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClosing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseConfirm}
              disabled={isClosing}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isClosing ? "Cerrando..." : "Cerrar obra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog confirmar cancelar obra */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cancelar obra
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              La obra <strong>{project.name}</strong> se marcará como{" "}
              <strong>Cancelada</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Cancelando..." : "Cancelar obra"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
