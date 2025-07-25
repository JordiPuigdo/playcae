import { useState, useEffect, useMemo } from "react";
import {
  Document,
  DocumentFormData,
  CompanyObservation,
  EntityStatus,
} from "@/types/document";

import { DocumentService } from "@/services/document.service";
import { useAuthStore } from "./useAuthStore";
import { useToast } from "./use-Toast";

export const useDocuments = (companyId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [observations, setObservations] = useState<CompanyObservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const documentService = useMemo(() => new DocumentService(), []);

  // Cargar documentos iniciales
  useEffect(() => {
    if (companyId) {
      loadDocuments();
    }
  }, [companyId]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await documentService.getByCompanyId(companyId);
      setDocuments(response.data || []);
      setError(null);
    } catch (err) {
      setError("Error al cargar documentos");
      //toast.error("No se pudieron cargar los documentos");
    } finally {
      setIsLoading(false);
    }
  };

  const companyObservations = useMemo(
    () => observations.filter((obs) => obs.companyId === companyId),
    [observations, companyId]
  );

  const uploadDocument = async (documentId: string, data: DocumentFormData) => {
    try {
      setIsLoading(true);

      // En un caso real, aquí subirías el archivo primero
      // const fileUrl = await uploadFile(data.file);

      const response = await documentService.update(documentId, {
        status: EntityStatus.Pending,
      });

      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? response.data : doc))
      );
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validateDocument = async (
    documentId: string,
    isValid: boolean,
    comment?: string
  ) => {
    try {
      setIsLoading(true);
      const status = isValid ? EntityStatus.Approved : EntityStatus.Rejected;
      const response = await documentService.updateStatus(documentId, status);

      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === documentId
            ? {
                ...response.data,
                validatorComment: comment,
                validatedBy: "Admin",
              }
            : doc
        )
      );
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addObservation = async (observation: string) => {
    try {
      setIsLoading(true);
      // En un caso real, llamarías al API para guardar la observación
      const newObservation: CompanyObservation = {
        id: Date.now().toString(),
        companyId,
        observation,
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
      };

      setObservations((prev) => [newObservation, ...prev]);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    observations: companyObservations,
    isLoading,
    error,
    uploadDocument,
    validateDocument,
    addObservation,
    refreshDocuments: loadDocuments,
  };
};
