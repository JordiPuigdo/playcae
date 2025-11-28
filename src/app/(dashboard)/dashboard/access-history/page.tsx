"use client";

import { useState } from "react";
import { AccessHistoryFilters } from "@/components/AccessHistoryFilters";
import { AccessHistoryTable } from "@/components/AccessHistoryTable";
import { AccessHistoryKPIs } from "@/components/AccessHistoryKPIs";
import { AccessHistoryDetailPanel } from "@/components/AccessHistoryDetailPanel";
import { useAccessHistory } from "@/hooks/useAccessHistory";
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
    <div className="space-y-6">
      {/* Título página */}
      <div className="flex items-center gap-3">
        <History className="h-8 w-8 text-brand-primary" />
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Histórico de Accesos
          </h1>
          <p className="text-playBlueLight">
            Registro completo de entradas y salidas de técnicos
          </p>
        </div>
      </div>

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
            Registros de acceso
          </CardTitle>
          <CardDescription className="text-playBlueLight">
            {history.length}{" "}
            {history.length === 1
              ? "registro encontrado"
              : "registros encontrados"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AccessHistoryTable
            history={history}
            onSelectEntry={handleSelectEntry}
          />
        </CardContent>
      </Card>

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
