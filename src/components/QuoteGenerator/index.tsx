"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useQuoteModules } from "@/hooks/useQuoteModules";
import { DEFAULT_GENERATOR_CONFIG, QuoteGeneratorConfig } from "@/types/quote-generator";
import { Quote } from "@/types/quote";
import { useGeneratorPricing } from "./useGeneratorPricing";
import { PricePreviewPanel } from "./PricePreviewPanel";
import { Step0Lead } from "./steps/Step0Lead";
import { Step1Infrastructure } from "./steps/Step1Infrastructure";
import { Step2TemplatesProfiles } from "./steps/Step2TemplatesProfiles";
import { Step3InternalWorkers } from "./steps/Step3InternalWorkers";
import { Step4Works } from "./steps/Step4Works";
import { Step5Extras } from "./steps/Step5Extras";
import { cn } from "@/app/utils/utis";

const STEPS = [
  { id: 0, title: "Cliente" },
  { id: 1, title: "Infraestructura" },
  { id: 2, title: "Perfiles CAE" },
  { id: 3, title: "Trabajadores" },
  { id: 4, title: "Obras" },
  { id: 5, title: "Extras" },
] as const;

interface QuoteGeneratorWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (quote: Quote) => void;
  fixedLead?: { id: string; companyName: string };
  generateQuote: (config: QuoteGeneratorConfig) => Promise<Quote>;
}

export const QuoteGeneratorWizard = ({
  isOpen,
  onClose,
  onCreated,
  fixedLead,
  generateQuote,
}: QuoteGeneratorWizardProps) => {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<QuoteGeneratorConfig>(() => ({
    ...DEFAULT_GENERATOR_CONFIG,
    leadId: fixedLead?.id ?? "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [leadError, setLeadError] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen && fixedLead?.id) {
      setConfig((prev) => ({ ...prev, leadId: fixedLead.id }));
      setLeadError(undefined);
    }
  }, [isOpen, fixedLead?.id]);

  const { modules } = useQuoteModules({ isActive: true });
  const pricing = useGeneratorPricing(config, modules);

  const handleChange = useCallback((partial: Partial<QuoteGeneratorConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleClose = () => {
    setStep(0);
    setConfig({ ...DEFAULT_GENERATOR_CONFIG, leadId: fixedLead?.id ?? "" });
    setLeadError(undefined);
    onClose();
  };

  const handleNext = () => {
    if (step === 0 && !config.leadId) {
      setLeadError("Debes seleccionar un cliente");
      return;
    }
    setLeadError(undefined);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!config.leadId) {
      setStep(0);
      setLeadError("Debes seleccionar un cliente");
      return;
    }
    setSubmitting(true);
    try {
      const quote = await generateQuote(config);
      onCreated(quote);
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] bg-white border border-brand-accent/30 shadow-xl flex flex-col max-h-[92vh] p-0 overflow-hidden">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-4 border-b border-playBlueLight/20">
          <DialogTitle className="text-brand-primary flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-brand-secondary" />
            Generador de presupuesto
          </DialogTitle>
          <DialogDescription className="text-brand-accent">
            {STEPS[step].title} — paso {step + 1} de {STEPS.length}
          </DialogDescription>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5 pt-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  s.id < step
                    ? "bg-brand-secondary"
                    : s.id === step
                    ? "bg-brand-secondary/60"
                    : "bg-playBlueLight/30"
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main form area */}
          <div className="flex-1 overflow-y-auto px-6 py-5 min-w-0">
            <h2 className="text-base font-semibold text-brand-primary mb-4">
              {getStepTitle(step)}
            </h2>

            {step === 0 && (
              <Step0Lead
                config={config}
                onChange={handleChange}
                fixedLead={fixedLead}
                error={leadError}
              />
            )}
            {step === 1 && (
              <Step1Infrastructure config={config} onChange={handleChange} />
            )}
            {step === 2 && (
              <Step2TemplatesProfiles config={config} onChange={handleChange} />
            )}
            {step === 3 && (
              <Step3InternalWorkers config={config} onChange={handleChange} />
            )}
            {step === 4 && (
              <Step4Works config={config} onChange={handleChange} />
            )}
            {step === 5 && (
              <Step5Extras config={config} onChange={handleChange} />
            )}
          </div>

          {/* Price preview sidebar */}
          <div className="w-72 shrink-0 overflow-y-auto border-l border-playBlueLight/20 px-4 py-5 bg-playGrey/20">
            <PricePreviewPanel
              lines={pricing.lines}
              annualSubtotal={pricing.annualSubtotal}
              oneTimeSubtotal={pricing.oneTimeSubtotal}
              firstYearTotal={pricing.firstYearTotal}
            />
          </div>
        </div>

        {/* Footer navigation */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-t border-playBlueLight/20 bg-white">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? handleClose : handleBack}
            disabled={submitting}
            className="border-brand-accent text-brand-primary hover:bg-brand-neutral"
          >
            {step === 0 ? (
              "Cancelar"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </>
            )}
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !config.leadId}
              className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md"
            >
              {submitting ? (
                "Generando..."
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-1.5" />
                  Generar presupuesto
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getStepTitle = (step: number) => {
  switch (step) {
    case 0: return "¿Para qué cliente es este presupuesto?";
    case 1: return "Infraestructura básica de la plataforma";
    case 2: return "¿Necesita perfiles documentales CAE?";
    case 3: return "¿Necesita módulo de trabajadores internos?";
    case 4: return "¿Necesita módulo de obras?";
    case 5: return "Módulos adicionales y opciones de contrato";
    default: return "";
  }
};
