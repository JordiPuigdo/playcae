import { UserRole } from "@/types/user";
import { useAuthStore } from "./useAuthStore";
import { useActiveCompanyId } from "./useActiveCompanyId";

export const usePermissions = () => {
  const { user, licenseSummary } = useAuthStore();
  const activeCompanyId = useActiveCompanyId();

  const hasAccess = (section: string): boolean => {
    if (!user) return false;

    if (user.role === UserRole.SuperAdmin) {
      const superAdminPermissions = [
        "/dashboard/settings/licenses",
        "/dashboard/leads",
      ];
      return superAdminPermissions.some(
        (p) => section === p || section.startsWith(p + "/")
      );
    }

    if (user.role === UserRole.Admin) {
      if (section === "/dashboard/projects" || section.startsWith("/dashboard/projects/")) {
        return licenseSummary?.enableProjects === true;
      }
      if (section === "/dashboard/internal-workers" || section.startsWith("/dashboard/internal-workers/")) {
        return licenseSummary?.enableInternalWorkers === true;
      }
      if (section === "/dashboard/roles-permissions" || section.startsWith("/dashboard/roles-permissions/")) {
        return licenseSummary?.enableInternalWorkers === true;
      }
      return true;
    }

    if (user.role === UserRole.Company) {
      const companyPermissions = [
        "/dashboard",
        `/dashboard/companies/${activeCompanyId}`,
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

    if (user.role === UserRole.Marketing) {
      return section === "/dashboard/blog" || section.startsWith("/dashboard/blog/");
    }

    return false;
  };

  return { role: user?.role, hasAccess };
};
