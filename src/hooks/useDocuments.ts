import { useState, useEffect, useMemo } from "react";
import {
  Document,
  CompanyObservation,
  EntityStatus,
  UploadDocument,
} from "@/types/document";

import { DocumentService } from "@/services/document.service";
import { useAuthStore } from "./useAuthStore";

export const useDocuments = (companyId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [observations, setObservations] = useState<CompanyObservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showErrorUpload, setShowErrorUpload] = useState<string | null>(null);

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

  const validateDocument = async (
    documentId: string,
    isValid: boolean,
    comment?: string
  ) => {
    try {
      setIsLoading(true);
      const status = isValid ? EntityStatus.Approved : EntityStatus.Rejected;
      const response = await documentService.updateStatus(documentId, status);

      const existsDoc = documents.find((doc) => doc.id === documentId);
      if (existsDoc) existsDoc.status = status;
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

  const uploadDocument = async (request: UploadDocument) => {
    try {
      setIsLoading(true);
      const response = await documentService.upload(request);

      if (response.status === 200) {
        if (response.data.errorMessage) {
          setShowErrorUpload(response.data.errorMessage);

          setTimeout(() => {
            setShowErrorUpload(null);
          }, 5000);
          return;
        }
        const documentResponse = response.data.document;
        const existsDoc = documents.find(
          (doc) => doc.id === documentResponse.id
        );
        if (existsDoc) {
          existsDoc.storagePath = documentResponse.storagePath;
          existsDoc.uploadedDate = documentResponse.uploadedDate;
          existsDoc.expirationDate = documentResponse.expirationDate;
        } else {
          const existsRequestDoc = documents.find(
            (doc) => doc.id === request.documentId
          );
          if (existsRequestDoc) {
            setDocuments((prev) => [
              ...prev.filter((doc) => doc.id !== existsRequestDoc.id),
              documentResponse,
            ]);
          }
        }
      }
    } catch (err) {
      setIsLoading(false);
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
    showErrorUpload,
    uploadDocument,
    validateDocument,
    addObservation,
    refreshDocuments: loadDocuments,
  };
};
