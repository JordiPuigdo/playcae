import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Search, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { AccessHistoryFilters as Filters } from "@/types/accessHistory";
import { Label } from "./ui/Label";

interface AccessHistoryFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  companies: { id: string; name: string }[];
}

export const AccessHistoryFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  companies,
}: AccessHistoryFiltersProps) => {
  return (
    <div className="space-y-4 p-6 bg-white border border-playBlueLight/30 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-primary">Filtros</h3>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-playBlueLight hover:text-brand-primary"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Buscar técnico */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-brand-primary">
            Técnico / DNI / Empresa
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
            <Input
              id="search"
              placeholder="Buscar..."
              value={filters.searchTechnician}
              onChange={(e) =>
                onFilterChange({ searchTechnician: e.target.value })
              }
              className="pl-9 border-playBlueLight focus-visible:ring-brand-primary"
            />
          </div>
        </div>

        {/* Fecha desde */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-brand-primary">
            Fecha desde
          </Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="border-playBlueLight focus-visible:ring-brand-primary"
          />
        </div>

        {/* Fecha hasta */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-brand-primary">
            Fecha hasta
          </Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="border-playBlueLight focus-visible:ring-brand-primary"
          />
        </div>
      </div>
    </div>
  );
};
