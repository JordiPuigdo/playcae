export interface Worker {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  dni: string;
  position?: string;
  registrationDate: string;
  status: 'Apto' | 'No apto' | 'Pendiente';
  documents: WorkerDocument[];
}

export interface WorkerDocument {
  id: string;
  workerId: string;
  type: 'dni' | 'formacion-prl' | 'aptitud-medica';
  name: string;
  fileName?: string;
  uploadDate?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'Pendiente' | 'Validado' | 'Rechazado';
  validatorComment?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface WorkerFormData {
  firstName: string;
  lastName: string;
  dni: string;
  position?: string;
}

export interface WorkerDocumentFormData {
  file: File;
  issueDate?: string;
  expiryDate?: string;
}

export type WorkerStatus = 'Apto' | 'No apto' | 'Pendiente' | 'Todos';
export type UserRole = 'empresa' | 'tecnico-prl' | 'administrador';
