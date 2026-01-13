// ===== DTOs para validación y fichaje =====

export interface AccessValidationRequest {
  cardId: string; // DNI del trabajador
  adminUserId: string; // ID del usuario admin que valida (dueño del terminal)
  accessCompanyId?: string; // ID del centro de trabajo (opcional)
}

export interface DocumentIssue {
  documentName: string;
  status: "Caducado" | "Pendiente" | "Rechazado";
  expirationDate?: string;
}

export interface AccessValidationResult {
  canAccess: boolean;
  workerName: string;
  workerId: string;
  companyName: string;
  companyId: string;
  hasActiveCheckIn: boolean;
  activeCheckInTime?: string;
  documentIssues: DocumentIssue[];
  message?: string;
}

export interface CheckInRequest {
  cardId: string; // DNI del trabajador
  adminUserId: string; // ID del usuario admin que realiza el fichaje
  accessCompanyId?: string; // ID del centro de trabajo
  notes?: string;
}

export interface CheckOutRequest {
  cardId: string; // DNI del trabajador
  adminUserId: string; // ID del usuario admin que realiza el desfichaje
  accessCompanyId?: string; // ID del centro de trabajo
  notes?: string;
}

// ===== DTOs para registros de acceso =====

export interface AccessRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerCardId: string; // DNI del trabajador
  workerCompanyId: string;
  workerCompanyName: string;
  accessCompanyId?: string;
  accessCompanyName?: string;
  entryTime: string;
  exitTime?: string | null;
  status: number; // 0 = Apto, 1 = No apto
  denialReason?: string | null;
  problematicDocumentIds?: string[];
  creationDate: string;
  active: boolean;
}

export interface AccessRecordFilter {
  accessCompanyId?: string;
  workerCompanyId?: string;
  workerId?: string;
  searchTerm?: string;
  fromDate?: string;
  toDate?: string;
  onlyDenied?: boolean;
  onlyActive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AccessRecordPagedResult {
  records: AccessRecord[]; // API devuelve "records", no "items"
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Tipos para UI (mantener compatibilidad) =====

export interface AccessHistoryEntry {
  id: string;
  technicianName: string;
  dni: string;
  company: string;
  companyId: string;
  entryTime: string;
  exitTime: string | null;
  status: "Apto" | "No apto";
}

export interface AccessHistoryFilters {
  searchTechnician: string;
  company: string;
  startDate: string;
  endDate: string;
}

export interface AccessKPIData {
  validDocumentationPercentage: number;
  totalAccessesToday: number;
  hoursWorkedToday: number;
  failedAccesses: number;
  companiesOnSite: number;
  trend: "up" | "down" | "stable";
}

// Función helper para convertir AccessRecord a AccessHistoryEntry (UI)
export function mapAccessRecordToEntry(
  record: AccessRecord
): AccessHistoryEntry {
  return {
    id: record.id,
    technicianName: record.workerName,
    dni: record.workerCardId,
    company: record.workerCompanyName,
    companyId: record.workerCompanyId,
    entryTime: record.entryTime,
    exitTime: record.exitTime ?? null,
    status: record.status === 0 ? "Apto" : "No apto",
  };
}
