import { UserRole } from "@/types/user";
import { useAuthStore } from "./useAuthStore";

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasAccess = (section: string): boolean => {
    if (!user) return false;

    if (user.role === UserRole.Admin) return true;

    const subcontractorPermissions = ["/dashboard/company/1"];
    return subcontractorPermissions.includes(section);
  };

  return { role: user?.role, hasAccess };
};
