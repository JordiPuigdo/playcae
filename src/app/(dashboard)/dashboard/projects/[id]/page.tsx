"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  X,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { ProjectDetailHeader } from "@/components/ProjectDetailHeader";
import { EditableProjectInfo } from "@/components/EditableProjectInfo";
import { useProject, useProjectAssignments } from "@/hooks/useProjects";
import { useCompanies } from "@/hooks/useCompanies";
import { ProjectStatus } from "@/types/project";
import { CompanySimple } from "@/types/company";
import Loader from "@/components/Loader";
import { toast } from "@/hooks/use-Toast";
import { formatDate } from "@/app/utils/date";

export default function ObraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { project, isLoading, error, updateProject, closeProject, cancelProject } = useProject(id);
  const { assignments, assignCompany, removeCompany, countCompaniesToRelease } =
    useProjectAssignments(id);
  const { companies } = useCompanies();

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [companiesToRelease, setCompaniesToRelease] = useState<number>(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [includeSubcontractors, setIncludeSubcontractors] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  useEffect(() => {
    if (error) {
      toast({ title: "Obra no encontrada", variant: "destructive" });
      router.push("/dashboard/projects");
    }
  }, [error, router]);

  useEffect(() => {
    if (project?.status === ProjectStatus.Active || project?.status === ProjectStatus.PendingClosure) {
      countCompaniesToRelease().then(setCompaniesToRelease).catch(() => {});
    }
  }, [project?.id, project?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async (data: Parameters<typeof updateProject>[0]) => {
    try {
      await updateProject(data);
      toast({ title: "Obra actualizada correctamente" });
    } catch {
      toast({ title: "Error al actualizar la obra", variant: "destructive" });
      throw new Error("update failed");
    }
  };

  const handleClose = async () => {
    try {
      await closeProject();
      toast({ title: "Obra cerrada. Las empresas sin otras obras activas entrarán en periodo de gracia." });
    } catch {
      toast({ title: "Error al cerrar la obra", variant: "destructive" });
      throw new Error("close failed");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelProject();
      toast({ title: "Obra cancelada" });
    } catch {
      toast({ title: "Error al cancelar la obra", variant: "destructive" });
      throw new Error("cancel failed");
    }
  };

  const handleAssign = async () => {
    if (!selectedCompanyId) return;
    setIsAssigning(true);
    try {
      await assignCompany({ companyId: selectedCompanyId, includeSubcontractors });
      toast({ title: "Empresa asignada correctamente" });
      setShowAssignDialog(false);
      setSelectedCompanyId("");
      setCompanySearch("");
      setIncludeSubcontractors(false);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Error al asignar empresa";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemove = async (companyId: string, companyName: string) => {
    try {
      await removeCompany(companyId);
      toast({ title: `${companyName} eliminada de la obra` });
    } catch {
      toast({ title: "Error al eliminar la empresa", variant: "destructive" });
    }
  };

  const assignedCompanyIds = new Set(assignments.map((a) => a.companyId));
  const availableCompanies = companies.filter(
    (c) => c.active && !assignedCompanyIds.has(c.id!)
  ) as CompanySimple[];

  const filteredCompanies = availableCompanies.filter((c) => {
    const q = companySearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.taxId ?? "").toLowerCase().includes(q);
  });

  const isEditable =
    project?.status === ProjectStatus.Active ||
    project?.status === ProjectStatus.PendingClosure;

  if (isLoading) return <Loader text="" />;
  if (!project) return null;

  return (
    <div>
      <ProjectDetailHeader projectName={project.name} />

      <div className="container mx-auto px-4 py-8 space-y-8">
        <EditableProjectInfo
          project={project}
          onUpdate={handleUpdate}
          onClose={handleClose}
          onCancel={handleCancel}
          companiesToRelease={companiesToRelease}
        />
      </div>

      {/* Tabs de contenido */}
      <div className="container mx-auto px-4 pb-8 space-y-8">
        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 bg-playGrey border border-playBlueLight" style={{ gridTemplateColumns: "1fr" }}>
            <TabsTrigger
              value="companies"
              className="flex items-center gap-2 text-brand-primary data-[state=active]:bg-playBlueLight data-[state=active]:text-white"
            >
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Empresas asignadas</span>
              ({assignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-4">
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-brand-primary text-base">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-brand-primary" />
                    Empresas asignadas ({assignments.length})
                  </div>
                  {isEditable && (
                    <Button size="sm" onClick={() => setShowAssignDialog(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Asignar empresa
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {assignments.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No hay empresas asignadas todavía</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {assignments.map((a) => (
                      <li key={a.id} className="flex items-center justify-between px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{a.companyName}</p>
                          <p className="text-xs text-gray-400">{a.companyTaxId}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">
                            Desde {formatDate(a.assignedDate)}
                          </span>
                          {isEditable && (
                            <button
                              onClick={() => handleRemove(a.companyId, a.companyName ?? "")}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Eliminar de la obra"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog: asignar empresa */}
      <Dialog open={showAssignDialog} onOpenChange={(open) => {
        if (!open) { setCompanySearch(""); setSelectedCompanyId(""); setIncludeSubcontractors(false); }
        setShowAssignDialog(open);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar empresa a la obra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar empresa
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    className="w-full border rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Buscar por nombre o CIF..."
                    value={companySearch}
                    onChange={(e) => {
                      setCompanySearch(e.target.value);
                      setSelectedCompanyId("");
                      setIsCompanyDropdownOpen(true);
                    }}
                    onFocus={() => setIsCompanyDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsCompanyDropdownOpen(false), 150)}
                  />
                </div>
                {isCompanyDropdownOpen && filteredCompanies.length > 0 && (
                  <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover py-1 shadow-md">
                    {filteredCompanies.map((c) => (
                      <li
                        key={c.id}
                        className="cursor-pointer px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                        onMouseDown={() => {
                          setSelectedCompanyId(c.id!);
                          setCompanySearch(`${c.name} (${c.taxId})`);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        {c.name} <span className="text-muted-foreground">{c.taxId}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {isCompanyDropdownOpen && companySearch.length > 0 && filteredCompanies.length === 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover px-3 py-2 text-sm text-muted-foreground shadow-md">
                    Sin resultados
                  </div>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSubcontractors}
                onChange={(e) => setIncludeSubcontractors(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">
                Incluir también sus subcontratistas activos
              </span>
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAssign} disabled={!selectedCompanyId || isAssigning}>
                {isAssigning ? "Asignando..." : "Asignar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
