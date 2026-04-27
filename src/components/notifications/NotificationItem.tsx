"use client";

import { UserNotification, UserNotificationSubtype } from "@/types/notification";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/app/utils/utis";
import { useNotificationStore } from "@/hooks/useNotificationStore";

interface NotificationItemProps {
  notification: UserNotification;
}

function subtypeIcon(subtype: UserNotificationSubtype) {
  switch (subtype) {
    case UserNotificationSubtype.DocumentValidatedByAI:
      return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
    case UserNotificationSubtype.DocumentPendingManual:
      return <Clock className="w-4 h-4 text-amber-500 shrink-0" />;
    case UserNotificationSubtype.DocumentRejected:
      return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    case UserNotificationSubtype.DocumentExpiredOnUpload:
      return <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />;
  }
}

function subtypeLabel(subtype: UserNotificationSubtype): string {
  switch (subtype) {
    case UserNotificationSubtype.DocumentValidatedByAI:
      return "Validado por IA";
    case UserNotificationSubtype.DocumentPendingManual:
      return "Pendiente de validación manual";
    case UserNotificationSubtype.DocumentRejected:
      return "Rechazado";
    case UserNotificationSubtype.DocumentExpiredOnUpload:
      return "Subido caducado";
  }
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotificationStore();

  const subject = notification.workerName
    ? notification.workerName
    : notification.supplierName ?? notification.companyName ?? "Entidad";

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const date = new Date(notification.createdAt);
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
        !notification.isRead && "bg-blue-50/60"
      )}
    >
      {subtypeIcon(notification.subtype)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {notification.documentTypeName ?? "Documento"}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {subject}
          {notification.companyName && notification.workerName
            ? ` · ${notification.companyName}`
            : ""}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{subtypeLabel(notification.subtype)}</p>
        <p className="text-xs text-gray-300 mt-0.5">{formattedDate}</p>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-playOrange shrink-0 mt-1" />
      )}
    </button>
  );
}
