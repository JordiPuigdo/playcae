import { EntityStatus } from "@/types/document";
import { Badge } from "./ui/Badge";

interface DocumentStatusBadgeProps {
  status: EntityStatus;
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const getStatusConfig = (status: EntityStatus) => {
    switch (status) {
      case EntityStatus.Approved:
        return {
          variant: "default" as const,
          className: "bg-success text-white hover:bg-success/80",
          text: "Validado",
        };
      case EntityStatus.ValidatedByAI:
        return {
          variant: "default" as const,
          className: "bg-success text-white hover:bg-success/80",
          text: "Validado por IA",
        };
      case EntityStatus.ExpiredByAI:
        return {
          variant: "destructive" as const,
          className: "text-white",
          text: "Caducado por IA",
        };
      case EntityStatus.Rejected:
        return {
          variant: "destructive" as const,
          className: "text-white",
          text: "Rechazado",
        };
      case EntityStatus.Expired:
        return {
          variant: "destructive" as const,
          className: "text-white",
          text: "Expirado",
        };
      case EntityStatus.Pending:
      default:
        return {
          variant: "secondary" as const,
          className: "bg-pending text-white hover:bg-pending/80",
          text: "Pendiente",
        };
      case EntityStatus.PendingManualy:
        return {
          variant: "destructive" as const,
          className: "text-white",
          text: "Pendiente Validación",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.text}
    </Badge>
  );
};
