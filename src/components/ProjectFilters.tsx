"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { ProjectStatus } from "@/types/project";
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
import { DatePicker } from "./ui/DatePicker";

export interface DateRange {
  from: string;
  to: string;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.Active]: "Activa",
  [ProjectStatus.PendingClosure]: "Pendiente de cierre",
  [ProjectStatus.Closed]: "Cerrada",
  [ProjectStatus.ClosedBySystem]: "Cerrada automáticamente",
  [ProjectStatus.Cancelled]: "Cancelada",
};

export const EMPTY_DATE_RANGE: DateRange = { from: "", to: "" };

export interface ProjectFiltersState {
  search: string;
  status: ProjectStatus | "all";
  activeFilter: "Activas" | "Inactivas" | "Todas";
  dateRange: DateRange;
}

interface ProjectFiltersProps {
  initialFilters?: Partial<ProjectFiltersState>;
  onFilter: (filters: ProjectFiltersState) => void;
}

export const ProjectFilters = ({ initialFilters, onFilter }: ProjectFiltersProps) => {
  const [search, setSearch] = useState(initialFilters?.search ?? "");
  const [status, setStatus] = useState<ProjectStatus | "all">(initialFilters?.status ?? "all");
  const [activeFilter, setActiveFilter] = useState<"Activas" | "Inactivas" | "Todas">(
    initialFilters?.activeFilter ?? "Todas"
  );
  const [dateRange, setDateRange] = useState<DateRange>(
    initialFilters?.dateRange ?? EMPTY_DATE_RANGE
  );
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilter({ search: value, status, activeFilter, dateRange });
    }, 300);
  };

  const handleStatusChange = (value: string) => {
    const next = value === "all" ? "all" : (Number(value) as ProjectStatus);
    setStatus(next);
    onFilter({ search, status: next, activeFilter, dateRange });
  };

  const handleActiveFilterChange = (value: "Activas" | "Inactivas" | "Todas") => {
    setActiveFilter(value);
    onFilter({ search, status, activeFilter: value, dateRange });
  };

  const handleDateChange = (field: "from" | "to", value: string) => {
    const next = { ...dateRange, [field]: value };
    setDateRange(next);
    onFilter({ search, status, activeFilter, dateRange: next });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setActiveFilter("Todas");
    setDateRange(EMPTY_DATE_RANGE);
    onFilter({ search: "", status: "all", activeFilter: "Todas", dateRange: EMPTY_DATE_RANGE });
  };

  const hasActiveFilters =
    search !== "" ||
    status !== "all" ||
    activeFilter !== "Todas" ||
    dateRange.from !== "" ||
    dateRange.to !== "";

  return (
    <Card className="border border-playBlueLight/30 bg-white">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium text-brand-primary">Buscar obra</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                placeholder="Nombre, dirección..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-2 min-w-[180px]">
            <label className="text-sm font-medium text-brand-primary">Estado</label>
            <Select value={String(status)} onValueChange={handleStatusChange}>
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="all">
                  Todos los estados
                </SelectItem>
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <SelectItem
                    key={val}
                    className="hover:bg-playGrey hover:text-brand-primary"
                    value={val}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[160px]">
            <label className="text-sm font-medium text-brand-primary">Actividad</label>
            <Select
              value={activeFilter}
              onValueChange={(v) =>
                handleActiveFilterChange(v as "Activas" | "Inactivas" | "Todas")
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="Todas">
                  Todas
                </SelectItem>
                <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="Activas">
                  Activas
                </SelectItem>
                <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="Inactivas">
                  Inactivas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[140px]">
            <label className="text-sm font-medium text-brand-primary">Desde</label>
            <DatePicker
              value={dateRange.from}
              onChange={(v) => handleDateChange("from", v)}
              max={dateRange.to || undefined}
              placeholder="Fecha inicio"
            />
          </div>

          <div className="space-y-2 min-w-[140px]">
            <label className="text-sm font-medium text-brand-primary">Hasta</label>
            <DatePicker
              value={dateRange.to}
              onChange={(v) => handleDateChange("to", v)}
              min={dateRange.from || undefined}
              placeholder="Fecha fin"
            />
          </div>

          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`gap-2 border-playBlueLight transition-all self-end ${
              hasActiveFilters
                ? "text-brand-primary hover:bg-playGrey"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
