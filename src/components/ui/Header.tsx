"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSelector from "@/components/LanguageSelector";

export default function Header() {
  const router = useRouter();
  const { logout, logoUrl } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Usar logo personalizado si existe, si no usar el logo por defecto
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
