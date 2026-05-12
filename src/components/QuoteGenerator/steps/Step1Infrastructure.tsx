"use client";

import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { NumberChips } from "@/components/NumberChips";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";

interface Step1InfrastructureProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
}

export const Step1Infrastructure = ({
  config,
  onChange,
}: Step1InfrastructureProps) => (
  <div className="space-y-6">
    <NumberChips
      label="Sedes / centros de trabajo"
      value={config.sitesCount}
      onChange={(v) => onChange({ sitesCount: v })}
      options={[1, 2, 3, 5, 10, 20]}
      min={1}
    />

    <NumberChips
      label="Usuarios administradores"
      value={config.usersCount}
      onChange={(v) => onChange({ usersCount: v })}
      options={[1, 2, 3, 5, 10]}
      min={1}
    />

    <div className="flex items-center justify-between rounded-lg border border-playBlueLight/30 p-4">
      <div className="flex-1 min-w-0 mr-4">
        <Label className="text-brand-primary font-medium">Módulo CAE Externo</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gestión de contratistas, trabajadores externos y portal externo
        </p>
      </div>
      <Switch
        checked={config.hasCaeExternal}
        onCheckedChange={(v) => onChange({ hasCaeExternal: v })}
      />
    </div>

    {config.hasCaeExternal && (
      <>
        <div className="space-y-2">
          <NumberChips
            label="Empresas externas contratistas"
            value={config.externalCompaniesCount}
            onChange={(v) => onChange({ externalCompaniesCount: v })}
            options={[25, 50, 100, 200]}
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            Mínimo facturable: 25 empresas. Por debajo se aplica igual el mínimo.
          </p>
        </div>

        <div className="space-y-2">
          <NumberChips
            label="Trabajadores por empresa (media)"
            value={config.externalWorkersPerCompanyAvg}
            onChange={(v) => onChange({ externalWorkersPerCompanyAvg: v })}
            options={[10, 25, 50, 100]}
            min={1}
          />
          <p className="text-xs text-muted-foreground">
            Factor multiplicador: total trabajadores ≈{" "}
            <span className="font-medium text-brand-primary">
              {config.externalCompaniesCount * config.externalWorkersPerCompanyAvg}
            </span>{" "}
            trabajadores externos
          </p>
        </div>
      </>
    )}
  </div>
);
