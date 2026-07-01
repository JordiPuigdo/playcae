import { useAuthStore } from "./useAuthStore";

export const useActiveCompanyId = (): string | undefined => {
  const selectedCompanyId = useAuthStore((state) => state.selectedCompanyId);
  const user = useAuthStore((state) => state.user);
  return selectedCompanyId ?? user?.companyId ?? undefined;
};
