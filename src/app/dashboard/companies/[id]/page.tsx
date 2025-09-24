"use client";

import { CompanyDetailHeader } from "@/components/CompanyDetailHeader";
import { CompanyObservations } from "@/components/CompanyObservations";
import { DocumentsTable } from "@/components/DocumentTable";
import { EditableCompanyInfo } from "@/components/EditableCompanyInfo";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { WorkerFilters } from "@/components/WorkersFilter";
import { WorkersTable } from "@/components/WorkersTable";
import { useToast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCompanies } from "@/hooks/useCompanies";
import { useDocuments } from "@/hooks/useDocuments";
import { useWorkers } from "@/hooks/useWorkers";
import { Company, CompanyFormData } from "@/types/company";
import {
  DocumentFormData,
  EntityStatus,
  UploadDocument,
} from "@/types/document";
import { UserRole } from "@/types/user";
import { WorkerFormData, WorkerStatus } from "@/types/worker";
import { FileText, MessageSquare, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCompanyById, updateCompany } = useCompanies();
  const {
    createWorker,
    updateWorker,
    getWorkersByCompanyId,
    workers,
    deleteWorker,
    activateWorker,
    filteredWorkers,
  } = useWorkers(id);
  const {
    documents,
    observations,
    uploadDocument,
    validateDocument,
    showErrorUpload,
  } = useDocuments(id || "");
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const [filters, setFilters] = useState<{
    search: string;
    status?: WorkerStatus;
    activeFilter: "Activos" | "Inactivos" | "Todos";
  }>({
    search: "",
    status: undefined,
    activeFilter: "Todos",
  });

  const fetchCompany = async (id: string) => {
    const response = await getCompanyById(id);
    if (!response) {
      return;
    }
    await getWorkersByCompanyId(id);
    setCompany(response);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleValidateDocument = async (
    documentId: string,
    isValid: boolean,
    comment?: string
  ) => {
    try {
      setIsLoading(true);

      validateDocument(documentId, isValid, comment);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCompany = async (id: string, data: CompanyFormData) => {
    setIsLoading(true);
    await updateCompany(id, data);
    await fetchCompany(id);
    setIsLoading(false);
  };

  const handleCreateWorker = async (data: WorkerFormData) => {
    setIsLoading(true);
    await createWorker(data);
    await fetchCompany(id);
    toast({
      title: "Trabajador creado correctamente",
      description:
        "El trabajador se ha registrado correctamente y se ha agregado a la empresa.",
      variant: "default",
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompany(id);
  }, [id]);

  const handleUploadDocument = async (
    documentId: string,
    data: DocumentFormData,
    workerId: string
  ) => {
    try {
      setIsLoading(true);
      console.log(documentId, data);
      const request: UploadDocument = {
        file: data.file,
        expiryDate: data.expiryDate,
        companyId: id,
        documentId,
      };
      const resultUpload = await uploadDocument(request);
      if (workerId != "") {
        const worker = workers.find((w) => w.id === workerId);
        const existDoc = worker?.documents?.find((d) => d.id === documentId);
        if (existDoc) {
          existDoc.storagePath = resultUpload?.document.storagePath ?? "";
          existDoc.uploadedDate = resultUpload?.document.uploadedDate ?? "";
          existDoc.expirationDate = resultUpload?.document.expirationDate ?? "";
          existDoc.status = resultUpload?.document.status!;
        }
      }
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }

    //await fetchCompany(id);
  };

  const displayedWorkers = filteredWorkers(
    filters.search,
    filters.status,
    filters.activeFilter
  );

  useEffect(() => {
    if (showErrorUpload) {
      toast({
        title: "Error al subir el documento",
        description: showErrorUpload,
        variant: "destructive",
      });
    }
  }, [showErrorUpload, toast]);

  if (!company && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Empresa no encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              La empresa que buscas no existe o no tienes permisos para verla.
            </p>
            <Button onClick={() => {}}>Volver al listado</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (company)
    return (
      <div>
        <CompanyDetailHeader companyName={company?.name || ""} />
        {isLoading && <Loader text="Cargando información..." />}
        <div className="container mx-auto px-4 py-8 space-y-8">
          <EditableCompanyInfo
            company={company}
            onUpdate={handleUpdateCompany}
            userRole={UserRole.Admin}
          />
        </div>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Tabs defaultValue="workers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-200">
              <TabsTrigger value="workers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Documentos Trabajadores ({workers.length})
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Documentos Empresa
              </TabsTrigger>
              <TabsTrigger
                value="observations"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Observaciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="workers" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <WorkerFilters onFilter={setFilters} />
                </div>
              </div>
              <WorkersTable
                onCreateWorker={(e) => {
                  handleCreateWorker(e);
                }}
                onUpdateWorker={(workerId, workerData) => {
                  updateWorker(workerId, workerData);
                }}
                onDeleteWorker={(workerId) => {
                  deleteWorker(workerId);
                }}
                userRole={user?.role!}
                onUploadDocument={(
                  documentId: string,
                  data: DocumentFormData,
                  workerId: string
                ) => {
                  return handleUploadDocument(documentId, data, workerId);
                }}
                onValidateDocument={() => {}}
                workers={displayedWorkers}
                onActivateWorker={(workerId: string) => {
                  activateWorker(workerId);
                }}
              />
            </TabsContent>
            <TabsContent value="documents" className="space-y-6">
              <DocumentsTable
                documents={documents}
                userRole={user?.role!}
                onUpload={(documentId: string, data: DocumentFormData) => {
                  return handleUploadDocument(documentId, data, "");
                }}
                onValidate={(
                  id: string,
                  isValid: boolean,
                  comment?: string
                ) => {
                  return handleValidateDocument(id, isValid, comment);
                }}
              />
            </TabsContent>

            <TabsContent value="observations" className="space-y-6">
              <CompanyObservations
                observations={observations}
                userRole={UserRole.Admin}
                onAddObservation={() => {}}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
};

export default CompanyDetailPage;
