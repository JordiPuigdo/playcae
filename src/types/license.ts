export interface LicenseSummary {
  currentContractors: number;
  maxContractors: number | null;
  enableInternalWorkers: boolean;
  currentInternalWorkers: number;
  maxInternalWorkers: number | null;
  workersPerContractor: number | null;
  currentPrlUsers: number;
  maxPrlUsers: number | null;
  currentSites: number;
  maxSites: number | null;
  enableProjects?: boolean;
}

export interface TenantLicenseAdmin {
  adminUserId: string;
  adminEmail: string;
  adminName: string;
  maxContractors: number | null;
  enableInternalWorkers: boolean;
  maxInternalWorkers: number | null;
  workersPerContractor: number | null;
  maxPrlUsers: number | null;
  maxSites: number | null;
  alertThreshold: number;
  currentContractors: number;
  currentInternalWorkers: number;
  currentPrlUsers: number;
  currentSites: number;
  enableProjects: boolean;
}

export interface UpdateTenantLicenseDto {
  maxContractors: number | null;
  enableInternalWorkers: boolean;
  maxInternalWorkers: number | null;
  workersPerContractor: number | null;
  maxPrlUsers: number | null;
  maxSites: number | null;
  alertThreshold: number;
  enableProjects: boolean;
}

export interface InitTenantLicenseRequest {
  adminEmail: string;
}
