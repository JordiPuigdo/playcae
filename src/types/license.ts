export interface LicenseSummary {
  currentContractors: number;
  maxContractors: number | null;
  currentWorkers: number;
  maxWorkers: number | null;
  currentPrlUsers: number;
  maxPrlUsers: number | null;
  currentSites: number;
  maxSites: number | null;
}

export interface TenantLicenseAdmin {
  adminUserId: string;
  adminEmail: string;
  adminName: string;
  maxContractors: number | null;
  maxWorkers: number | null;
  maxPrlUsers: number | null;
  maxSites: number | null;
  alertThreshold: number;
  currentContractors: number;
  currentWorkers: number;
  currentPrlUsers: number;
  currentSites: number;
}

export interface UpdateTenantLicenseDto {
  maxContractors: number | null;
  maxWorkers: number | null;
  maxPrlUsers: number | null;
  maxSites: number | null;
  alertThreshold: number;
}
