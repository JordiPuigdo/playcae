import { BaseEntity } from "./baseEntity";
import { WorkerStatus } from "./worker";

// Versión simplificada (para listas y subcontratas)
export interface CompanySimple extends BaseEntity {
  name: string;
  taxId: string;
  cif?: string; // Alias para taxId
  contactPerson: string;
  email: string;
  phone?: string;
  status: CompanyStatus;
  active: boolean;
  userId: string;
  workerStatus: WorkerStatus;
  // Jerarquía de subcontratación
  parentCompanyId?: string | null;
  parentCompanyName?: string | null;
  isSubcontractor: boolean;
  // Contadores (opcionales, para estadísticas)
  workerCount?: number;
  documentCount?: number;
}

// Versión completa (con documentos y subcontratas)
export interface Company extends CompanySimple {
  documents?: DocumentSimple[];
  subcontractors?: CompanySimple[];
}

// Para imports circulares, definimos DocumentSimple aquí
export interface DocumentSimple {
  id: string;
  name: string;
  status: string;
  expirationDate?: string;
}

export enum CompanyStatus {
  Approved = 0,
  Rejected = 1,
  Pending = 2,
}

export interface CompanyFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
}

export interface CreateSubcontractorData extends CompanyFormData {
  userCompanyId: string; // ID de la empresa del usuario actual
}
