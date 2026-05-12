import { LeadStatus } from "@/types/lead";
import { Badge } from "./ui/Badge";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const STATUS_CONFIG: Record<LeadStatus, { className: string; text: string }> = {
  [LeadStatus.New]: {
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    text: "Nuevo",
  },
  [LeadStatus.Contacted]: {
    className: "bg-playOrange/10 text-playOrange border border-playOrange/30",
    text: "Contactado",
  },
  [LeadStatus.QuoteSent]: {
    className: "bg-playYellow/20 text-yellow-700 border border-playYellow/40",
    text: "Presupuesto enviado",
  },
  [LeadStatus.PendingClaim]: {
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    text: "Pendiente reclamar",
  },
  [LeadStatus.Converted]: {
    className: "bg-playGreen/10 text-playGreen border border-playGreen/30",
    text: "Convertido",
  },
  [LeadStatus.Rejected]: {
    className: "bg-red-50 text-red-700 border border-red-200",
    text: "Rechazado",
  },
  [LeadStatus.Lost]: {
    className: "bg-gray-100 text-gray-500 border border-gray-200",
    text: "Perdido",
  },
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[LeadStatus.New];

  return (
    <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
      {config.text}
    </Badge>
  );
}
