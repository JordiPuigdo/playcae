"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 sticky top-0 z-50 bg-white shadow flex items-center justify-between px-6">
      <Image
        src="/assets/girbau.png"
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
