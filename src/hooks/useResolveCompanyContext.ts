import { useCallback } from "react";
import { useAuthStore } from "./useAuthStore";
import { useCompanyService } from "./useCompanyService";
import { useSelectParentCompany } from "./useSelectParentCompany";
import { ParentCompany } from "@/types/user";

export const useResolveCompanyContext = () => {
  const setAvailableParentCompanies = useAuthStore(
    (state) => state.setAvailableParentCompanies
  );
  const setPendingParentCompanySelection = useAuthStore(
    (state) => state.setPendingParentCompanySelection
  );
  const companyService = useCompanyService();
  const selectParentCompany = useSelectParentCompany();

  const resolveCompanyContext = useCallback(
    async (companyId: string) => {
      const response = await companyService.getParentCompanies(companyId);
      const parents: ParentCompany[] = (response?.data ?? []).map((c) => ({
        id: c.userId,
        name: c.name,
      }));
      setAvailableParentCompanies(parents);

      if (parents.length > 1) {
        setPendingParentCompanySelection(true);
        return;
      }

      const parentId = parents[0]?.id ?? companyId;
      await selectParentCompany(parentId);
    },
    [
      companyService,
      selectParentCompany,
      setAvailableParentCompanies,
      setPendingParentCompanySelection,
    ]
  );

  return { resolveCompanyContext };
};
