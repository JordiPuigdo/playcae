"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Header() {
  const router = useRouter();
  const { logout, logoUrl } = useAuthStore();

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
      <button
        onClick={handleLogout}
        className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition"
        aria-label="Cerrar sesión"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
