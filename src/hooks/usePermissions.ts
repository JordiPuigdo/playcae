import { useLogin } from './useLogin';

export const usePermissions = () => {
  const { user } = useLogin();

  const hasAccess = (section: string): boolean => {
    if (!user) return false;

    if (user.role === 'admin') return true;

    const subcontractorPermissions = ['/dashboard/company/1'];
    return subcontractorPermissions.includes(section);
  };

  return { role: user?.role, hasAccess };
};
