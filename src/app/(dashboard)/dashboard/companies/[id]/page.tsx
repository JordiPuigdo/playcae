"use client";

import { CompanyDetailHeader } from "@/components/CompanyDetailHeader";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyObservations } from "@/components/CompanyObservations";
import { DocumentsTable } from "@/components/DocumentTable";
import { SubcontractorsList } from "@/components/SubcontractorsList";
import { EditableCompanyInfo } from "@/components/EditableCompanyInfo";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { WorkerFilters } from "@/components/WorkersFilter";
import { WorkersTable } from "@/components/WorkersTable";
import { useToast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCompanies } from "@/hooks/useCompanies";
import { useDocuments } from "@/hooks/useDocuments";
import { useWorkers } from "@/hooks/useWorkers";
import { useTranslation } from "@/hooks/useTranslation";
import { Company, CompanyFormData, CompanySimple, CompanyType } from "@/types/company";
import {
  DocumentFormData,
  EntityStatus,
  UploadDocument,
} from "@/types/document";
import { UserRole } from "@/types/user";
import { WorkerFormData, WorkerStatus } from "@/types/worker";
import { FileText, MessageSquare, Users, Network, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    getCompanyById,
    updateCompany,
    getSubcontractors,
    createSubcontractor,
    toggleCompanyActive,
    resendWelcomeEmail,
    updateCompanyType,
    toggleInternalPrevention,
  } = useCompanies();
  const {
    createWorker,
    updateWorker,
    getWorkersByCompanyId,
    workers,
    deleteWorker,
    activateWorker,
    filteredWorkers,
    validateWorkerDocument,
  } = useWorkers(id);
  const {
    documents,
    observations,
    uploadDocument,
    validateDocument,
    showErrorUpload,
    openDocument,
    update,
    refreshDocuments,
  } = useDocuments(id || "");
  const [company, setCompany] = useState<Company | null>(null);
  const [subcontractors, setSubcontractors] = useState<CompanySimple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubcontractorFormOpen, setIsSubcontractorFormOpen] = useState(false);
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

    // Cargar subcontratas
    if (response.subcontractors) {
      setSubcontractors(response.subcontractors);
    } else {
      const subs = await getSubcontractors(id);
      setSubcontractors(subs);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleValidateDocument = async (
    documentId: string,
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => {
    try {
      setIsLoading(true);
      await validateDocument(documentId, isValid, comment, expiryDate);
      await fetchCompany(id);
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

  const handleToggleActive = async (companyId: string, activate: boolean) => {
    setIsLoading(true);
    try {
      await toggleCompanyActive(companyId, activate);
      await fetchCompany(id);
    } catch (error) {
      // El error ya se maneja en EditableCompanyInfo con toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateType = async (companyId: string, type: CompanyType) => {
    setIsLoading(true);
    try {
      await updateCompanyType(companyId, type);
      await fetchCompany(id);
      await refreshDocuments();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleInternalPrevention = async (companyId: string, hasInternalPrevention: boolean) => {
    setIsLoading(true);
    try {
      await toggleInternalPrevention(companyId, hasInternalPrevention);
      await fetchCompany(id);
      await refreshDocuments();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorker = async (data: WorkerFormData) => {
    setIsLoading(true);
    await createWorker(data);
    await fetchCompany(id);
    toast({
      title: t("notifications.workerCreated"),
      description: t("notifications.workerCreatedDesc"),
      variant: "default",
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompany(id);
  }, [id]);

  const handleOpenDocument = useCallback(async (documentId: string) => {
    await openDocument(documentId);
  }, []);

  const handleUploadDocument = async (
    documentId: string,
    data: DocumentFormData,
    workerId: string
  ) => {
    try {
      setIsLoading(true);
      const request: UploadDocument = {
        file: data.file,
        expiryDate: data.expiryDate,
        companyId: id,
        documentId,
        workerId,
        forceValidation: data.forceValidation,
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
        title: t("notifications.uploadError"),
        description: showErrorUpload,
        variant: "destructive",
      });
    }
  }, [showErrorUpload, toast, t]);

  if (!company && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              {t("errors.notFound")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("errors.notFound")}
            </p>
            <Button onClick={() => {}}>{t("common.back")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (company)
    return (
      <div>
        <CompanyDetailHeader
          companyName={company?.name || ""}
          isSubcontractor={company?.isSubcontractor || false}
          parentCompanyId={company?.parentCompanyId}
          parentCompanyName={company?.parentCompanyName}
        />

        {isLoading && <Loader />}

        <div className="container mx-auto px-4 py-8 space-y-8">
          <EditableCompanyInfo
            company={company}
            onUpdate={handleUpdateCompany}
            onToggleActive={handleToggleActive}
            onResendWelcomeEmail={resendWelcomeEmail}
            onUpdateType={handleUpdateType}
            onToggleInternalPrevention={handleToggleInternalPrevention}
            userRole={user?.role!}
          />
        </div>

        <div className="container mx-auto px-4 py-8 space-y-8">
          <Tabs defaultValue="workers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-playGrey border border-playBlueLight">
              <TabsTrigger
                value="workers"
                className="flex items-center gap-2 text-brand-primary data-[state=active]:bg-playBlueLight data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.workers")}</span> (
                {workers.length})
              </TabsTrigger>

              <TabsTrigger
                value="documents"
                className="flex items-center gap-2 text-brand-primary data-[state=active]:bg-playBlueLight data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.documents")}</span>
              </TabsTrigger>

              <TabsTrigger
                value="subcontractors"
                className="flex items-center gap-2 text-brand-primary data-[state=active]:bg-playOrange data-[state=active]:text-white"
              >
                <Network className="h-4 w-4" />
                <span className="hidden sm:inline">{t("dashboard.sidebar.subcontractors")}</span> (
                {subcontractors.length})
              </TabsTrigger>

              <TabsTrigger
                value="observations"
                className="flex items-center gap-2 text-brand-primary data-[state=active]:bg-playBlueLight data-[state=active]:text-white"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">{t("common.observations")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workers" className="space-y-6">
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
                onUploadDocument={(documentId, data, workerId) =>
                  handleUploadDocument(documentId, data, workerId)
                }
                onValidateDocument={(
                  workerId,
                  documentId,
                  isValid,
                  comment,
                  expiryDate
                ) =>
                  validateWorkerDocument(
                    workerId,
                    documentId,
                    isValid,
                    comment,
                    expiryDate
                  )
                }
                workers={displayedWorkers}
                onActivateWorker={(workerId) => {
                  activateWorker(workerId);
                }}
                onOpenDocument={(documentId) => handleOpenDocument(documentId)}
                onRefresh={() => getWorkersByCompanyId(id)}
              />
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <DocumentsTable
                documents={documents}
                userRole={user?.role!}
                onUpload={(documentId, data) =>
                  handleUploadDocument(documentId, data, "")
                }
                onValidate={(id, isValid, comment, expiryDate) =>
                  handleValidateDocument(id, isValid, comment, expiryDate)
                }
                onOpen={(documentId) => handleOpenDocument(documentId)}
                companyId={id}
                onRefresh={refreshDocuments}
              />
            </TabsContent>

            <TabsContent value="subcontractors" className="space-y-6">
              <SubcontractorsList
                subcontractors={subcontractors}
                parentCompanyName={company.name}
                onAddSubcontractor={() => setIsSubcontractorFormOpen(true)}
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

        {/* Modal para añadir subcontrata */}
        <Dialog
          open={isSubcontractorFormOpen}
          onOpenChange={setIsSubcontractorFormOpen}
        >
          <DialogContent className="max-w-2xl bg-white border border-playBlueLight/30">
            <DialogHeader>
              <DialogTitle className="text-brand-primary flex items-center gap-2">
                <Network className="h-5 w-5 text-playOrange" />
                {t("subcontractors.newSubcontractor", { name: company.name })}
              </DialogTitle>
              <p className="text-sm text-playBlueLight mt-1">
                {t("subcontractors.newSubcontractorDesc", { name: company.name })}
              </p>
            </DialogHeader>

            <CompanyForm
              isOpen={isSubcontractorFormOpen}
              onClose={() => setIsSubcontractorFormOpen(false)}
              onSubmit={async (data) => {
                try {
                  setIsLoading(true);
                  await createSubcontractor(id, data);
                  toast({
                    title: t("subcontractors.created"),
                    description: t("subcontractors.createdDesc", { name: data.name }),
                  });
                  // Refrescar subcontratas
                  const subs = await getSubcontractors(id);
                  setSubcontractors(subs);
                  setIsSubcontractorFormOpen(false);
                } catch (error) {
                  toast({
                    title: t("errors.generic"),
                    description: t("subcontractors.createError"),
                    variant: "destructive",
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              mode="create"
            />
          </DialogContent>
        </Dialog>
      </div>
    );
};

export default CompanyDetailPage;
