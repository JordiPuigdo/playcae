"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import LanguageSelector from "@/components/LanguageSelector";
import NotificationPanel from "@/components/notifications/NotificationPanel";
import { UserRole } from "@/types/user";

export default function Header() {
  const router = useRouter();
  const { logout, logoUrl, user, availableSites, selectedSiteId, setSelectedSite, isAuthenticated } =
    useAuthStore();
  const { t } = useTranslation();
  const { unreadCount } = useNotificationStore();
  const [panelOpen, setPanelOpen] = useState(false);

  // Connect SSE stream while the user is authenticated
  useNotificationStream(isAuthenticated);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayLogoUrl = logoUrl || "/assets/playcae.png";

  return (
    <header className="h-16 sticky top-0 z-50 bg-white shadow flex items-center justify-between px-6">
      <Image
        src={displayLogoUrl}
        alt="Logo Play CAE"
        width={90}
        height={35}
        className="ml-2"
      />
      <div className="flex items-center gap-4">
        {user?.role === UserRole.PRLManager && availableSites.length > 1 && (
          <Select
            value={selectedSiteId || ""}
            onValueChange={setSelectedSite}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecciona sede" />
            </SelectTrigger>
            <SelectContent>
              {availableSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-playOrange"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-playOrange text-white text-[10px] font-bold px-1 leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
        </div>

        <LanguageSelector variant="minimal" showName={false} />
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
          aria-label={t("header.logout")}
        >
          {t("header.logout")}
        </button>
      </div>
    </header>
  );
}
