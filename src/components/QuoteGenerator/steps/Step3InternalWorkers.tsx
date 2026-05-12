"use client";

import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { NumberChips } from "@/components/NumberChips";

interface Step3InternalWorkersProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
}

export const Step3InternalWorkers = ({
  config,
  onChange,
}: Step3InternalWorkersProps) => (
  <div className="space-y-5">
    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-brand-primary font-medium">
            Módulo de trabajadores internos
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestión documental de la propia plantilla de la empresa (PRL interno)
          </p>
        </div>
        <Switch
          checked={config.hasInternalWorkersModule}
          onCheckedChange={(v) =>
            onChange({
              hasInternalWorkersModule: v,
              internalWorkersCount: v ? config.internalWorkersCount : 0,
            })
          }
        />
      </div>

      {config.hasInternalWorkersModule && (
        <div className="space-y-5 pl-4 border-l-2 border-brand-accent/20">
          <NumberChips
            label="Número de trabajadores internos"
            value={config.internalWorkersCount}
            onChange={(v) => onChange({ internalWorkersCount: v })}
            options={[10, 25, 50, 100, 250, 500]}
            min={0}
          />

          <div className="space-y-3">
            <Label className="text-brand-primary font-medium text-sm">
              Perfiles de trabajador interno
            </Label>
            <p className="text-xs text-muted-foreground">
              Roles con distintos requisitos documentales (ej: Operario, Técnico, Mando intermedio)
            </p>
            <NumberChips
              label="Nº de perfiles"
              value={config.internalWorkerProfilesCount}
              onChange={(v) => onChange({ internalWorkerProfilesCount: v })}
              options={[1, 2, 3, 5, 8, 10]}
              min={1}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);
