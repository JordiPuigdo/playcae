import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AccessHistoryEntry,
  AccessHistoryFilters,
  AccessRecordFilter,
  AccessKPIData,
  mapAccessRecordToEntry,
} from "@/types/accessHistory";
import { AccessService } from "@/services/access.service";

const accessService = new AccessService();

export const useAccessHistory = (accessCompanyId?: string) => {
  const [history, setHistory] = useState<AccessHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);

  const [filters, setFilters] = useState<AccessHistoryFilters>({
    searchTechnician: "",
    company: "",
    startDate: "",
    endDate: "",
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
        const entries = response.data.items.map(mapAccessRecordToEntry);
        setHistory(entries);
        setTotalCount(response.data.totalCount);

        // Extraer empresas únicas para el filtro
        const uniqueCompanies = new Map<string, string>();
        response.data.items.forEach((item) => {
          uniqueCompanies.set(item.workerCompanyId, item.workerCompanyName);
        });
        setCompanies(
          Array.from(uniqueCompanies.entries()).map(([id, name]) => ({
            id,
            name,
          }))
        );

        // Calcular KPIs basados en los datos
        calculateKPIs(response.data.items);
      }
    } catch (err) {
      setError("Error al cargar el histórico de accesos");
      console.error("Error fetching access history:", err);
    } finally {
      setLoading(false);
    }
  }, [accessCompanyId, filters, page, pageSize]);

  const calculateKPIs = (items: any[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todayItems = items.filter((item) =>
      item.checkInTime?.startsWith(today)
    );

    const totalAccessesToday = todayItems.length;
    const failedAccesses = todayItems.filter(
      (item) => item.wasAccessDenied
    ).length;
    const validAccesses = totalAccessesToday - failedAccesses;

    const validDocumentationPercentage =
      totalAccessesToday > 0
        ? Math.round((validAccesses / totalAccessesToday) * 100)
        : 100;

    // Calcular horas trabajadas hoy
    let hoursWorkedToday = 0;
    todayItems.forEach((item) => {
      if (item.checkInTime && item.checkOutTime) {
        const checkIn = new Date(item.checkInTime);
        const checkOut = new Date(item.checkOutTime);
        hoursWorkedToday += (checkOut.getTime() - checkIn.getTime()) / 3600000;
      }
    });

    // Empresas únicas en sitio hoy
    const uniqueCompaniesOnSite = new Set(
      todayItems.map((item) => item.workerCompanyId)
    );

    // Determinar tendencia (comparar con ayer si hay datos)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const yesterdayItems = items.filter((item) =>
      item.checkInTime?.startsWith(yesterdayStr)
    );

    let trend: "up" | "down" | "stable" = "stable";
    if (todayItems.length > yesterdayItems.length) trend = "up";
    else if (todayItems.length < yesterdayItems.length) trend = "down";

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
    setFilters({
      searchTechnician: "",
      company: "",
      startDate: "",
      endDate: "",
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
