import { CompanyStatus } from "@/types/company";
import { EntityStatus } from "@/types/document";
import { WorkerStatus } from "@/types/worker";

export function getEntityStatusLabel(status: EntityStatus | string): string {
  if (typeof status === "string" && status === "Todos") {
    return "Todos los estados";
  }

  const statusKey = typeof status === "string" ? status : EntityStatus[status];

  const labels: Record<string, string> = {
    Pending: "Pendiente",
    Approved: "Aprobada",
    Rejected: "Rechazada",
    Expired: "Expirada",
    Todos: "Todos los estados",
  };

  return labels[statusKey] || statusKey;
}

export function getEntityStatusOptions() {
  return Object.entries(EntityStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key]) => ({
      value: key,
      label: getEntityStatusLabel(key),
    }));
}

export function getWorkerStatusLabel(status: WorkerStatus | string): string {
  if (typeof status === "string" && status === "Todos") {
    return "Todos los estados";
  }

  const statusKey = typeof status === "string" ? status : WorkerStatus[status];

  const labels: Record<string, string> = {
    Approved: "Apto",
    Rejected: "No apto",
    Todos: "Todos los estados",
  };

  return labels[statusKey] || statusKey;
}

export function getWorkerStatusOptions() {
  return Object.entries(WorkerStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key]) => ({
      value: key,
      label: getWorkerStatusLabel(key),
    }));
}

export function getCompanyStatusLabel(status: CompanyStatus | string): string {
  if (typeof status === "string" && status === "Todos") {
    return "Todos los estados";
  }

  const statusKey = typeof status === "string" ? status : CompanyStatus[status];

  const labels: Record<string, string> = {
    Approved: "Apta",
    Rejected: "No apta",
    Pending: "Pendiente",
    Todos: "Todos los estados",
  };

  return labels[statusKey] || statusKey;
}

export function getCompanyStatusOptions() {
  return Object.entries(CompanyStatus)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key]) => ({
      value: key,
      label: getCompanyStatusLabel(key),
    }));
}
