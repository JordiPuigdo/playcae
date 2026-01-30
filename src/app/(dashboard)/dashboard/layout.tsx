"use client";

import { useEffect } from "react";
import Loader from "@/components/Loader";
import SupportChat from "@/components/SupportChat";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/SideBar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserConfiguration } from "@/hooks/useUserConfiguration";
import { Toaster } from "@/components/ui/Toaster";
import { UserRole } from "@/types/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logoUrl, setLogoUrl } = useAuthStore();
  const { getLogoUrl } = useUserConfiguration();

  // Cargar logo si el usuario está autenticado pero el logo no está en el store
  useEffect(() => {
    const loadLogoIfNeeded = async () => {
      if (user && !logoUrl) {
        const isAdmin = user.role === UserRole.Admin || user.role === UserRole.SuperAdmin;
        // Para admin usamos su userId, para company usamos el parentCompanyId o companyId
        const logoOwnerId = isAdmin ? user.userId : (user.parentCompanyId || user.companyId);
        
        if (logoOwnerId) {
          try {
            const url = await getLogoUrl(logoOwnerId);
            if (url) {
              setLogoUrl(url);
            }
          } catch (error) {
            // Si falla, simplemente no mostramos logo personalizado
            console.error("Error loading logo:", error);
          }
        }
      }
    };

    loadLogoIfNeeded();
  }, [user, logoUrl]);

  if (user === null) {
    return <Loader text={""} />;
  }

  if (!user) {
    return null;
  }
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64 h-full overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        {/*user && <SupportChat />*/}
        <Toaster />
      </div>
    </div>
  );
}
