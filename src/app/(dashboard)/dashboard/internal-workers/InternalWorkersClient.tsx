"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/Loader";
import { WorkerFilters } from "@/components/WorkersFilter";
import { WorkersTable } from "@/components/WorkersTable";
import { InternalWorkersBulkForm } from "@/components/InternalWorkersBulkForm";
import { InternalWorkersImport } from "@/components/InternalWorkersImport";
import { useWorkers } from "@/hooks/useWorkers";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { WorkerService } from "@/services/worker.service";
import { Worker, WorkerFormData, WorkerStatus } from "@/types/worker";
import {
  DocumentFormData,
  UploadDocument,
} from "@/types/document";
import { Users, Layers, FileSpreadsheet } from "lucide-react";

export const InternalWorkersClient = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const licenseSummary = useAuthStore((s) => s.licenseSummary);
  const user = useAuthStore((s) => s.user);

  const workerService = useMemo(() => new WorkerService(), []);
  const [mainCompanyId, setMainCompanyId] = useState<string | undefined>(
    undefined
  );
  const [initialWorkers, setInitialWorkers] = useState<Worker[] | undefined>(
    undefined
  );
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    let active = true;
    setResolving(true);
    workerService
      .getInternalByUserId(user.userId)
      .then((res) => {
        if (!active) return;
        setMainCompanyId(res.data.companyId);
        setInitialWorkers(res.data.workers);
      })
      .catch(() => {
        if (active) setMainCompanyId(undefined);
      })
      .finally(() => {
        if (active) setResolving(false);
      });
    return () => {
      active = false;
    };
  }, [user?.userId, workerService]);

  const {
    createWorker,
    updateWorker,
    deleteWorker,
    activateWorker,
    getWorkersByCompanyId,
    createBulkWorkers,
    workers,
    filteredWorkers,
    validateWorkerDocument,
  } = useWorkers(mainCompanyId ?? undefined, initialWorkers);

  const { uploadDocument, showErrorUpload } = useDocuments(mainCompanyId ?? "");

  const [isLoading, setIsLoading] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [filters, setFilters] = useState<{
    search: string;
    status?: WorkerStatus;
    activeFilter: "Activos" | "Inactivos" | "Todos";
  }>({ search: "", status: undefined, activeFilter: "Todos" });

  const workersAtLimit =
    licenseSummary?.enableInternalWorkers === true &&
    licenseSummary.maxInternalWorkers != null &&
    licenseSummary.currentInternalWorkers >= licenseSummary.maxInternalWorkers;

  const refreshWorkers = async () => {
    if (mainCompanyId) await getWorkersByCompanyId(mainCompanyId);
  };

  useEffect(() => {
    if (showErrorUpload) {
      toast({
        title: t("notifications.uploadError"),
        description: showErrorUpload,
        variant: "destructive",
      });
    }
  }, [showErrorUpload, toast, t]);

  const handleCreateWorker = async (data: WorkerFormData) => {
    setIsLoading(true);
    try {
      await createWorker(data);
      await refreshWorkers();
      toast({
        title: t("notifications.workerCreated"),
        description: t("notifications.workerCreatedDesc"),
        variant: "default",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (
    documentId: string,
    data: DocumentFormData,
    workerId: string
  ) => {
    if (!mainCompanyId) return;
    try {
      setIsLoading(true);
      const request: UploadDocument = {
        file: data.file,
        expiryDate: data.expiryDate,
        companyId: mainCompanyId,
        documentId,
        workerId,
        forceValidation: data.forceValidation,
      };
      const resultUpload = await uploadDocument(request);
      if (workerId !== "") {
        const worker = workers.find((w) => w.id === workerId);
        const existDoc = worker?.documents?.find((d) => d.id === documentId);
        if (existDoc) {
          existDoc.storagePath = resultUpload?.document.storagePath ?? "";
          existDoc.uploadedDate = resultUpload?.document.uploadedDate ?? "";
          existDoc.expirationDate = resultUpload?.document.expirationDate ?? "";
          existDoc.status = resultUpload?.document.status!;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCreate = async (rows: WorkerFormData[]) => {
    await createBulkWorkers(rows);
    await refreshWorkers();
  };

  const displayedWorkers = filteredWorkers(
    filters.search,
    filters.status,
    filters.activeFilter
  );

  if (resolving) {
    return <Loader />;
  }

  if (!mainCompanyId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center text-brand-primary">
            {t("internalWorkers.noMainCompany")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-primary flex items-center gap-2">
            <Users className="h-6 w-6 text-brand-primary" />
            {t("internalWorkers.title")}
          </h1>
          <p className="text-sm text-brand-primary/70">
            {t("internalWorkers.subtitle")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => !workersAtLimit && setIsBulkOpen(true)}
            disabled={workersAtLimit}
            className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey disabled:opacity-50"
          >
            <Layers className="h-4 w-4" />
            {t("internalWorkers.addMultiple")}
          </Button>
          <Button
            variant="outline"
            onClick={() => !workersAtLimit && setIsImportOpen(true)}
            disabled={workersAtLimit}
            className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {t("internalWorkers.importExcel")}
          </Button>
        </div>
      </div>

      {isLoading && <Loader />}

      <WorkerFilters onFilter={setFilters} />

      <WorkersTable
        workers={displayedWorkers}
        userRole={user?.role!}
        workersAtLimit={workersAtLimit}
        manageMode
        onCreateWorker={handleCreateWorker}
        onUpdateWorker={(workerId, workerData) =>
          updateWorker(workerId, workerData)
        }
        onDeleteWorker={(workerId) => deleteWorker(workerId)}
        onUploadDocument={(documentId, data, workerId) =>
          handleUploadDocument(documentId, data, workerId)
        }
        onValidateDocument={(workerId, documentId, isValid, comment, expiryDate) =>
          validateWorkerDocument(workerId, documentId, isValid, comment, expiryDate)
        }
        onActivateWorker={(workerId) => activateWorker(workerId)}
        onRefresh={refreshWorkers}
      />

      <InternalWorkersBulkForm
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onSubmit={handleBulkCreate}
      />

      <InternalWorkersImport
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSubmit={handleBulkCreate}
      />
    </div>
  );
};
