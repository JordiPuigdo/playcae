import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AccessHistoryEntry,
  AccessHistoryFilters,
  AccessRecordFilter,
  AccessRecord,
  AccessKPIData,
  mapAccessRecordToEntry,
} from "@/types/accessHistory";
import { AccessService } from "@/services/access.service";
import { format, subDays } from "date-fns";

const accessService = new AccessService();

// Helper para obtener fechas por defecto (últimos 7 días)
const getDefaultDateRange = () => {
  const today = new Date();
  const sevenDaysAgo = subDays(today, 7);
  return {
    startDate: format(sevenDaysAgo, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
  };
};

export const useAccessHistory = (accessCompanyId?: string) => {
  const defaultDates = getDefaultDateRange();

  const [history, setHistory] = useState<AccessHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  const [filters, setFilters] = useState<AccessHistoryFilters>({
    searchTechnician: "",
    company: "",
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
  });

  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );

  const [kpiData, setKpiData] = useState<AccessKPIData>({
    validDocumentationPercentage: 0,
    totalAccessesToday: 0,
    hoursWorkedToday: 0,
    failedAccesses: 0,
    companiesOnSite: 0,
    trend: "stable",
  });

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiFilter: AccessRecordFilter = {
        accessCompanyId: accessCompanyId,
        workerCompanyId: filters.company || undefined,
        searchTerm: filters.searchTechnician || undefined,
        fromDate: filters.startDate || undefined,
        toDate: filters.endDate || undefined,
        page,
        pageSize,
      };

      const response = await accessService.getFiltered(apiFilter);

      if (response.data) {
        const records = response.data.records ?? [];
        const entries = records.map(mapAccessRecordToEntry);
        setHistory(entries);
        setTotalCount(response.data.totalCount ?? 0);

        // Extraer empresas únicas para el filtro
        const uniqueCompanies = new Map<string, string>();
        records.forEach((item) => {
          uniqueCompanies.set(item.workerCompanyId, item.workerCompanyName);
        });
        setCompanies(
          Array.from(uniqueCompanies.entries()).map(([id, name]) => ({
            id,
            name,
          }))
        );

        // Calcular KPIs basados en los datos
        calculateKPIs(records);
      }
    } catch (err) {
      setError("Error al cargar el histórico de accesos");
      console.error("Error fetching access history:", err);
    } finally {
      setLoading(false);
    }
  }, [accessCompanyId, filters, page, pageSize]);

  const calculateKPIs = (records: AccessRecord[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = records.filter((record) =>
      record.entryTime?.startsWith(today)
    );

    const totalAccessesToday = todayRecords.length;
    const failedAccesses = todayRecords.filter(
      (record) => record.status !== 0
    ).length;
    const validAccesses = totalAccessesToday - failedAccesses;

    const validDocumentationPercentage =
      totalAccessesToday > 0
        ? Math.round((validAccesses / totalAccessesToday) * 100)
        : 100;

    // Calcular horas trabajadas hoy
    let hoursWorkedToday = 0;
    todayRecords.forEach((record) => {
      if (record.entryTime && record.exitTime) {
        const entry = new Date(record.entryTime);
        const exit = new Date(record.exitTime);
        hoursWorkedToday += (exit.getTime() - entry.getTime()) / 3600000;
      }
    });

    // Empresas únicas en sitio hoy
    const uniqueCompaniesOnSite = new Set(
      todayRecords.map((record) => record.workerCompanyId)
    );

    // Determinar tendencia (comparar con ayer si hay datos)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const yesterdayRecords = records.filter((record) =>
      record.entryTime?.startsWith(yesterdayStr)
    );

    let trend: "up" | "down" | "stable" = "stable";
    if (todayRecords.length > yesterdayRecords.length) trend = "up";
    else if (todayRecords.length < yesterdayRecords.length) trend = "down";

    setKpiData({
      validDocumentationPercentage,
      totalAccessesToday,
      hoursWorkedToday: Number(hoursWorkedToday.toFixed(1)),
      failedAccesses,
      companiesOnSite: uniqueCompaniesOnSite.size,
      trend,
    });
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const updateFilters = (newFilters: Partial<AccessHistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset page when filters change
  };

  const clearFilters = () => {
    const defaultDates = getDefaultDateRange();
    setFilters({
      searchTechnician: "",
      company: "",
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    });
    setPage(1);
  };

  const refreshHistory = () => {
    fetchHistory();
  };

  return {
    history,
    filters,
    updateFilters,
    clearFilters,
    companies,
    kpiData,
    loading,
    error,
    totalCount,
    page,
    setPage,
    pageSize,
    refreshHistory,
  };
};
