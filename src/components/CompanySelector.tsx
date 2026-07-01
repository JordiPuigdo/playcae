"use client";

import { UserCompanyOption } from "@/types/user";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CompanyChoiceOption,
  CompanyChoiceSelector,
} from "@/components/CompanyChoiceSelector";

interface CompanySelectorProps {
  companies: UserCompanyOption[];
  isLoading?: boolean;
  onSelect: (companyId: string) => void;
}

export const CompanySelector = ({
  companies,
  isLoading = false,
  onSelect,
}: CompanySelectorProps) => {
  const { t } = useTranslation();
  const options: CompanyChoiceOption[] = companies.map((company) => ({
    id: company.id,
    name: company.name,
    badge: company.isNew ? t("companySelector.pendingBadge") : null,
  }));

  return (
    <CompanyChoiceSelector
      title={t("companySelector.title")}
      description={t("companySelector.description")}
      loadingText={t("companySelector.loading")}
      continueText={t("companySelector.continue")}
      companies={options}
      isLoading={isLoading}
      onSelect={onSelect}
    />
  );
};
