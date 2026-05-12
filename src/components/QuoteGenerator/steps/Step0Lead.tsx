"use client";

import { QuoteLanguage } from "@/types/quote";
import { QuoteGeneratorConfig } from "@/types/quote-generator";
import { LeadPicker, LeadPickerSelection } from "@/components/LeadPicker";
import { LeadForm } from "@/components/LeadForm";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useState } from "react";

interface Step0LeadProps {
  config: QuoteGeneratorConfig;
  onChange: (partial: Partial<QuoteGeneratorConfig>) => void;
  fixedLead?: { id: string; companyName: string };
  error?: string;
}

export const Step0Lead = ({
  config,
  onChange,
  fixedLead,
  error,
}: Step0LeadProps) => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-brand-primary">Cliente *</Label>
          {fixedLead ? (
            <div className="rounded-md border border-playBlueLight/30 bg-playGrey px-3 py-2 text-sm">
              {fixedLead.companyName}
            </div>
          ) : (
            <LeadPicker
              value={
                config.leadId
                  ? { id: config.leadId, companyName: "", email: "" }
                  : null
              }
              onChange={(lead: LeadPickerSelection | null) =>
                onChange({ leadId: lead?.id ?? "" })
              }
              onCreateNew={() => setIsLeadFormOpen(true)}
            />
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-brand-primary">Idioma del presupuesto</Label>
            <Select
              value={String(config.language)}
              onValueChange={(v) =>
                onChange({ language: Number(v) as QuoteLanguage })
              }
            >
              <SelectTrigger className="border-brand-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem value={String(QuoteLanguage.Es)}>Español</SelectItem>
                <SelectItem value={String(QuoteLanguage.Ca)}>Català</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-brand-primary">Válido hasta</Label>
            <Input
              type="date"
              value={config.validUntil ? config.validUntil.slice(0, 10) : ""}
              onChange={(e) =>
                onChange({
                  validUntil: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
              className="border-brand-accent"
            />
            <div className="flex gap-2">
              {[15, 30, 60].map((days) => {
                const date = new Date();
                date.setDate(date.getDate() + days);
                const iso = date.toISOString();
                const isActive = config.validUntil?.slice(0, 10) === iso.slice(0, 10);
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => onChange({ validUntil: iso })}
                    className={`flex-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                      isActive
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-accent text-brand-primary hover:bg-brand-primary/10"
                    }`}
                  >
                    {days} días
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-brand-primary">Alcance (opcional)</Label>
          <Input
            uppercase={false}
            value={config.scope ?? ""}
            onChange={(e) => onChange({ scope: e.target.value })}
            placeholder="Ej: Coordinación de actividades empresa principal + 3 contratas"
            className="border-brand-accent"
          />
        </div>
      </div>

      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        onCreated={(lead) => onChange({ leadId: lead.id ?? "" })}
      />
    </>
  );
};
