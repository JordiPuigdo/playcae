"use client";

import { useMemo } from "react";
import { QuoteBillingType, QuoteLanguage, QuoteModule } from "@/types/quote";
import { GeneratorPriceLine, QuoteGeneratorConfig } from "@/types/quote-generator";

const MODULE_CODES = [
  "cae-external",
  "per-external-company",
  "per-extra-site",
  "per-extra-user",
  "per-worker-profile",
  "per-company-profile",
  "cae-internal",
  "per-internal-worker",
  "per-internal-worker-profile",
  "proveedores",
  "obras",
  "per-obra-template",
  "copilot-ai",
] as const;

const HOURLY_RATES = {
  implantation: 30,
  training: 27,
  support: 35,
} as const;

type ModuleCode = (typeof MODULE_CODES)[number];

export const useGeneratorPricing = (
  config: QuoteGeneratorConfig,
  modules: QuoteModule[]
) => {
  return useMemo(() => {
    const isEs = config.language === QuoteLanguage.Es;
    const byCode = new Map<string, QuoteModule>(modules.map((m) => [m.code, m]));

    const lines: GeneratorPriceLine[] = [];

    const addLine = (code: ModuleCode, quantity: number) => {
      const m = byCode.get(code);
      if (!m || quantity <= 0) return;
      lines.push({
        label: isEs ? m.nameEs : m.nameCa,
        quantity,
        unitPrice: m.defaultPrice,
        billingType: m.billingType,
      });
    };

    // CAE external — mínimo 25 empresas
    if (config.hasCaeExternal && config.externalCompaniesCount > 0)
      addLine("per-external-company", Math.max(25, config.externalCompaniesCount));

    // Extra sites (first one included)
    const extraSites = Math.max(0, config.sitesCount - 1);
    if (extraSites > 0) addLine("per-extra-site", extraSites);

    // Extra users (first one included)
    const extraUsers = Math.max(0, config.usersCount - 1);
    if (extraUsers > 0) addLine("per-extra-user", extraUsers);

    // Worker profiles
    if (config.hasWorkerProfiles && config.workerProfilesCount > 0)
      addLine("per-worker-profile", config.workerProfilesCount);

    // Company profiles
    if (config.hasCompanyProfiles && config.companyProfilesCount > 0)
      addLine("per-company-profile", config.companyProfilesCount);

    // Internal workers module
    if (config.hasInternalWorkersModule) {
      addLine("cae-internal", 1);
      if (config.internalWorkersCount > 0)
        addLine("per-internal-worker", config.internalWorkersCount);
      if (config.internalWorkerProfilesCount > 0)
        addLine("per-internal-worker-profile", config.internalWorkerProfilesCount);
    }

    // Suppliers
    if (config.hasSuppliersModule) addLine("proveedores", 1);

    // Works module
    if (config.hasWorksModule) {
      addLine("obras", 1);
      if (config.hasWorksTemplates && config.worksTemplatesCount > 0)
        addLine("per-obra-template", config.worksTemplatesCount);
    }

    // Extra modules
    if (config.hasAiValidation) addLine("copilot-ai", 1);

    // Services — billed per hour (one-time)
    const addHourlyLine = (label: string, hours: number, rate: number) => {
      if (hours <= 0) return;
      lines.push({ label, quantity: hours, unitPrice: rate, billingType: QuoteBillingType.OneTime });
    };
    addHourlyLine(isEs ? "Implantación y puesta en marcha" : "Implantació i posada en marxa", config.implantationHours, HOURLY_RATES.implantation);
    addHourlyLine(isEs ? "Sesión de formación" : "Sessió de formació", config.trainingHours, HOURLY_RATES.training);
    addHourlyLine(isEs ? "Bolsa de horas de soporte" : "Bossa d'hores de suport", config.supportHours, HOURLY_RATES.support);

    // Multi-year discount
    if (config.contractYears > 1) {
      const annualTotal = lines
        .filter((l) => l.billingType === QuoteBillingType.Annual)
        .reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
      const discountPct = config.contractYears === 2 ? 0.1 : 0.2;
      const discountAmount = Math.round(annualTotal * discountPct * 100) / 100;
      if (discountAmount > 0) {
        const pct = Math.round(discountPct * 100);
        lines.push({
          label: isEs
            ? `Descuento contrato ${config.contractYears} años (${pct}%)`
            : `Descompte contracte ${config.contractYears} anys (${pct}%)`,
          quantity: 1,
          unitPrice: -discountAmount,
          billingType: QuoteBillingType.Annual,
        });
      }
    }

    const annualSubtotal = lines
      .filter((l) => l.billingType === QuoteBillingType.Annual)
      .reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);
    const oneTimeSubtotal = lines
      .filter((l) => l.billingType === QuoteBillingType.OneTime)
      .reduce((acc, l) => acc + l.unitPrice * l.quantity, 0);

    return {
      lines,
      annualSubtotal,
      oneTimeSubtotal,
      firstYearTotal: annualSubtotal + oneTimeSubtotal,
    };
  }, [config, modules]);
};
