import { Badge } from "./ui/Badge";
import { Worker, WorkerStatus } from "@/types/worker";

interface WorkerStatusBadgeProps {
  status: WorkerStatus;
}

export const WorkerStatusBadge = ({ status }: WorkerStatusBadgeProps) => {
  const getStatusConfig = (status: Worker["status"]) => {
    switch (status) {
      case WorkerStatus.Approved:
        return {
          className:
            "bg-playGreen text-white border border-playGreen/40 shadow-sm",
          text: "Apto",
          enumName: "WorkerStatus.Approved",
        };

      case WorkerStatus.Rejected:
        return {
          className:
            "bg-securityRed text-white border border-securityRed/40 shadow-sm hover:bg-securityRed/80",
          text: "No apto",
          enumName: "WorkerStatus.Rejected",
        };

      default:
        return {
          className:
            "bg-playYellow text-black border border-playYellow/40 shadow-sm",
          text: "Pendiente",
          enumName: "WorkerStatus.Pending",
        };
    }
  };

  const config = getStatusConfig(status);

  return <Badge className={config.className} title={config.enumName}>{config.text}</Badge>;
};
