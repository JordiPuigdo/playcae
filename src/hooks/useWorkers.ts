import { useState, useMemo } from "react";
import { Worker, WorkerFormData } from "@/types/worker";
import { UserRole } from "@/types/user";
import { EntityStatus } from "@/types/document";
import { WorkerService } from "@/services/worker.service";
import { useToast } from "./use-Toast";

const REQUIRED_WORKER_DOCUMENTS = [
  { type: "dni" as const, name: "DNI/NIE" },
  { type: "formacion-prl" as const, name: "Certificado de Formación PRL" },
  { type: "aptitud-medica" as const, name: "Aptitud Médica" },
];

export const useWorkers = (companyId: string | undefined) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [userRole] = useState<UserRole>(UserRole.Admin);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const workerService = new WorkerService();
  const companyWorkers = useMemo(() => {
    if (!companyId) return workers;
    return workers.filter((worker) => worker.companyId === companyId);
  }, [workers, companyId]);

  const filteredWorkers = (search: string, status: EntityStatus) => {
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

    /*if (status !== "Todos") {
      filtered = filtered.filter((worker) => worker.status === status);
    }*/

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
        status: EntityStatus.Pending,
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
      status: EntityStatus.Pending,
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
    setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
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
    filteredWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    getWorkersByCompanyId,
    createBulkWorkers,
    //uploadWorkerDocument,
    //validateWorkerDocument,
  };
};
