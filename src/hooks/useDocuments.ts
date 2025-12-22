import { useState, useEffect, useMemo } from "react";
import {
  Document,
  CompanyObservation,
  EntityStatus,
  UploadDocument,
  WorkerDocumentHistoricalRequest,
} from "@/types/document";

import { DocumentService } from "@/services/document.service";

export const useDocuments = (companyId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [historicalDocuments, setHistoricalDocuments] = useState<Document[]>(
    []
  );

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
      const docs = response.data || [];
      docs.sort((a, b) =>
        (a.documentType?.name ?? "").localeCompare(b.documentType?.name ?? "")
      );
      setDocuments(docs);
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
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => (doc.id === documentId ? response.data : doc))
        );
      }
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
          (doc) => doc.id === request.documentId
        );
        if (existsDoc) {
          existsDoc.storagePath = documentResponse.storagePath;
          existsDoc.uploadedDate = documentResponse.uploadedDate;
          existsDoc.expirationDate = documentResponse.expirationDate;
          existsDoc.status = documentResponse.status;
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
        return response.data;
      }
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        setShowErrorUpload(err.message);
      } else {
        setShowErrorUpload("Error desconocido al subir el documento");
      }
      setTimeout(() => {
        setShowErrorUpload(null);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkerDocumentsHistory = async (
    request: WorkerDocumentHistoricalRequest
  ) => {
    try {
      setIsLoading(true);
      const response = await documentService.getWorkerDocumentsHistory(request);
      setHistoricalDocuments(response.data || []);
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const openDocument = async (documentId: string) => {
    try {
      console.log(documentId);
      const sasUrl = await documentService.open(documentId);
      console.log(sasUrl);
      if (sasUrl.status !== 200 || sasUrl.data == null)
        setError("No se pudo abrir el documento");
      else window.open(sasUrl.data, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error al abrir documento", error);
    }
  };

  const update = async (id: string, document: Partial<Document>) => {
    try {
      setIsLoading(true);
      const response = await documentService.update(id, document);
      const updatedDoc = response.data;
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc.id === id ? updatedDoc : doc))
      );
      return updatedDoc;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    documents,
    historicalDocuments,
    observations: companyObservations,
    isLoading,
    error,
    showErrorUpload,
    getWorkerDocumentsHistory,
    uploadDocument,
    validateDocument,
    addObservation,
    refreshDocuments: loadDocuments,
    openDocument,
    update,
  };
};
