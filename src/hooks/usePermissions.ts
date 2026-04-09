import { UserRole } from "@/types/user";
import { useAuthStore } from "./useAuthStore";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasAccess = (section: string): boolean => {
    if (!user) return false;

    if (user.role === UserRole.Admin || user.role === UserRole.SuperAdmin) return true;

    // Permisos para rol Company (subcontratistas)
    if (user.role === UserRole.Company) {
      const companyPermissions = [
        "/dashboard",
        `/dashboard/companies/${user.companyId}`, // Su propia empresa
        "/dashboard/subcontractors",
      ];
      return companyPermissions.some(
        (p) => section === p || section.startsWith(p + "/")
      );
    }

    if (user.role === UserRole.PRLManager) {
      const prlPermissions = [
        "/dashboard",
        "/dashboard/documents",
        "/dashboard/access-history",
        "/access-control",
      ];
      return prlPermissions.some(
        (p) => section === p || section.startsWith(p + "/")
      );
    }

    return false;
  };

  return { role: user?.role, hasAccess };
};
