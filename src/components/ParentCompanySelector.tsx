"use client";

import { useState } from "react";
import { ParentCompany } from "@/types/user";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Building2, Check, Loader2 } from "lucide-react";

interface ParentCompanySelectorProps {
  companies: ParentCompany[];
  isLoading?: boolean;
  onSelect: (companyId: string) => void;
}

export const ParentCompanySelector = ({
  companies,
  isLoading = false,
  onSelect,
}: ParentCompanySelectorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (companyId: string) => {
    setSelectedId(companyId);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="text-playBlueLight">Cargando empresas disponibles...</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Building2 className="h-12 w-12 text-playBlueLight" />
        <p className="text-playBlueLight text-center">
          No se encontraron empresas asociadas a tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-brand-primary">
          Selecciona una Empresa
        </CardTitle>
        <CardDescription className="text-center text-playBlueLight">
          Tu cuenta está asociada a varias empresas. Selecciona con cuál deseas
          trabajar en esta sesión.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleSelect(company.id)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between gap-3 ${
                selectedId === company.id
                  ? "border-playOrange bg-playOrange/10"
                  : "border-playBlueLight/30 hover:border-playBlueLight hover:bg-playGrey/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2
                  className={`h-5 w-5 ${
                    selectedId === company.id
                      ? "text-playOrange"
                      : "text-playBlueLight"
                  }`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      selectedId === company.id
                        ? "text-playOrange"
                        : "text-brand-primary"
                    }`}
                  >
                    {company.name}
                  </p>
                  {company.taxId && (
                    <p className="text-sm text-playBlueLight">
                      {company.taxId}
                    </p>
                  )}
                </div>
              </div>
              {selectedId === company.id && (
                <Check className="h-5 w-5 text-playOrange" />
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selectedId}
          className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};
