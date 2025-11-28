import { BaseEntity } from "./baseEntity";
import { WorkerStatus } from "./worker";

export interface Company extends BaseEntity {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: CompanyStatus;
  userId: string;
  workerStatus: WorkerStatus;
}

export enum CompanyStatus {
  Approved,
  Rejected,
  Pending,
}

export interface CompanyFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
}
