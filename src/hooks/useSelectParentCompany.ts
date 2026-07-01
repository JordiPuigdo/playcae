import { useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { useUserConfiguration } from "./useUserConfiguration";

export const useSelectParentCompany = () => {
  const setSelectedParentCompany = useAuthStore(
    (state) => state.setSelectedParentCompany
  );
  const { applyLogoForOwner } = useUserConfiguration();

  return useCallback(
    async (companyId: string) => {
      await applyLogoForOwner(companyId);
      setSelectedParentCompany(companyId);
    },
    [applyLogoForOwner, setSelectedParentCompany]
  );
};
