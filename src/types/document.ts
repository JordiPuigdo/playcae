export interface Document {
  id: string;
  companyId: string;
  name: string;
  type: 'evaluacion-riesgos' | 'plan-prevencion' | 'seguro-responsabilidad' | 'tc2-rnt';
  fileName?: string;
  uploadDate?: string;
  expiryDate?: string;
  status: 'Pendiente' | 'Validado' | 'Rechazado';
  validatorComment?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface DocumentFormData {
  file: File;
  expiryDate?: string;
}

export interface CompanyObservation {
  id: string;
  companyId: string;
  observation: string;
  createdBy: string;
  createdAt: string;
}

export type UserRole = 'empresa' | 'tecnico-prl' | 'administrador';
