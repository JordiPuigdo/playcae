import { EntityStatus } from "@/types/document";
import { Badge } from "./ui/Badge";
import { Worker } from "@/types/worker";

interface WorkerStatusBadgeProps {
  status: Worker["status"];
}

export const WorkerStatusBadge = ({ status }: WorkerStatusBadgeProps) => {
  const getStatusConfig = (status: Worker["status"]) => {
    switch (status) {
      case EntityStatus.Approved:
        return {
          variant: "default" as const,
          className: "bg-success text-white hover:bg-success/80",
          text: "Apto",
        };
      case EntityStatus.Rejected:
        return {
          variant: "destructive" as const,
          className: "bg-red-500 text-white px-2 py-1 rounded",
          text: "No apto",
        };
      case EntityStatus.Pending:
      default:
        return {
          variant: "secondary" as const,
          className: "bg-pending text-white hover:bg-pending/80",
          text: "Pendiente",
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
