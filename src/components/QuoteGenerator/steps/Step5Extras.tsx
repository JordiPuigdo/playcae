"use client";

import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { NumberChips } from "@/components/NumberChips";
import { cn } from "@/app/utils/utis";

interface Step5ExtrasProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
}

const ModuleToggle = ({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg border border-playBlueLight/30 p-4">
    <div className="flex-1 min-w-0 mr-4">
      <Label className="text-brand-primary font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const CONTRACT_OPTIONS: { years: 1 | 2 | 3; label: string; discount: string }[] = [
  { years: 1, label: "1 año", discount: "" },
  { years: 2, label: "2 años", discount: "10% dto." },
  { years: 3, label: "3 años", discount: "20% dto." },
];

export const Step5Extras = ({ config, onChange }: Step5ExtrasProps) => (
  <div className="space-y-4">
    <ModuleToggle
      label="Módulo proveedores"
      description="Gestión documental de proveedores y suministradores que no son contratas PRL puras"
      checked={config.hasSuppliersModule}
      onCheckedChange={(v) => onChange({ hasSuppliersModule: v })}
    />

    <ModuleToggle
      label="Copilot PRL AI — Validación automática"
      description="Validación automática de documentos con inteligencia artificial (OpenAI + OCR)"
      checked={config.hasAiValidation}
      onCheckedChange={(v) => onChange({ hasAiValidation: v })}
    />

    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-3">
      <div>
        <Label className="text-brand-primary font-medium">Implantación y puesta en marcha</Label>
        <p className="text-xs text-muted-foreground mt-0.5">30 €/h · Migración de datos, configuración inicial y entrega de accesos</p>
      </div>
      <NumberChips
        label="Horas"
        value={config.implantationHours}
        onChange={(v) => onChange({ implantationHours: v })}
        options={[4, 8, 16, 24, 32]}
        min={0}
      />
    </div>

    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-3">
      <div>
        <Label className="text-brand-primary font-medium">Sesión de formación</Label>
        <p className="text-xs text-muted-foreground mt-0.5">27 €/h · Onboarding y formación al equipo en el uso de la plataforma</p>
      </div>
      <NumberChips
        label="Horas"
        value={config.trainingHours}
        onChange={(v) => onChange({ trainingHours: v })}
        options={[2, 4, 8, 16]}
        min={0}
      />
    </div>

    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-3">
      <div>
        <Label className="text-brand-primary font-medium">Bolsa de horas de soporte</Label>
        <p className="text-xs text-muted-foreground mt-0.5">35 €/h · Horas de consultoría y resolución de dudas</p>
      </div>
      <NumberChips
        label="Horas"
        value={config.supportHours}
        onChange={(v) => onChange({ supportHours: v })}
        options={[5, 10, 20, 40]}
        min={0}
      />
    </div>

    <div className="rounded-lg border border-playBlueLight/30 p-4 space-y-3">
      <div>
        <Label className="text-brand-primary font-medium">Duración del contrato</Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          Los contratos plurianuales aplican descuento sobre la cuota anual
        </p>
      </div>
      <div className="flex gap-2">
        {CONTRACT_OPTIONS.map(({ years, label, discount }) => (
          <button
            key={years}
            type="button"
            onClick={() => onChange({ contractYears: years })}
            className={cn(
              "flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors text-center",
              config.contractYears === years
                ? "bg-brand-secondary text-white border-brand-secondary"
                : "bg-white text-brand-primary border-brand-accent/40 hover:border-brand-secondary"
            )}
          >
            <span className="block">{label}</span>
            {discount && (
              <span
                className={cn(
                  "text-xs font-normal",
                  config.contractYears === years ? "text-white/80" : "text-green-600"
                )}
              >
                {discount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);
