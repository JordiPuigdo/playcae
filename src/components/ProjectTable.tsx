"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HardHat, Building2, MapPin } from "lucide-react";
import { cn } from "@/app/utils/utis";
import { useLastVisited } from "@/hooks/useLastVisited";
import { ProjectList, ProjectStatus } from "@/types/project";
import { TableCard } from "./TableCard";
import { SortableHeader } from "./SortableHeader";
import { useSortableTable } from "@/hooks/useSortableTable";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "./ui/Table";
import { ProjectRowActions } from "./ProjectRowActions";
import { formatDate } from "@/app/utils/date";

type SortField = "name" | "startDate" | "endDate" | "status" | "assignedCompaniesCount" | "daysLeft";

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

const getDaysLeft = (endDate: string) =>
  Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

const TERMINATED_STATUSES = new Set([
  ProjectStatus.Closed,
  ProjectStatus.ClosedBySystem,
  ProjectStatus.Cancelled,
]);

interface ProjectTableProps {
  projects: ProjectList[];
  totalCount: number;
  onEdit?: (project: ProjectList) => void;
  onCancel?: (project: ProjectList) => void;
}

export const ProjectTable = ({ projects, totalCount, onEdit, onCancel }: ProjectTableProps) => {
  const router = useRouter();
  const { set: setLastVisited, get: getLastVisited } = useLastVisited("projects");
  const [lastVisitedId, setLastVisitedId] = useState<string | null>(null);

  useEffect(() => {
    setLastVisitedId(getLastVisited());
  }, []);

  const { sortField, sortDirection, handleSort, sortedData: sortedProjects } =
    useSortableTable<ProjectList, SortField>(projects, (a, b, field) => {
      switch (field) {
        case "name":                   return a.name.localeCompare(b.name);
        case "startDate":              return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "endDate":                return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case "status":                 return a.status - b.status;
        case "assignedCompaniesCount": return a.assignedCompaniesCount - b.assignedCompaniesCount;
        case "daysLeft":               return getDaysLeft(a.endDate) - getDaysLeft(b.endDate);
      }
    });

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <HardHat className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-lg font-medium">No hay obras que coincidan con los filtros</p>
        <p className="text-sm">Prueba a ajustar los criterios de búsqueda</p>
      </div>
    );
  }

  const countLabel =
    projects.length === totalCount
      ? `${totalCount} obra${totalCount !== 1 ? "s" : ""}`
      : `${projects.length} de ${totalCount} obra${totalCount !== 1 ? "s" : ""}`;

  return (
    <TableCard title={countLabel}>
        <Table>
          <TableHeader>
            <TableRow className="bg-playGrey/50">
              <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold">Obra</SortableHeader>
              <TableHead className="text-brand-primary font-semibold">Ubicación</TableHead>
              <SortableHeader field="startDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold">Inicio</SortableHeader>
              <SortableHeader field="endDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold">Fin</SortableHeader>
              <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold">Estado</SortableHeader>
              <SortableHeader field="assignedCompaniesCount" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold text-center">Empresas</SortableHeader>
              <SortableHeader field="daysLeft" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-brand-primary font-semibold">Plazo</SortableHeader>
              {(onEdit || onCancel) && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.map((project) => {
              const daysLeft = getDaysLeft(project.endDate);
              const isRunning =
                project.status === ProjectStatus.Active ||
                project.status === ProjectStatus.PendingClosure;
              const isTerminated = TERMINATED_STATUSES.has(project.status);
              return (
                <TableRow
                  key={project.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isTerminated ? "opacity-60" : "",
                    lastVisitedId === project.id
                      ? "bg-playOrange/10 ring-1 ring-inset ring-playOrange/30 hover:bg-playOrange/15"
                      : "hover:bg-playOrange/5"
                  )}
                  onClick={() => {
                    if (project.id) setLastVisited(project.id);
                    router.push(`/dashboard/projects/${project.id}`);
                  }}
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    {project.siteName && (
                      <div className="text-xs text-gray-400 mt-0.5">{project.siteName}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {project.address ? (
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[200px]">{project.address}</span>
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(project.startDate)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(project.endDate)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[project.status]}`}
                    >
                      {STATUS_LABELS[project.status]}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Building2 className="h-3.5 w-3.5" />
                      {project.assignedCompaniesCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.status === ProjectStatus.Active && daysLeft >= 0 ? (
                      <span
                        className={`text-xs font-medium ${
                          daysLeft <= 7
                            ? "text-red-600"
                            : daysLeft <= 14
                              ? "text-orange-600"
                              : "text-gray-500"
                        }`}
                      >
                        {daysLeft === 0 ? "Vence hoy" : `${daysLeft}d`}
                      </span>
                    ) : isRunning ? (
                      <span className="text-xs text-yellow-600 font-medium">En cierre</span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </TableCell>
                  {(onEdit || onCancel) && (
                    <TableCell className="text-right">
                      {onEdit && onCancel && (
                        <ProjectRowActions project={project} onEdit={onEdit} onCancel={onCancel} />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    </TableCard>
  );
};
