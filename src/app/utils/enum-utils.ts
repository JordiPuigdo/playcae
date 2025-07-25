import { EntityStatus } from "@/types/document";

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
