"use client";

import { useState } from "react";

import { Search, X } from "lucide-react";
import { Company, CompanyStatus } from "@/types/company";
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

interface CompanyFiltersProps {
  onFilter: (filters: {
    search: string;
    status: Company["status"] | "Todos";
  }) => void;
}

export const CompanyFilters = ({ onFilter }: CompanyFiltersProps) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Company["status"] | "Todos">("Todos");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilter({ search: value, status });
  };

  const handleStatusChange = (value: Company["status"] | "Todos") => {
    setStatus(value);
    onFilter({ search, status: value });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("Todos");
    onFilter({ search: "", status: "Todos" });
  };

  const hasActiveFilters = search !== "" || status !== "Todos";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Buscar empresa</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o CIF..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2 min-w-[200px]">
            <label className="text-sm font-medium">Estado de validación</label>
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white hover:cursor-pointer">
                <SelectItem className="hover:cursor-pointer" value="Todos">
                  {getCompanyStatusLabel("Todos")}
                </SelectItem>
                {getCompanyStatusOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    className="hover:cursor-pointer"
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Limpiar filtros
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
