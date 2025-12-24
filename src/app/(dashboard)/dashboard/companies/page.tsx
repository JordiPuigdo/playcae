"use client";

import { CompanyFilters } from "@/components/CompanyFilters";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyTable } from "@/components/CompanyTable";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { DialogHeader } from "@/components/ui/Dialog";
import { toast } from "@/hooks/use-Toast";

import { useCompanies } from "@/hooks/useCompanies";
import { Company, CompanyFormData, CompanySimple } from "@/types/company";
import { WorkerStatus } from "@/types/worker";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Building2, Plus } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Componente interno que usa useSearchParams
const CompaniesContent = () => {
  const {
    companies,
    createCompany,
    updateCompany,
    deleteCompany,
    activateCompany,
  } = useCompanies();

  // URL Query Params para persistir filtros
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Leer filtros desde URL (source of truth)
  const searchTerm = searchParams.get("search") || "";
  const statusParam = searchParams.get("status");
  const statusFilter: Company["status"] | "Todos" = statusParam
    ? (Number(statusParam) as Company["status"])
    : "Todos";
  const activeParam = searchParams.get("active");
  const activeFilter: "Activas" | "Inactivas" | "Todas" = activeParam
    ? (activeParam as "Activas" | "Inactivas")
    : "Todas";
  const workerStatusParam = searchParams.get("workerStatus");
  const workerStatusFilter: WorkerStatus | "Todos" = workerStatusParam
    ? (Number(workerStatusParam) as WorkerStatus)
    : "Todos";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Función para actualizar URL con nuevos filtros
  const updateFiltersInUrl = useCallback(
    (filters: {
      search: string;
      status: Company["status"] | "Todos";
      activeFilter: "Activas" | "Inactivas" | "Todas";
      workerStatus: WorkerStatus | "Todos";
    }) => {
      const params = new URLSearchParams();

      // Solo añadir params que no sean el valor por defecto
      if (filters.search) params.set("search", filters.search);
      if (filters.status !== "Todos")
        params.set("status", String(filters.status));
      if (filters.activeFilter !== "Todas")
        params.set("active", filters.activeFilter);
      if (filters.workerStatus !== "Todos")
        params.set("workerStatus", String(filters.workerStatus));

      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, pathname]
  );

  // Verificar si hay filtros activos (además del estado por defecto)
  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "Todos" ||
    activeFilter !== "Todas" ||
    workerStatusFilter !== "Todos";

  // Función para verificar si una empresa/subcontrata cumple los filtros
  const matchesFilters = (company: Company | CompanySimple): boolean => {
    // Filtro de búsqueda
    if (searchTerm !== "") {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.taxId?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Filtro estado de validación
    if (statusFilter !== "Todos" && company.status !== statusFilter) {
      return false;
    }

    // Filtro activas/inactivas
    if (activeFilter === "Activas" && company.active === false) return false;
    if (activeFilter === "Inactivas" && company.active !== false) return false;

    // Filtro estado trabajadores
    if (
      workerStatusFilter !== "Todos" &&
      company.workerStatus !== workerStatusFilter
    ) {
      return false;
    }

    return true;
  };

  // Calcular resultados filtrados
  const filteredResults = (() => {
    if (!hasActiveFilters) {
      // Sin filtros: mostrar estructura jerárquica normal (empresas con subcontratas anidadas)
      return companies;
    }

    // Con filtros: cada empresa/subcontrata es independiente
    // Aplanar la lista y filtrar individualmente
    const flatList: Company[] = [];

    companies.forEach((company) => {
      // Si la empresa principal cumple los filtros, agregarla (sin subcontratas)
      if (matchesFilters(company)) {
        flatList.push({
          ...company,
          subcontractors: [], // No mostrar subcontratas anidadas cuando hay filtros
        });
      }

      // Cada subcontrata que cumpla los filtros se agrega como fila independiente
      company.subcontractors?.forEach((sub) => {
        if (matchesFilters(sub)) {
          // Convertir CompanySimple a Company para la tabla
          flatList.push({
            ...sub,
            subcontractors: [],
            documents: [],
          } as Company);
        }
      });
    });

    return flatList;
  })();

  const [error, setError] = useState<string | null>(null);

  const handleDeleteCompany = async (companyId: string) => {
    deleteCompany(companyId);
  };

  const handleFilter = useCallback(
    (filters: {
      search: string;
      status: Company["status"] | "Todos";
      activeFilter: "Activas" | "Inactivas" | "Todas";
      workerStatus: WorkerStatus | "Todos";
    }) => {
      updateFiltersInUrl(filters);
    },
    [updateFiltersInUrl]
  );
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
            <CompanyFilters
              initialFilters={{
                search: searchTerm,
                status: statusFilter,
                activeFilter,
                workerStatus: workerStatusFilter,
              }}
              onFilter={handleFilter}
            />
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

// Componente principal con Suspense boundary para useSearchParams
const CompaniesManagement = () => {
  return (
    <Suspense fallback={<Loader text="Cargando..." />}>
      <CompaniesContent />
    </Suspense>
  );
};

export default CompaniesManagement;
