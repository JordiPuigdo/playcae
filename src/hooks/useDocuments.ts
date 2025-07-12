import { useState, useMemo } from 'react';
import { Document, DocumentFormData, CompanyObservation, UserRole } from '@/types/document';

// Tipos de documentos requeridos
const REQUIRED_DOCUMENTS = [
  { type: 'evaluacion-riesgos' as const, name: 'Evaluación de Riesgos' },
  { type: 'plan-prevencion' as const, name: 'Plan de Prevención' },
  { type: 'seguro-responsabilidad' as const, name: 'Seguro de Responsabilidad Civil' },
  { type: 'tc2-rnt' as const, name: 'Último TC2 / RNT' },
];

// Datos de ejemplo
const mockDocuments: Document[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Evaluación de Riesgos',
    type: 'evaluacion-riesgos',
    fileName: 'evaluacion_riesgos_2024.pdf',
    uploadDate: '2024-01-15T10:00:00Z',
    expiryDate: '2024-12-31T23:59:59Z',
    status: 'Validado',
    validatedBy: 'Ana Técnico',
    validatedAt: '2024-01-16T09:00:00Z',
  },
  {
    id: '2',
    companyId: '1',
    name: 'Plan de Prevención',
    type: 'plan-prevencion',
    fileName: 'plan_prevencion_2024.pdf',
    uploadDate: '2024-01-10T14:30:00Z',
    status: 'Pendiente',
  },
  {
    id: '3',
    companyId: '1',
    name: 'Seguro de Responsabilidad Civil',
    type: 'seguro-responsabilidad',
    status: 'Pendiente',
  },
];

const mockObservations: CompanyObservation[] = [
  {
    id: '1',
    companyId: '1',
    observation: 'Empresa muy colaborativa en temas de seguridad. Documentación siempre al día.',
    createdBy: 'Ana Técnico',
    createdAt: '2024-01-20T15:30:00Z',
  },
];

export const useDocuments = (companyId: string) => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [observations, setObservations] = useState<CompanyObservation[]>(mockObservations);
  const [userRole] = useState<UserRole>('tecnico-prl'); // Simulamos rol de técnico PRL

  // Obtener documentos de una empresa específica
  const companyDocuments = useMemo(() => {
    const existingDocs = documents.filter((doc) => doc.companyId === companyId);
    const existingTypes = existingDocs.map((doc) => doc.type);

    // Agregar documentos faltantes como pendientes
    const missingDocs = REQUIRED_DOCUMENTS.filter(
      (reqDoc) => !existingTypes.includes(reqDoc.type)
    ).map((reqDoc) => ({
      id: `missing-${reqDoc.type}`,
      companyId,
      name: reqDoc.name,
      type: reqDoc.type,
      status: 'Pendiente' as const,
    }));

    return [...existingDocs, ...missingDocs];
  }, [documents, companyId]);

  const companyObservations = useMemo(
    () => observations.filter((obs) => obs.companyId === companyId),
    [observations, companyId]
  );

  const uploadDocument = (documentId: string, data: DocumentFormData) => {
    const now = new Date().toISOString();

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              fileName: data.file.name,
              uploadDate: now,
              expiryDate: data.expiryDate,
              status: 'Pendiente' as const,
              validatorComment: undefined,
              validatedBy: undefined,
              validatedAt: undefined,
            }
          : doc
      )
    );

    // Simular notificación por email
    console.log(`Documento ${data.file.name} subido para validación`);
  };

  const validateDocument = (documentId: string, isValid: boolean, comment?: string) => {
    const now = new Date().toISOString();

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: isValid ? 'Validado' : 'Rechazado',
              validatorComment: comment,
              validatedBy: 'Ana Técnico', // En un caso real vendría del usuario logueado
              validatedAt: now,
            }
          : doc
      )
    );

    // Simular notificación por email
    const status = isValid ? 'validado' : 'rechazado';
    console.log(`Documento ${status}. Notificación enviada a la empresa.`);
  };

  const addObservation = (observation: string) => {
    const newObservation: CompanyObservation = {
      id: Date.now().toString(),
      companyId,
      observation,
      createdBy: 'Ana Técnico', // En un caso real vendría del usuario logueado
      createdAt: new Date().toISOString(),
    };

    setObservations((prev) => [newObservation, ...prev]);
  };

  return {
    documents: companyDocuments,
    observations: companyObservations,
    userRole,
    uploadDocument,
    validateDocument,
    addObservation,
  };
};
