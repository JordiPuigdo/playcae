"use client";

import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { NumberChips } from "@/components/NumberChips";

interface Step2TemplatesProfilesProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
}

export const Step2TemplatesProfiles = ({
  config,
  onChange,
}: Step2TemplatesProfilesProps) => (
  <div className="space-y-6">
    <div className="space-y-4 rounded-lg border border-playBlueLight/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-brand-primary font-medium">
            Perfiles de trabajador
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Roles con distintos requisitos documentales (ej: Operario, Gruista, Técnico PRL)
          </p>
        </div>
        <Switch
          checked={config.hasWorkerProfiles}
          onCheckedChange={(v) => onChange({ hasWorkerProfiles: v })}
        />
      </div>

      {config.hasWorkerProfiles && (
        <div className="pl-4 border-l-2 border-brand-accent/20">
          <NumberChips
            label="Nº de perfiles"
            value={config.workerProfilesCount}
            onChange={(v) => onChange({ workerProfilesCount: v })}
            options={[1, 2, 3, 5, 8, 10]}
            min={1}
          />
        </div>
      )}
    </div>

    <div className="space-y-4 rounded-lg border border-playBlueLight/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-brand-primary font-medium">
            Perfiles de empresa contratista
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tipos de empresa con distintos requisitos (ej: Contrata PRL, Proveedor logístico)
          </p>
        </div>
        <Switch
          checked={config.hasCompanyProfiles}
          onCheckedChange={(v) => onChange({ hasCompanyProfiles: v })}
        />
      </div>

      {config.hasCompanyProfiles && (
        <div className="pl-4 border-l-2 border-brand-accent/20">
          <NumberChips
            label="Nº de perfiles"
            value={config.companyProfilesCount}
            onChange={(v) => onChange({ companyProfilesCount: v })}
            options={[1, 2, 3, 5, 8, 10]}
            min={1}
          />
        </div>
      )}
    </div>
  </div>
);
