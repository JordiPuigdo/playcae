"use client";

import { useState, useEffect, useRef } from "react";

import { Search, X } from "lucide-react";
import { Company, CompanyStatus } from "@/types/company";
import { WorkerStatus } from "@/types/worker";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

import {
  getCompanyStatusLabel,
  getCompanyStatusOptions,
} from "@/app/utils/enum-utils";
import { useTranslation } from "@/hooks/useTranslation";

export interface CompanyFiltersState {
  search: string;
  status: Company["status"] | "Todos";
  activeFilter: "Activas" | "Inactivas" | "Todas";
  workerStatus: WorkerStatus | "Todos";
}

interface CompanyFiltersProps {
  initialFilters?: Partial<CompanyFiltersState>;
  onFilter: (filters: CompanyFiltersState) => void;
}

export const CompanyFilters = ({
  initialFilters,
  onFilter,
}: CompanyFiltersProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [status, setStatus] = useState<Company["status"] | "Todos">(
    initialFilters?.status || "Todos"
  );
  const [activeFilter, setActiveFilter] = useState<
    "Activas" | "Inactivas" | "Todas"
  >(initialFilters?.activeFilter || "Todas");
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | "Todos">(
    initialFilters?.workerStatus || "Todos"
  );

  // Debounce para el campo de búsqueda
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    // Cancelar el timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Esperar 300ms antes de actualizar la URL
    debounceRef.current = setTimeout(() => {
      onFilter({ search: value, status, activeFilter, workerStatus });
    }, 300);
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleStatusChange = (value: Company["status"] | "Todos") => {
    setStatus(value);
    onFilter({ search, status: value, activeFilter, workerStatus });
  };

  const handleActiveFilterChange = (
    value: "Activas" | "Inactivas" | "Todas"
  ) => {
    setActiveFilter(value);
    onFilter({ search, status, activeFilter: value, workerStatus });
  };

  const handleWorkerStatusChange = (value: WorkerStatus | "Todos") => {
    setWorkerStatus(value);
    onFilter({ search, status, activeFilter, workerStatus: value });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("Todos");
    setActiveFilter("Todas");
    setWorkerStatus("Todos");
    onFilter({
      search: "",
      status: "Todos",
      activeFilter: "Todas",
      workerStatus: "Todos",
    });
  };

  const hasActiveFilters =
    search !== "" ||
    status !== "Todos" ||
    activeFilter !== "Todas" ||
    workerStatus !== "Todos";

  return (
    <Card className="border border-playBlueLight/30 bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-brand-primary">
              {t("companies.filters.searchCompany")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                placeholder={t("companies.filters.searchPlaceholder")}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-2 min-w-[200px]">
            <label className="text-sm font-medium text-brand-primary">
              {t("companies.filters.validationStatus")}
            </label>

            <Select
              value={status === "Todos" ? "Todos" : CompanyStatus[status]}
              onValueChange={(value) =>
                handleStatusChange(
                  value === "Todos"
                    ? "Todos"
                    : CompanyStatus[value as keyof typeof CompanyStatus]
                )
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Todos"
                >
                  {getCompanyStatusLabel("Todos")}
                </SelectItem>

                {getCompanyStatusOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    className="hover:bg-playGrey hover:text-brand-primary"
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[180px]">
            <label className="text-sm font-medium text-brand-primary">
              {t("companies.filters.workerStatus")}
            </label>

            <Select
              value={
                workerStatus === "Todos" ? "Todos" : WorkerStatus[workerStatus]
              }
              onValueChange={(value) =>
                handleWorkerStatusChange(
                  value === "Todos"
                    ? "Todos"
                    : WorkerStatus[value as keyof typeof WorkerStatus]
                )
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Todos"
                >
                  {t("companies.filters.allWorkers")}
                </SelectItem>
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Approved"
                >
                  {t("companies.filters.approved")}
                </SelectItem>
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Rejected"
                >
                  {t("companies.filters.rejected")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[150px]">
            <label className="text-sm font-medium text-brand-primary">
              {t("companies.filters.companyStatus")}
            </label>

            <Select
              value={activeFilter}
              onValueChange={(value) =>
                handleActiveFilterChange(
                  value as "Activas" | "Inactivas" | "Todas"
                )
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Todas"
                >
                  {t("companies.filters.all")}
                </SelectItem>
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Activas"
                >
                  {t("companies.filters.active")}
                </SelectItem>
                <SelectItem
                  className="hover:bg-playGrey hover:text-brand-primary"
                  value="Inactivas"
                >
                  {t("companies.filters.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`gap-2 border-playBlueLight transition-all ${
              hasActiveFilters
                ? "text-brand-primary hover:bg-playGrey"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <X className="h-4 w-4" />
            {t("companies.filters.clearFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
