"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import SupportChat from "@/components/SupportChat";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/SideBar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserConfiguration } from "@/hooks/useUserConfiguration";
import { Toaster } from "@/components/ui/Toaster";
import { UserRole } from "@/types/user";
import { UserService } from "@/services/user.services";

const hasAuthStoreHydrated = () =>
  typeof window !== "undefined" &&
  useAuthStore.persist?.hasHydrated?.() === true;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    logoUrl,
    setLogoUrl,
    availableSites,
    setAvailableSites,
    selectedSiteId,
    setSelectedSite,
  } = useAuthStore();
  const { getLogoUrl } = useUserConfiguration();
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(hasAuthStoreHydrated);

  useEffect(() => {
    const unsubscribe = useAuthStore.persist?.onFinishHydration?.(() => {
      setHasHydrated(true);
    });

    if (hasAuthStoreHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated || user !== null) {
      return;
    }

    router.replace("/login");
    const fallbackRedirect = window.setTimeout(() => {
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.replace("/login");
      }
    }, 1000);

    return () => {
      window.clearTimeout(fallbackRedirect);
    };
  }, [hasHydrated, user, router]);

  const noIndexHead = (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="googlebot" content="noindex, nofollow" />
    </>
  );

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

  useEffect(() => {
    const loadPrlSitesIfNeeded = async () => {
      if (!user || user.role !== UserRole.PRLManager) return;
      if (availableSites.length > 0 && selectedSiteId) return;

      try {
        const userService = new UserService();
        const response = await userService.getSitesByUserId(user.userId);
        const sites = response.data || [];
        const options = sites
          .filter((site) => !!site.id)
          .map((site) => ({
            id: site.id as string,
            name: site.name,
          }));

        setAvailableSites(options);
        if (!selectedSiteId && options.length > 0) {
          setSelectedSite(options[0].id);
        }
      } catch (error) {
        console.error("Error loading PRL sites in dashboard:", error);
      }
    };

    loadPrlSitesIfNeeded();
  }, [user, availableSites.length, selectedSiteId, setAvailableSites, setSelectedSite]);

  if (!hasHydrated || user === null) {
    return (
      <>
        {noIndexHead}
        <Loader text={""} />
      </>
    );
  }
  return (
    <>
      {noIndexHead}
      <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 ml-64 h-full overflow-hidden">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          {/*user && <SupportChat />*/}
          <Toaster />
        </div>
      </div>
    </>
  );
}
