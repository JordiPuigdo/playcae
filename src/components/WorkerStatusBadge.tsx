import { Badge } from "./ui/Badge";
import { Worker, WorkerStatus } from "@/types/worker";

interface WorkerStatusBadgeProps {
  status: Worker["status"];
}

export const WorkerStatusBadge = ({ status }: WorkerStatusBadgeProps) => {
  const getStatusConfig = (status: Worker["status"]) => {
    switch (status) {
      case WorkerStatus.Approved:
        return {
          variant: "default" as const,
          className: "bg-success text-white hover:bg-success/80",
          text: "Apto",
        };
      case WorkerStatus.Rejected:
        return {
          variant: "destructive" as const,
          className: "bg-red-500 text-white px-2 py-1 rounded",
          text: "No apto",
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
