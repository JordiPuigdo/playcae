import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { Search, Filter, Power } from "lucide-react";
import { WorkerStatus } from "@/types/worker";
import { getWorkerStatusLabel } from "@/app/utils/enum-utils";
import { useTranslation } from "@/hooks/useTranslation";

interface WorkerFiltersProps {
  onFilter: (filters: {
    search: string;
    status?: WorkerStatus;
    activeFilter: "Activos" | "Inactivos" | "Todos";
  }) => void;
}

export const WorkerFilters = ({ onFilter }: WorkerFiltersProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WorkerStatus | "Todos">("Todos");
  const [activeFilter, setActiveFilter] = useState<
    "Activos" | "Inactivos" | "Todos"
  >("Todos");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilter({
      search: value,
      status: status === "Todos" ? undefined : (status as WorkerStatus),
      activeFilter,
    });
  };

  const handleStatusChange = (value: string) => {
    if (value === "Todos") {
      setStatus("Todos");
      onFilter({ search, status: undefined, activeFilter });
    } else {
      const numValue = Number(value) as WorkerStatus;
      setStatus(numValue);
      onFilter({ search, status: numValue, activeFilter });
    }
  };

  const handleActiveFilterChange = (
    value: "Activos" | "Inactivos" | "Todos"
  ) => {
    setActiveFilter(value);
    onFilter({
      search,
      status: status === "Todos" ? undefined : (status as WorkerStatus),
      activeFilter: value,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Buscar */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            {t("workers.filters.searchWorker")}
          </Label>
          <Input
            id="search"
            placeholder={t("workers.filters.searchPlaceholder")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Estado */}
        <div className="sm:w-48 space-y-2">
          <Label className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t("workers.filters.status")}
          </Label>
          <Select
            value={status === "Todos" ? "Todos" : status.toString()}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("workers.filters.selectStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">{t("workers.filters.all")}</SelectItem>
              {Object.entries(WorkerStatus)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, val]) => (
                  <SelectItem key={val} value={val.toString()}>
                    {getWorkerStatusLabel(key)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtro de actividad */}
        <div className="sm:w-48 space-y-2">
          <Label className="flex items-center gap-2">
            <Power className="h-4 w-4" />
            {t("workers.filters.activityStatus")}
          </Label>
          <Select value={activeFilter} onValueChange={handleActiveFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("workers.filters.selectActivity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">{t("workers.filters.all")}</SelectItem>
              <SelectItem value="Activos">{t("workers.filters.active")}</SelectItem>
              <SelectItem value="Inactivos">{t("workers.filters.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
