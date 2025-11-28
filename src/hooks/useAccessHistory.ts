import { useState, useMemo } from "react";
import {
  AccessHistoryEntry,
  AccessHistoryFilters,
} from "@/types/accessHistory";

// Mock data para el histórico
const mockAccessHistory: AccessHistoryEntry[] = [
  {
    id: "1",
    technicianName: "Juan Pérez",
    dni: "12345678A",
    company: "TechCorp S.L.",
    companyId: "1",
    entryTime: "2024-01-15T08:30:00",
    exitTime: "2024-01-15T17:45:00",
    status: "Apto",
  },
  {
    id: "2",
    technicianName: "María García",
    dni: "87654321B",
    company: "Construcciones ABC",
    companyId: "2",
    entryTime: "2024-01-15T09:00:00",
    exitTime: "2024-01-15T18:00:00",
    status: "Apto",
  },
  {
    id: "3",
    technicianName: "Carlos López",
    dni: "11223344C",
    company: "TechCorp S.L.",
    companyId: "1",
    entryTime: "2024-01-15T08:45:00",
    exitTime: null,
    status: "Apto",
  },
  {
    id: "4",
    technicianName: "Ana Martínez",
    dni: "55667788D",
    company: "Instalaciones XYZ",
    companyId: "3",
    entryTime: "2024-01-14T10:15:00",
    exitTime: "2024-01-14T19:30:00",
    status: "No apto",
  },
  {
    id: "5",
    technicianName: "Pedro Sánchez",
    dni: "99887766E",
    company: "Construcciones ABC",
    companyId: "2",
    entryTime: "2024-01-14T07:30:00",
    exitTime: "2024-01-14T16:00:00",
    status: "Apto",
  },
  {
    id: "6",
    technicianName: "Laura Fernández",
    dni: "44332211F",
    company: "TechCorp S.L.",
    companyId: "1",
    entryTime: "2024-01-13T09:30:00",
    exitTime: "2024-01-13T18:30:00",
    status: "Apto",
  },
  {
    id: "7",
    technicianName: "Roberto Díaz",
    dni: "66778899G",
    company: "Instalaciones XYZ",
    companyId: "3",
    entryTime: "2024-01-13T08:00:00",
    exitTime: "2024-01-13T17:00:00",
    status: "Apto",
  },
  {
    id: "8",
    technicianName: "Elena Torres",
    dni: "33445566H",
    company: "Construcciones ABC",
    companyId: "2",
    entryTime: "2024-01-12T10:00:00",
    exitTime: "2024-01-12T19:00:00",
    status: "Apto",
  },
];

export const useAccessHistory = () => {
  const [filters, setFilters] = useState<AccessHistoryFilters>({
    searchTechnician: "",
    company: "",
    startDate: "",
    endDate: "",
  });

  const filteredHistory = useMemo(() => {
    return mockAccessHistory.filter((entry) => {
      // Filtro por nombre o DNI
      const searchLower = filters.searchTechnician.toLowerCase();
      const matchesSearch =
        !filters.searchTechnician ||
        entry.technicianName.toLowerCase().includes(searchLower) ||
        entry.dni.toLowerCase().includes(searchLower);

      // Filtro por empresa
      const matchesCompany =
        !filters.company || entry.companyId === filters.company;

      // Filtro por fecha de inicio
      const matchesStartDate =
        !filters.startDate ||
        new Date(entry.entryTime) >= new Date(filters.startDate);

      // Filtro por fecha de fin
      const matchesEndDate =
        !filters.endDate ||
        new Date(entry.entryTime) <= new Date(filters.endDate + "T23:59:59");

      return (
        matchesSearch && matchesCompany && matchesStartDate && matchesEndDate
      );
    });
  }, [filters]);

  const updateFilters = (newFilters: Partial<AccessHistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchTechnician: "",
      company: "",
      startDate: "",
      endDate: "",
    });
  };

  const getUniqueCompanies = () => {
    const companies = new Map<string, string>();
    mockAccessHistory.forEach((entry) => {
      companies.set(entry.companyId, entry.company);
    });
    return Array.from(companies.entries()).map(([id, name]) => ({ id, name }));
  };

  const getKPIData = () => {
    // Valores aleatorios pero coherentes
    const totalAccessesToday = Math.floor(Math.random() * 50) + 5; // entre 5 y 55
    const failedAccesses = Math.floor(Math.random() * (totalAccessesToday / 3)); // máx 33%
    const validAccesses = totalAccessesToday - failedAccesses;

    const validDocumentationPercentage =
      totalAccessesToday > 0
        ? Math.round((validAccesses / totalAccessesToday) * 100)
        : 100;

    const hoursWorkedToday = Number((Math.random() * 40).toFixed(1)); // 0h–40h

    const companiesOnSite = Math.floor(Math.random() * 10) + 1; // 1–10 empresas

    // Tendencia aleatoria
    const trendOptions: Array<"up" | "down" | "stable"> = [
      "up",
      "down",
      "stable",
    ];
    const trend = trendOptions[Math.floor(Math.random() * trendOptions.length)];

    return {
      validDocumentationPercentage,
      totalAccessesToday,
      hoursWorkedToday,
      failedAccesses,
      companiesOnSite,
      trend,
    };
  };

  return {
    history: filteredHistory,
    filters,
    updateFilters,
    clearFilters,
    companies: getUniqueCompanies(),
    kpiData: getKPIData(),
  };
};
