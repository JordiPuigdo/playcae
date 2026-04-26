import { BaseEntity } from "./baseEntity";

export enum ProjectStatus {
  Active = 0,
  PendingClosure = 1,
  Closed = 2,
  ClosedBySystem = 3,
  Cancelled = 4,
}

export interface ProjectList extends BaseEntity {
  name: string;
  description?: string;
  address?: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  adminUserId: string;
  siteId?: string;
  siteName?: string;
  assignedCompaniesCount: number;
}

export interface Project extends ProjectList {
  pendingClosureDays: number;
  closureGracePeriodDays: number;
  closedByUserId?: string;
  closedAt?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  address?: string;
  startDate: string;
  endDate: string;
  siteId?: string;
  pendingClosureDays?: number;
  closureGracePeriodDays?: number;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  siteId?: string;
  pendingClosureDays?: number;
  closureGracePeriodDays?: number;
}

export interface AssignCompanyToProjectData {
  companyId: string;
  includeSubcontractors?: boolean;
}

export interface ProjectCompanyAssignment extends BaseEntity {
  projectId: string;
  projectName?: string;
  companyId: string;
  companyName?: string;
  companyTaxId?: string;
  assignedDate: string;
  assignedByUserId: string;
  removedAt?: string;
  removedByUserId?: string;
}
