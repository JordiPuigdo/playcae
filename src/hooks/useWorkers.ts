import { useState, useMemo } from "react";
import { Worker, WorkerFormData, WorkerStatus } from "@/types/worker";
import { UserRole } from "@/types/user";
import { WorkerService } from "@/services/worker.service";
import { DocumentService } from "@/services/document.service";
import { EntityStatus } from "@/types/document";

export const useWorkers = (companyId: string | undefined) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [userRole] = useState<UserRole>(UserRole.Admin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerService = new WorkerService();
  const documentService = useMemo(() => new DocumentService(), []);
  const companyWorkers = useMemo(() => {
    if (!companyId) return workers;
    return workers.filter((worker) => worker.companyId === companyId);
  }, [workers, companyId]);

  const filteredWorkers = (
    search: string,
    status: WorkerStatus | undefined,
    activeFilter: "Activos" | "Inactivos" | "Todos" = "Todos"
  ) => {
    let filtered = companyWorkers;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.firstName.toLowerCase().includes(searchLower) ||
          worker.lastName.toLowerCase().includes(searchLower) ||
          worker.cardId.toLowerCase().includes(searchLower)
      );
    }

    if (status !== undefined) {
      filtered = filtered.filter((worker) => worker.status === status);
    }

    if (activeFilter !== "Todos") {
      filtered = filtered.filter((worker) =>
        activeFilter === "Activos" ? worker.active : !worker.active
      );
    }

    return filtered;
  };

  const createBulkWorkers = async (workersData: WorkerFormData[]) => {
    if (!companyId) return;

    try {
      setIsLoading(true);
      const workersToCreate = workersData.map((data) => ({
        companyId,
        firstName: data.firstName,
        lastName: data.lastName,
        cardId: data.cardId,
        position: data.position,
        status: WorkerStatus.Rejected,
        ssn: data.ssn,
      }));

      const response = await workerService.createBulk(
        companyId,
        workersToCreate
      );
      setWorkers((prev) => [...prev, ...response.data]);

      return response.data;
    } catch (err) {
      setError("Error al crear los trabajadores");
      //toast.error("No se pudieron crear los trabajadores");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkersByCompanyId = async (companyId: string) => {
    const response = await workerService.getByCompanyId(companyId);
    setWorkers(response.data);
  };

  const createWorker = async (data: WorkerFormData) => {
    if (!companyId) return;
    const newWorker: Worker = {
      companyId,
      firstName: data.firstName,
      lastName: data.lastName,
      cardId: data.cardId,
      position: data.position,
      status: WorkerStatus.Rejected,
      ssn: data.ssn,
    };
    await workerService.create(newWorker);
    setWorkers((prev) => [...prev, newWorker]);
  };

  const updateWorker = async (workerId: string, data: WorkerFormData) => {
    await workerService.update(workerId, data);
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId ? { ...worker, ...data } : worker
      )
    );
  };

  const deleteWorker = async (workerId: string) => {
    await workerService.delete(workerId);
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId ? { ...worker, active: false } : worker
      )
    );
  };

  const activateWorker = async (workerId: string) => {
    await workerService.activate(workerId);
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === workerId ? { ...worker, active: true } : worker
      )
    );
  };

  const validateWorkerDocument = async (
    workerId: string,
    documentId: string,
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => {
    try {
      setIsLoading(true);
      const status = isValid ? EntityStatus.Approved : EntityStatus.Rejected;

      const response = await documentService.manualValidation(documentId, {
        status,
        expirationDate: expiryDate || new Date().toISOString(),
        comment,
      });

      if (response.data) {
        setWorkers((prev) =>
          prev.map((worker) => {
            if (worker.id !== workerId) return worker;

            const updatedDocuments = worker.documents?.map((doc) =>
              doc.id === documentId ? response.data : doc
            );

            return {
              ...worker,
              documents: updatedDocuments,
            };
          })
        );
      }
    } catch (err) {
      setError("Error al validar el documento");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /*const uploadWorkerDocument = (
    workerId: string,
    documentType: string,
    data: WorkerDocumentFormData
  ) => {
    const now = new Date().toISOString();

    setWorkers((prev) =>
      prev.map((worker) => {
        if (worker.id !== workerId) return worker;

        const updatedDocuments = worker.documents.map((doc) =>
          doc.type === documentType
            ? {
                ...doc,
                fileName: data.file.name,
                uploadDate: now,
                issueDate: data.issueDate,
                expiryDate: data.expiryDate,
                status: "Pendiente" as const,
                validatorComment: undefined,
                validatedBy: undefined,
                validatedAt: undefined,
              }
            : doc
        );

        // Recalcular estado del trabajador
        const allValidated = updatedDocuments.every(
          (doc) => doc.status === "Validado"
        );
        const anyRejected = updatedDocuments.some(
          (doc) => doc.status === "Rechazado"
        );

        let newStatus: Worker["status"] = "Pendiente";
        if (allValidated) newStatus = "Apto";
        else if (anyRejected) newStatus = "No apto";

        return {
          ...worker,
          documents: updatedDocuments,
          status: newStatus,
        };
      })
    );

    console.log(`Documento ${data.file.name} subido para validación`);
  };*/

  /*const validateWorkerDocument = (
    workerId: string,
    documentId: string,
    isValid: boolean,
    comment?: string
  ) => {
    const now = new Date().toISOString();

    setWorkers((prev) =>
      prev.map((worker) => {
        if (worker.id !== workerId) return worker;

        const updatedDocuments = worker.documents.map((doc) =>
          doc.id === documentId
            ? {
                ...doc,
                status: (isValid
                  ? "Validado"
                  : "Rechazado") as WorkerDocument["status"],
                validatorComment: comment,
                validatedBy: "Ana Técnico", // En un caso real vendría del usuario logueado
                validatedAt: now,
              }
            : doc
        );

        // Recalcular estado del trabajador
        const allValidated = updatedDocuments.every(
          (doc) => doc.status === "Validado"
        );
        const anyRejected = updatedDocuments.some(
          (doc) => doc.status === "Rechazado"
        );

        let newStatus: Worker["status"] = "Pendiente";
        if (allValidated) newStatus = "Apto";
        else if (anyRejected) newStatus = "No apto";

        return {
          ...worker,
          documents: updatedDocuments,
          status: newStatus,
        };
      })
    );

    const status = isValid ? "validado" : "rechazado";
    console.log(`Documento ${status}. Notificación enviada a la empresa.`);
  };*/

  return {
    workers: companyWorkers,
    userRole,
    isLoading,
    error,
    filteredWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    getWorkersByCompanyId,
    createBulkWorkers,
    activateWorker,
    validateWorkerDocument,
  };
};
