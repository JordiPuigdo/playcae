"use client";

import { CompanyFilters } from "@/components/CompanyFilters";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyTree } from "@/components/CompanyTree";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { DialogHeader } from "@/components/ui/Dialog";
import { toast } from "@/hooks/use-Toast";

import { useCompanies } from "@/hooks/useCompanies";
import { Company, CompanyFormData, CompanySimple } from "@/types/company";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Building2, Plus, Network, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";

const CompaniesManagement = () => {
  const {
    createCompany,
    updateCompany,
    filteredCompanies,
    deleteCompany,
    activateCompany,
    getSubcontractors,
    createSubcontractor,
  } = useCompanies();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Company["status"] | "Todos">(
    "Todos"
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<
    Company | CompanySimple | null
  >(null);
  const [parentCompanyForSubcontractor, setParentCompanyForSubcontractor] =
    useState<Company | CompanySimple | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const filteredResults = filteredCompanies(searchTerm, statusFilter);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCompany = async (company: Company | CompanySimple) => {
    if (!company.id) return;
    deleteCompany(company.id);
    toast({
      title: "Empresa eliminada",
      description: `${company.name} ha sido eliminada correctamente.`,
    });
  };

  const handleFilter = (filters: {
    search: string;
    status: Company["status"] | "Todos";
  }) => {
    setSearchTerm(filters.search);
    setStatusFilter(filters.status);
  };

  const handleEdit = (company: Company | CompanySimple) => {
    setEditingCompany(company);
    setParentCompanyForSubcontractor(null);
    setIsFormOpen(true);
  };

  const handleAddSubcontractor = (parentCompany: Company | CompanySimple) => {
    setParentCompanyForSubcontractor(parentCompany);
    setEditingCompany(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CompanyFormData) => {
    try {
      setIsLoading(true);

      if (editingCompany && editingCompany.id) {
        // Editar empresa existente
        await updateCompany(editingCompany.id, data);
        toast({
          title: "Empresa actualizada",
          description: `${data.name} ha sido actualizada correctamente.`,
        });
      } else if (
        parentCompanyForSubcontractor &&
        parentCompanyForSubcontractor.id
      ) {
        // Crear subcontrata
        await createSubcontractor(parentCompanyForSubcontractor.id, data);
        toast({
          title: "Subcontrata creada",
          description: `${data.name} ha sido añadida como subcontrata de ${parentCompanyForSubcontractor.name}.`,
        });
      } else {
        // Crear empresa nueva
        await createCompany(data);
        toast({
          title: "Empresa creada",
          description: `${data.name} ha sido creada correctamente.`,
        });
      }

      setIsFormOpen(false);
      setEditingCompany(null);
      setParentCompanyForSubcontractor(null);
    } catch (error) {
      setError("Error al procesar la operación");
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
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
    setParentCompanyForSubcontractor(null);
  };

  // Determinar el título del modal
  const getFormTitle = () => {
    if (editingCompany) return "Editar Empresa";
    if (parentCompanyForSubcontractor)
      return `Nueva Subcontrata de ${parentCompanyForSubcontractor.name}`;
    return "Nueva Empresa";
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        {isLoading && (
          <Loader
            text={
              parentCompanyForSubcontractor
                ? "Creando subcontrata..."
                : "Procesando..."
            }
          />
        )}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                  <Building2 className="h-7 w-7 text-brand-primary" />
                  Gestión de Empresas
                </h1>
                <p className="text-sm text-playBlueLight mt-1 flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Gestiona proveedores y subcontratas multinivel
                </p>
              </div>
              <Button
                onClick={() => {
                  setParentCompanyForSubcontractor(null);
                  setEditingCompany(null);
                  setIsFormOpen(true);
                }}
                className="flex items-center gap-2 bg-playOrange hover:bg-playOrange/90 text-white"
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
          <div className="flex-1 bg-white border border-playBlueLight/20 rounded-xl">
            <CompanyFilters onFilter={handleFilter} />
          </div>
        </div>

        {/* Árbol de empresas con subcontratas */}
        <CompanyTree
          companies={filteredResults}
          onEdit={handleEdit}
          onDelete={handleDeleteCompany}
          onAddSubcontractor={handleAddSubcontractor}
          getSubcontractors={getSubcontractors}
        />

        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogContent className="max-w-2xl bg-white border border-playBlueLight/30">
            <DialogHeader>
              <DialogTitle className="text-brand-primary flex items-center gap-2">
                {parentCompanyForSubcontractor && (
                  <Network className="h-5 w-5 text-playOrange" />
                )}
                {getFormTitle()}
              </DialogTitle>
              {parentCompanyForSubcontractor && (
                <p className="text-sm text-playBlueLight mt-1">
                  Esta empresa será una subcontrata que trabaja para{" "}
                  {parentCompanyForSubcontractor.name}
                </p>
              )}
            </DialogHeader>

            <CompanyForm
              isOpen={isFormOpen}
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
              company={(editingCompany as Company) || undefined}
              mode={editingCompany ? "edit" : "create"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompaniesManagement;
