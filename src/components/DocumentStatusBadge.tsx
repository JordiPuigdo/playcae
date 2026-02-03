import { EntityStatus } from "@/types/document";

interface DocumentStatusBadgeProps {
  status: EntityStatus;
}

export const DocumentStatusBadge = ({ status }: DocumentStatusBadgeProps) => {
  const getColor = (status: EntityStatus) => {
    switch (status) {
      case EntityStatus.Approved:
      case EntityStatus.ValidatedByAI:
        return "bg-playGreen border-playGreen/60";

      case EntityStatus.Rejected:
      case EntityStatus.Expired:
      case EntityStatus.ExpiredByAI:
        return "bg-brand-secondary border-brand-secondary/60";

      case EntityStatus.PendingManualy:
      case EntityStatus.Pending:
      default:
        return "bg-playYellow border-playYellow/60";
    }
  };

  const getStatusName = (status: EntityStatus): string => {
    return EntityStatus[status];
  };

  return (
    <a
      href={`#${getStatusName(status)}`}
      onClick={(e) => e.preventDefault()}
      className={`inline-block w-6 h-6 rounded-full border shadow-sm cursor-default ${getColor(
        status
      )}`}
    />
  );
};
