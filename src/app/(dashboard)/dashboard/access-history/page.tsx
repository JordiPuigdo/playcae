"use client";

import { useState } from "react";
import { AccessHistoryFilters } from "@/components/AccessHistoryFilters";
import { AccessHistoryTable } from "@/components/AccessHistoryTable";
import { AccessHistoryKPIs } from "@/components/AccessHistoryKPIs";
import { AccessHistoryDetailPanel } from "@/components/AccessHistoryDetailPanel";
import { useAccessHistory } from "@/hooks/useAccessHistory";
import { useTranslation } from "@/hooks/useTranslation";
import { AccessHistoryEntry } from "@/types/accessHistory";

import { History } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

const AccessHistory = () => {
  const { history, filters, updateFilters, clearFilters, companies, kpiData } =
    useAccessHistory();
  const { t } = useTranslation();

  const [selectedEntry, setSelectedEntry] = useState<AccessHistoryEntry | null>(
    null
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSelectEntry = (entry: AccessHistoryEntry) => {
    setSelectedEntry(entry);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between">
              <h1 className="text-2xl h-10 font-bold text-brand-primary flex items-center gap-3">
                <History className="h-7 w-7 text-brand-primary" />
                {t("accessControl.history")}
              </h1>
            </div>
          </div>
          <p className="text-playBlueLight ml-8">
            {t("accessControl.historyDescription")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <AccessHistoryKPIs data={kpiData} />

        {/* Filtros */}
        <AccessHistoryFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          companies={companies}
        />

        {/* Tabla */}
        <Card className="border border-playBlueLight/30 shadow-sm">
          <CardHeader>
            <CardTitle className="text-brand-primary">
              {t("accessControl.accessRecords")}
            </CardTitle>
            <CardDescription className="text-playBlueLight">
              {history.length}{" "}
              {history.length === 1
                ? t("accessControl.recordFound")
                : t("accessControl.recordsFound")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AccessHistoryTable
              history={history}
              onSelectEntry={handleSelectEntry}
            />
          </CardContent>
        </Card>
      </div>

      {/* Panel detalle */}
      <AccessHistoryDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        entry={selectedEntry}
      />
    </div>
  );
};

export default AccessHistory;
