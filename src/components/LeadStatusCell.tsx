import { LeadEventType, LeadListItem, LeadStatus } from "@/types/lead";
import { formatDate } from "@/app/utils/date";
import { LeadStatusBadge } from "./LeadStatusBadge";

const STATUS_LABEL: Record<LeadStatus, string> = {
  [LeadStatus.New]: "Nuevo",
  [LeadStatus.Contacted]: "Contactado",
  [LeadStatus.QuoteSent]: "Presup. enviado",
  [LeadStatus.PendingClaim]: "Pend. reclamar",
  [LeadStatus.Converted]: "Convertido",
  [LeadStatus.Rejected]: "Rechazado",
  [LeadStatus.Lost]: "Perdido",
};

type Props = Pick<
  LeadListItem,
  "status" | "lastEventType" | "lastEventDate" | "lastEventPreviousStatus" | "lastEventNewStatus" | "lastNote"
>;

export function LeadStatusCell({
  status,
  lastEventType,
  lastEventDate,
  lastEventPreviousStatus,
  lastEventNewStatus,
  lastNote,
}: Props) {
  const hasTransition =
    lastEventType === LeadEventType.StatusChanged &&
    lastEventPreviousStatus !== undefined &&
    lastEventNewStatus !== undefined &&
    lastEventDate;

  return (
    <div className="relative group flex flex-col gap-0.5">
      <LeadStatusBadge status={status} />

      {hasTransition && (
        <span className="text-[11px] text-muted-foreground leading-tight whitespace-nowrap">
          {STATUS_LABEL[lastEventPreviousStatus!]} → {STATUS_LABEL[lastEventNewStatus!]}
          <span className="mx-1">·</span>
          {formatDate(lastEventDate)}
        </span>
      )}

      {lastNote && (
        <div
          className="
            pointer-events-none absolute bottom-full left-0 z-50 mb-1.5
            w-64 rounded-md border border-border bg-popover px-3 py-2
            text-xs text-popover-foreground shadow-md
            invisible opacity-0 group-hover:visible group-hover:opacity-100
            transition-opacity duration-150
          "
        >
          <p className="font-medium text-muted-foreground mb-0.5">Último comentario</p>
          <p className="break-words">{lastNote}</p>
        </div>
      )}
    </div>
  );
}
