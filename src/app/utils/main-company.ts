import { CompanySimple } from "@/types/company";

export const getMainCompanyId = (
  companies: CompanySimple[]
): string | null => {
  if (!companies.length) return null;

  const mainByFlag = companies.find((c) => c.isMainCompany);
  if (mainByFlag?.id) return mainByFlag.id;

  const mainByParent = companies.find((c) => !c.parentCompanyId);
  if (mainByParent?.id) return mainByParent.id;

  return companies[0].id || null;
};
