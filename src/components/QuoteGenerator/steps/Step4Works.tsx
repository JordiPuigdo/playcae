"use client";

import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { NumberChips } from "@/components/NumberChips";

interface Step4WorksProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
}

export const Step4Works = ({ config, onChange }: Step4WorksProps) => (
  <div className="space-y-5">
    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-brand-primary font-medium">
            Módulo de obras
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gestión documental específica por obra: coordinación, accesos y cierre
          </p>
        </div>
        <Switch
          checked={config.hasWorksModule}
          onCheckedChange={(v) =>
            onChange({
              hasWorksModule: v,
              simultaneousWorksCount: v ? config.simultaneousWorksCount : 0,
              hasWorksTemplates: v ? config.hasWorksTemplates : false,
              worksTemplatesCount: v ? config.worksTemplatesCount : 0,
            })
          }
        />
      </div>

      {config.hasWorksModule && (
        <div className="space-y-5 pl-4 border-l-2 border-brand-accent/20">
          <NumberChips
            label="Obras activas simultáneas (aprox.)"
            value={config.simultaneousWorksCount}
            onChange={(v) => onChange({ simultaneousWorksCount: v })}
            options={[1, 2, 3, 5, 10, 20]}
            min={1}
          />

          <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-brand-primary font-medium text-sm">
                  Plantillas de obra
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Documentos descargables / plantillas estándar por tipo de obra
                </p>
              </div>
              <Switch
                checked={config.hasWorksTemplates}
                onCheckedChange={(v) =>
                  onChange({
                    hasWorksTemplates: v,
                    worksTemplatesCount: v ? config.worksTemplatesCount : 0,
                  })
                }
              />
            </div>

            {config.hasWorksTemplates && (
              <NumberChips
                label="Número de plantillas"
                value={config.worksTemplatesCount}
                onChange={(v) => onChange({ worksTemplatesCount: v })}
                options={[1, 2, 3, 5, 10]}
                min={1}
              />
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);
