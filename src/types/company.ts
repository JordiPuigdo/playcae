export interface Company {
  id: string;
  name: string;
  cif: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: 'Pendiente' | 'Apta' | 'No apta';
  createdAt: string;
  updatedAt: string;
}

export interface CompanyFormData {
  name: string;
  cif: string;
  contactPerson: string;
  email: string;
  phone?: string;
}
