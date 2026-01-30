"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function DocumentsManagementPage() {
  const { t } = useTranslation();
  
  return <div className="container mx-auto px-4 py-8 space-y-8">{t("dashboard.comingSoon")}</div>;
}
