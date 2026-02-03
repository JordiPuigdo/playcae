import { Company, CompanyStatus } from "@/types/company";
import { Badge } from "./ui/Badge";

interface StatusBadgeProps {
  status: Company["status"];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: Company["status"]) => {
    switch (status) {
      case CompanyStatus.Approved:
        return {
          variant: "default" as const,
          className:
            "bg-playGreen text-white shadow-sm border border-playGreen/40",
          text: "Apta",
          enumName: "CompanyStatus.Approved",
        };
      case CompanyStatus.Rejected:
        return {
          variant: "destructive" as const,
          className:
            "bg-brand-secondary text-white shadow-sm border border-brand-secondary/40",
          text: "No apta",
          enumName: "CompanyStatus.Rejected",
        };
      case CompanyStatus.Pending:
      default:
        return {
          variant: "secondary" as const,
          className:
            "bg-playYellow text-black shadow-sm border border-playYellow/40",
          text: "Pendiente",
          enumName: "CompanyStatus.Pending",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className} title={config.enumName}>
      {config.text}
    </Badge>
  );
};
