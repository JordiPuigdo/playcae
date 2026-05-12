import { QuoteBillingType, QuoteLanguage } from "./quote";

export interface QuoteGeneratorConfig {
  leadId: string;
  language: QuoteLanguage;
  scope?: string;
  validUntil?: string;
  // Step 1 — Infrastructure
  hasCaeExternal: boolean;
  sitesCount: number;
  usersCount: number;
  externalCompaniesCount: number;
  externalWorkersPerCompanyAvg: number;
  // Step 2 — Profiles CAE
  hasWorkerProfiles: boolean;
  workerProfilesCount: number;
  hasCompanyProfiles: boolean;
  companyProfilesCount: number;
  // Step 3 — Internal workers
  hasInternalWorkersModule: boolean;
  internalWorkersCount: number;
  internalWorkerProfilesCount: number;
  // Step 4 — Works module
  hasWorksModule: boolean;
  simultaneousWorksCount: number;
  hasWorksTemplates: boolean;
  worksTemplatesCount: number;
  // Step 5 — Extra modules
  hasSuppliersModule: boolean;
  hasAiValidation: boolean;
  // Step 6 — Services (billed per hour)
  implantationHours: number;
  trainingHours: number;
  supportHours: number;
  contractYears: 1 | 2 | 3;
}

export const DEFAULT_GENERATOR_CONFIG: QuoteGeneratorConfig = {
  leadId: "",
  language: QuoteLanguage.Es,
  hasCaeExternal: true,
  sitesCount: 1,
  usersCount: 1,
  externalCompaniesCount: 25,
  externalWorkersPerCompanyAvg: 10,
  hasWorkerProfiles: false,
  workerProfilesCount: 1,
  hasCompanyProfiles: false,
  companyProfilesCount: 1,
  hasInternalWorkersModule: false,
  internalWorkersCount: 0,
  internalWorkerProfilesCount: 1,
  hasWorksModule: false,
  simultaneousWorksCount: 1,
  hasWorksTemplates: false,
  worksTemplatesCount: 0,
  hasSuppliersModule: false,
  hasAiValidation: false,
  implantationHours: 8,
  trainingHours: 0,
  supportHours: 0,
  contractYears: 1,
  validUntil: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString();
  })(),
};

export interface GeneratorPriceLine {
  label: string;
  quantity: number;
  unitPrice: number;
  billingType: QuoteBillingType;
}
