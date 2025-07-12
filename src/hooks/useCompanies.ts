import { useState, useMemo } from 'react';
import { Company, CompanyFormData } from '@/types/company';

// Datos de ejemplo
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Constructora ABC S.L.',
    cif: 'B12345678',
    contactPerson: 'María García López',
    email: 'maria.garcia@constructoraabc.com',
    phone: '666 123 456',
    status: 'Apta',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Instalaciones Eléctricas DEF',
    cif: 'A87654321',
    contactPerson: 'Juan Martínez Ruiz',
    email: 'juan.martinez@electricasdef.com',
    phone: '677 987 321',
    status: 'Pendiente',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '3',
    name: 'Mantenimiento Industrial GHI',
    cif: 'C11223344',
    contactPerson: 'Ana Fernández Torres',
    email: 'ana.fernandez@mantghi.com',
    status: 'No apta',
    createdAt: '2024-01-28T16:45:00Z',
    updatedAt: '2024-02-05T11:20:00Z',
  },
  {
    id: '4',
    name: 'Soldaduras y Metal JKL',
    cif: 'D55667788',
    contactPerson: 'Carlos Rodríguez Vega',
    email: 'carlos.rodriguez@soldadurasjkl.com',
    phone: '654 111 222',
    status: 'Apta',
    createdAt: '2024-02-10T13:30:00Z',
    updatedAt: '2024-02-12T08:45:00Z',
  },
];

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);

  const createCompany = (data: CompanyFormData) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      ...data,
      status: 'Pendiente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCompanies((prev) => [newCompany, ...prev]);
  };

  const updateCompany = (id: string, data: CompanyFormData) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === id ? { ...company, ...data, updatedAt: new Date().toISOString() } : company
      )
    );
  };

  const filteredCompanies = useMemo(() => {
    return (search: string, status: Company['status'] | 'Todos') => {
      return companies.filter((company) => {
        const matchesSearch =
          search === '' ||
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.cif.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = status === 'Todos' || company.status === status;

        return matchesSearch && matchesStatus;
      });
    };
  }, [companies]);

  return {
    companies,
    createCompany,
    updateCompany,
    filteredCompanies,
  };
};
