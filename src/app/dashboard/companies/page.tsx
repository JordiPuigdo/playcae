'use client';

import { CompanyFilters } from '@/components/CompanyFilters';
import { CompanyForm } from '@/components/CompanyForm';
import { CompanyTable } from '@/components/CompanyTable';
import { Button } from '@/components/ui/Button';
import { DialogHeader } from '@/components/ui/Dialog';
import { useCompanies } from '@/hooks/useCompanies';
import { Company, CompanyFormData } from '@/types/company';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Building2, Plus } from 'lucide-react';
import { useState } from 'react';

const CompaniesManagement = () => {
  const { createCompany, updateCompany, filteredCompanies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Company['status'] | 'Todos'>('Todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const filteredResults = filteredCompanies(searchTerm, statusFilter);

  const handleFilter = (filters: { search: string; status: Company['status'] | 'Todos' }) => {
    setSearchTerm(filters.search);
    setStatusFilter(filters.status);
  };
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: CompanyFormData) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, data);
    } else {
      createCompany(data);
    }
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  return (
    <div>
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-border" />
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Building2 className="h-7 w-7 text-primary" />
                Gestión de Empresas
              </h1>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center"
                variant={'submit'}
              >
                <Plus className="h-4 w-4" />
                Nueva Empresa
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1 bg-white">
            <CompanyFilters onFilter={handleFilter} />
          </div>
        </div>

        <CompanyTable companies={filteredResults} onEdit={handleEdit} />

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}</DialogTitle>
            </DialogHeader>
            <CompanyForm
              isOpen={isFormOpen}
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
              company={editingCompany || undefined}
              mode={editingCompany ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompaniesManagement;
