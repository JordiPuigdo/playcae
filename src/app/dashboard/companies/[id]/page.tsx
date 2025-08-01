"use client";

import { CompanyDetailHeader } from "@/components/CompanyDetailHeader";
import { CompanyObservations } from "@/components/CompanyObservations";
import { DocumentsTable } from "@/components/DocumentTable";
import { EditableCompanyInfo } from "@/components/EditableCompanyInfo";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { WorkersTable } from "@/components/WorkersTable";
import { useToast } from "@/hooks/use-Toast";
import { useCompanies } from "@/hooks/useCompanies";
import { useDocuments } from "@/hooks/useDocuments";
import { useWorkers } from "@/hooks/useWorkers";
import { Company, CompanyFormData } from "@/types/company";
import { UserRole } from "@/types/user";
import { WorkerFormData } from "@/types/worker";
import { FileText, MessageSquare, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getCompanyById, updateCompany } = useCompanies();
  const { createWorker, updateWorker, getWorkersByCompanyId, workers } =
    useWorkers(id);
  const { documents, observations } = useDocuments(id || "");
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
              <WorkersTable
                onCreateWorker={(e) => {
                  handleCreateWorker(e);
                }}
                onUpdateWorker={(workerId, workerData) => {
                  updateWorker(workerId, workerData);
                }}
                onDeleteWorker={() => {}}
                userRole={UserRole.Admin}
                onUploadDocument={() => {}}
                onValidateDocument={() => {}}
                workers={workers}
              />
            </TabsContent>
            <TabsContent value="documents" className="space-y-6">
              <DocumentsTable
                documents={documents}
                userRole={UserRole.Admin}
                onUpload={() => {}}
                onValidate={() => {}}
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
