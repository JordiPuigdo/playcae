interface WorkerCountBadgeProps {
  approvedWorkers?: number;
  totalWorkers?: number;
}

export const WorkerCountBadge = ({
  approvedWorkers = 0,
  totalWorkers = 0,
}: WorkerCountBadgeProps) => {
  const hasApproved = approvedWorkers > 0;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 shadow-sm border ${
        hasApproved
          ? "bg-playGreen/10 text-playGreen border-playGreen/40"
          : "bg-securityRed/10 text-securityRed border-securityRed/40"
      }`}
    >
      {approvedWorkers}/{totalWorkers}
    </span>
  );
};
