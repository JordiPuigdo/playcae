"use client";

import dayjs from "dayjs";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, HardHat } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectData, ProjectList, ProjectStatus, UpdateProjectData } from "@/types/project";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-Toast";
import { DatePicker } from "@/components/ui/DatePicker";
import { ProjectFilters, ProjectFiltersState, EMPTY_DATE_RANGE } from "@/components/ProjectFilters";
import { ProjectTable } from "@/components/ProjectTable";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";

const ACTIVE_STATUSES = new Set([ProjectStatus.Active, ProjectStatus.PendingClosure]);

const matchesFilters = (
  project: ProjectList,
  filters: ProjectFiltersState
): boolean => {
  const { search, status, activeFilter, dateRange } = filters;

  if (search) {
    const q = search.toLowerCase();
    if (
      !project.name.toLowerCase().includes(q) &&
      !project.address?.toLowerCase().includes(q)
    )
      return false;
  }

  if (status !== "all" && project.status !== status) return false;

  if (activeFilter === "Activas" && !ACTIVE_STATUSES.has(project.status)) return false;
  if (activeFilter === "Inactivas" && ACTIVE_STATUSES.has(project.status)) return false;

  // Date overlap: normalize both sides to YYYY-MM-DD to avoid ISO timestamp vs plain-date mismatches
  if (dateRange.from && dayjs(project.endDate).format("YYYY-MM-DD") < dateRange.from) return false;
  if (dateRange.to && dayjs(project.startDate).format("YYYY-MM-DD") > dateRange.to) return false;

  return true;
};

const ObrasContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { projects, isLoading, createProject, updateProject, cancelProject } = useProjects();

  // Read filters from URL (source of truth)
  const search = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status");
  const status: ProjectStatus | "all" =
    statusParam ? (Number(statusParam) as ProjectStatus) : "all";
  const activeFilter = (searchParams.get("active") as "Activas" | "Inactivas" | "Todas") ?? "Todas";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";

  const currentFilters: ProjectFiltersState = {
    search,
    status,
    activeFilter,
    dateRange: { from: dateFrom, to: dateTo },
  };

  // Apply default range on first visit (when no date params exist in URL)
  useEffect(() => {
    if (searchParams.get("dateFrom") === null && searchParams.get("dateTo") === null) {
      const today = new Date();
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      const oneMonthAhead = new Date(today);
      oneMonthAhead.setMonth(today.getMonth() + 1);
      const fmt = (d: Date) => d.toISOString().split("T")[0];
      const params = new URLSearchParams(searchParams.toString());
      params.set("dateFrom", fmt(oneYearAgo));
      params.set("dateTo", fmt(oneMonthAhead));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [editingProject, setEditingProject] = useState<ProjectList | null>(null);
  const [editForm, setEditForm] = useState<UpdateProjectData>({});
  const [isEditing, setIsEditing] = useState(false);

  const [cancellingProject, setCancellingProject] = useState<ProjectList | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const [form, setForm] = useState<CreateProjectData>({
    name: "",
    description: "",
    address: "",
    startDate: "",
    endDate: "",
  });

  const updateFiltersInUrl = useCallback(
    (filters: ProjectFiltersState) => {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status !== "all") params.set("status", String(filters.status));
      if (filters.activeFilter !== "Todas") params.set("active", filters.activeFilter);
      // Always write date params (even empty) so null vs "" distinguishes first visit from explicit clear
      params.set("dateFrom", filters.dateRange.from);
      params.set("dateTo", filters.dateRange.to);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  const filteredProjects = projects.filter((p) => matchesFilters(p, currentFilters));

  const handleEditOpen = (project: ProjectList) => {
    setEditingProject(project);
    setEditForm({
      name: project.name,
      description: project.description,
      address: project.address,
      startDate: project.startDate?.split("T")[0] ?? "",
      endDate: project.endDate?.split("T")[0] ?? "",
    });
  };

  const handleEditSave = async () => {
    if (!editingProject) return;
    if (!editForm.name || !editForm.startDate || !editForm.endDate) {
      toast({ title: "Rellena los campos obligatorios", variant: "destructive" });
      return;
    }
    setIsEditing(true);
    try {
      await updateProject(editingProject.id!, editForm);
      toast({ title: `Obra "${editForm.name}" actualizada correctamente` });
      setEditingProject(null);
    } catch {
      toast({ title: "Error al actualizar la obra", variant: "destructive" });
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancellingProject) return;
    setIsCancelling(true);
    try {
      await cancelProject(cancellingProject.id!);
      toast({ title: `Obra "${cancellingProject.name}" cancelada` });
      setCancellingProject(null);
    } catch {
      toast({ title: "Error al cancelar la obra", variant: "destructive" });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.startDate || !form.endDate) {
      toast({ title: "Rellena los campos obligatorios", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const project = await createProject(form);
      toast({ title: `Obra "${project.name}" creada correctamente` });
      setShowCreateDialog(false);
      setForm({ name: "", description: "", address: "", startDate: "", endDate: "" });
      router.push(`/dashboard/projects/${project.id}`);
    } catch {
      toast({ title: "Error al crear la obra", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <Loader text="" />;

  return (
    <div>
      {/* Header */}
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <HardHat className="h-7 w-7 text-brand-primary" />
                Obras y Proyectos
              </h1>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex items-center bg-playOrange hover:bg-playOrange/90 text-white"
                variant="submit"
              >
                <Plus className="h-4 w-4" />
                Nueva obra
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <ProjectFilters
          initialFilters={currentFilters}
          onFilter={updateFiltersInUrl}
        />

        <ProjectTable
          projects={filteredProjects}
          totalCount={projects.length}
          onEdit={handleEditOpen}
          onCancel={setCancellingProject}
        />
      </div>

      {/* Modal confirmar cancelar obra */}
      <DeleteConfirmationModal
        isOpen={!!cancellingProject}
        onClose={() => setCancellingProject(null)}
        onConfirm={handleCancelConfirm}
        title="Cancelar obra"
        description="La obra se marcará como Cancelada. Esta acción no se puede deshacer."
        itemName={cancellingProject?.name}
        isLoading={isCancelling}
      />

      {/* Dialog editar obra */}
      <Dialog open={!!editingProject} onOpenChange={(open) => { if (!open) setEditingProject(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar obra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.name ?? ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={editForm.description ?? ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección / Ubicación
              </label>
              <input
                type="text"
                value={editForm.address ?? ""}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha inicio <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={editForm.startDate ?? ""}
                  onChange={(date) => setEditForm({ ...editForm, startDate: date })}
                  max={editForm.endDate || undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha fin <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={editForm.endDate ?? ""}
                  onChange={(date) => setEditForm({ ...editForm, endDate: date })}
                  min={editForm.startDate || undefined}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancelar
              </Button>
              <Button onClick={handleEditSave} disabled={isEditing}>
                {isEditing ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog crear obra */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva obra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Ej: Reforma nave industrial norte"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección / Ubicación
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha inicio <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={form.startDate}
                  onChange={(date) => setForm({ ...form, startDate: date })}
                  max={form.endDate || undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha fin <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={form.endDate}
                  onChange={(date) => setForm({ ...form, endDate: date })}
                  min={form.startDate || undefined}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Creando..." : "Crear obra"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ObrasPage = () => (
  <Suspense fallback={<Loader text="" />}>
    <ObrasContent />
  </Suspense>
);

export default ObrasPage;
