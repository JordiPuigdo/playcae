"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/SideBar";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserConfiguration } from "@/hooks/useUserConfiguration";
import { useCompanyService } from "@/hooks/useCompanyService";
import { useSelectParentCompany } from "@/hooks/useSelectParentCompany";
import { Toaster } from "@/components/ui/Toaster";
import { UserRole } from "@/types/user";
import { UserService } from "@/services/user.services";
import { ParentCompanySelector } from "@/components/ParentCompanySelector";

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
    availableSites,
    setAvailableSites,
    selectedSiteId,
    setSelectedSite,
    selectedParentCompanyId,
    availableParentCompanies,
    pendingParentCompanySelection,
    setAvailableCompanies,
  } = useAuthStore();
  const { applyLogoForOwner } = useUserConfiguration();
  const companyService = useCompanyService();
  const selectParentCompany = useSelectParentCompany();
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

  useEffect(() => {
    const loadLogoIfNeeded = async () => {
      if (user && !logoUrl) {
        const isAdmin = user.role === UserRole.Admin || user.role === UserRole.SuperAdmin;
        const logoOwnerId = isAdmin
          ? user.userId
          : selectedParentCompanyId || user.companyId;

        if (logoOwnerId) {
          await applyLogoForOwner(logoOwnerId);
        }
      }
    };

    loadLogoIfNeeded();
  }, [user, logoUrl, selectedParentCompanyId, applyLogoForOwner]);

  useEffect(() => {
    const refreshMyCompanies = async () => {
      if (!user || user.role !== UserRole.Company) return;
      try {
        const response = await companyService.getMyCompanies();
        if (response?.data) {
          setAvailableCompanies(response.data);
        }
      } catch (error) {
        console.error("Error refreshing user companies:", error);
      }
    };

    refreshMyCompanies();
  }, [user, companyService, setAvailableCompanies]);

  const handleParentCompanySelect = async (parentCompanyId: string) => {
    await selectParentCompany(parentCompanyId);
  };

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
          <Toaster />
        </div>
      </div>

      {pendingParentCompanySelection &&
        user?.role === UserRole.Company &&
        availableParentCompanies.length > 1 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-playGrey/80 backdrop-blur-sm p-4">
            <ParentCompanySelector
              companies={availableParentCompanies}
              onSelect={handleParentCompanySelect}
            />
          </div>
        )}
    </>
  );
}
