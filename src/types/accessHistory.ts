// ===== DTOs para validación y fichaje =====

export interface AccessValidationRequest {
  cardId: string; // DNI del trabajador
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
  accessCompanyId?: string; // ID del centro de trabajo
  notes?: string;
}

export interface CheckOutRequest {
  cardId: string; // DNI del trabajador
  accessCompanyId?: string; // ID del centro de trabajo
  notes?: string;
}

// ===== DTOs para registros de acceso =====

export interface AccessRecord {
  id: string;
  workerId: string;
  workerName: string;
  workerDni: string;
  workerCompanyId: string;
  workerCompanyName: string;
  accessCompanyId?: string;
  accessCompanyName?: string;
  checkInTime: string;
  checkOutTime?: string | null;
  wasAccessDenied: boolean;
  denialReason?: string;
  notes?: string;
  createdAt: string;
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
  items: AccessRecord[];
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
    dni: record.workerDni,
    company: record.workerCompanyName,
    companyId: record.workerCompanyId,
    entryTime: record.checkInTime,
    exitTime: record.checkOutTime ?? null,
    status: record.wasAccessDenied ? "No apto" : "Apto",
  };
}
