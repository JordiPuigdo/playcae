"use client";

import { CompanyFilters } from "@/components/CompanyFilters";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyTable } from "@/components/CompanyTable";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { DialogHeader } from "@/components/ui/Dialog";
import { toast } from "@/hooks/use-Toast";

import { useCompanies } from "@/hooks/useCompanies";
import { Company, CompanyFormData } from "@/types/company";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Building2, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const CompaniesManagement = () => {
  const {
    createCompany,
    updateCompany,
    filteredCompanies,
    deleteCompany,
    activateCompany,
  } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Company["status"] | "Todos">(
    "Todos"
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const filteredResults = filteredCompanies(searchTerm, statusFilter);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCompany = async (companyId: string) => {
    deleteCompany(companyId);
  };

  const handleFilter = (filters: {
    search: string;
    status: Company["status"] | "Todos";
  }) => {
    setSearchTerm(filters.search);
    setStatusFilter(filters.status);
  };
  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);
      if (editingCompany && editingCompany.id) {
        updateCompany(editingCompany.id, data);
      } else {
        await createCompany(data);
      }
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (error) {
      setError("Error creando empresa");
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error != null) {
      toast({
        title: "Error al crear empresa",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        {isLoading && <Loader text="Creando empresa..." />}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <Building2 className="h-7 w-7 text-brand-primary" />
                Gestión de Empresas
              </h1>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center bg-playOrange hover:bg-playOrange/90 text-white"
                variant={"submit"}
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
          <div className="flex-1 bg-white border border-playBlueLight/20">
            <CompanyFilters onFilter={handleFilter} />
          </div>
        </div>

        <CompanyTable
          companies={filteredResults}
          onEdit={handleEdit}
          onDeleteCompany={handleDeleteCompany}
          onActivateCompany={(id) => {
            activateCompany(id);
          }}
        />

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-2xl bg-white border border-playBlueLight/30">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">
                {editingCompany ? "Editar Empresa" : "Nueva Empresa"}
              </DialogTitle>
            </DialogHeader>

            <CompanyForm
              isOpen={isFormOpen}
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
              company={editingCompany || undefined}
              mode={editingCompany ? "edit" : "create"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompaniesManagement;
