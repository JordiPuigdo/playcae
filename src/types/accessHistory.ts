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
