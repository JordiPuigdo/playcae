import { useState, useMemo } from 'react';
import {
  Worker,
  WorkerFormData,
  WorkerDocument,
  WorkerDocumentFormData,
  WorkerStatus,
  UserRole,
} from '@/types/worker';

// Documentos requeridos por trabajador
const REQUIRED_WORKER_DOCUMENTS = [
  { type: 'dni' as const, name: 'DNI/NIE' },
  { type: 'formacion-prl' as const, name: 'Certificado de Formación PRL' },
  { type: 'aptitud-medica' as const, name: 'Aptitud Médica' },
];

// Datos de ejemplo
const mockWorkers: Worker[] = [
  {
    id: '1',
    companyId: '1',
    firstName: 'Juan',
    lastName: 'García López',
    dni: '12345678A',
    position: 'Operario de mantenimiento',
    registrationDate: '2024-01-15T10:00:00Z',
    status: 'Apto',
    documents: [
      {
        id: '1',
        workerId: '1',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_juan_garcia.pdf',
        uploadDate: '2024-01-15T10:30:00Z',
        status: 'Validado',
        validatedBy: 'Ana Técnico',
        validatedAt: '2024-01-15T11:00:00Z',
      },
      {
        id: '2',
        workerId: '1',
        type: 'formacion-prl',
        name: 'Certificado de Formación PRL',
        fileName: 'formacion_prl_juan.pdf',
        uploadDate: '2024-01-15T10:45:00Z',
        issueDate: '2024-01-10T00:00:00Z',
        expiryDate: '2027-01-10T00:00:00Z',
        status: 'Validado',
        validatedBy: 'Ana Técnico',
        validatedAt: '2024-01-15T11:15:00Z',
      },
      {
        id: '3',
        workerId: '1',
        type: 'aptitud-medica',
        name: 'Aptitud Médica',
        fileName: 'aptitud_medica_juan.pdf',
        uploadDate: '2024-01-15T11:00:00Z',
        issueDate: '2024-01-12T00:00:00Z',
        expiryDate: '2025-01-12T00:00:00Z',
        status: 'Validado',
        validatedBy: 'Ana Técnico',
        validatedAt: '2024-01-15T11:30:00Z',
      },
    ],
  },
  {
    id: '2',
    companyId: '1',
    firstName: 'María',
    lastName: 'Rodríguez Sánchez',
    dni: '87654321B',
    position: 'Supervisora',
    registrationDate: '2024-01-20T09:00:00Z',
    status: 'Pendiente',
    documents: [
      {
        id: '4',
        workerId: '2',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_maria_rodriguez.pdf',
        uploadDate: '2024-01-20T09:30:00Z',
        status: 'Pendiente',
      },
    ],
  },
  {
    id: '3',
    companyId: '2',
    firstName: 'Luis',
    lastName: 'Martínez Rubio',
    dni: '11223344C',
    position: 'Electricista',
    registrationDate: '2024-02-01T08:00:00Z',
    status: 'No apto',
    documents: [
      {
        id: '5',
        workerId: '3',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_luis_martinez.pdf',
        uploadDate: '2024-02-01T08:30:00Z',
        status: 'Rechazado',
        validatedBy: 'Carlos Técnico',
        validatedAt: '2024-02-01T09:00:00Z',
      },
    ],
  },
  {
    id: '4',
    companyId: '2',
    firstName: 'Sofía',
    lastName: 'López Núñez',
    dni: '99887766D',
    position: 'Administrativa',
    registrationDate: '2024-02-05T10:00:00Z',
    status: 'Apto',
    documents: [
      {
        id: '6',
        workerId: '4',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_sofia_lopez.pdf',
        uploadDate: '2024-02-05T10:30:00Z',
        status: 'Validado',
        validatedBy: 'Lucía Técnico',
        validatedAt: '2024-02-05T11:00:00Z',
      },
    ],
  },
  {
    id: '5',
    companyId: '3',
    firstName: 'Pedro',
    lastName: 'Ruiz Ortega',
    dni: '55443322E',
    position: 'Conductor',
    registrationDate: '2024-02-10T07:30:00Z',
    status: 'No apto',
    documents: [
      {
        id: '7',
        workerId: '5',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_pedro_ruiz.pdf',
        uploadDate: '2024-02-10T08:00:00Z',
        status: 'Rechazado',
        validatedBy: 'Eva Técnico',
        validatedAt: '2024-02-10T08:30:00Z',
      },
    ],
  },
  {
    id: '6',
    companyId: '3',
    firstName: 'Laura',
    lastName: 'Gómez Pérez',
    dni: '66778899F',
    position: 'Técnica PRL',
    registrationDate: '2024-02-12T09:00:00Z',
    status: 'Pendiente',
    documents: [],
  },
  {
    id: '7',
    companyId: '1',
    firstName: 'Antonio',
    lastName: 'Navarro Gil',
    dni: '44332211G',
    position: 'Albañil',
    registrationDate: '2024-02-15T08:45:00Z',
    status: 'No apto',
    documents: [
      {
        id: '8',
        workerId: '7',
        type: 'dni',
        name: 'DNI/NIE',
        fileName: 'dni_antonio_navarro.pdf',
        uploadDate: '2024-02-15T09:00:00Z',
        status: 'Rechazado',
        validatedBy: 'Ana Técnico',
        validatedAt: '2024-02-15T09:30:00Z',
      },
    ],
  },
];

export const useWorkers = (companyId: string | undefined) => {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [userRole] = useState<UserRole>('empresa'); // Simulamos rol de empresa

  // Filtrar trabajadores por empresa
  const companyWorkers = useMemo(() => {
    if (!companyId) return workers; // Si no hay companyId, devuelve todos
    return workers.filter((worker) => worker.companyId === companyId);
  }, [workers, companyId]);

  // Filtrar trabajadores
  const filteredWorkers = (search: string, status: WorkerStatus) => {
    let filtered = companyWorkers;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.firstName.toLowerCase().includes(searchLower) ||
          worker.lastName.toLowerCase().includes(searchLower) ||
          worker.dni.toLowerCase().includes(searchLower)
      );
    }

    if (status !== 'Todos') {
      filtered = filtered.filter((worker) => worker.status === status);
    }

    return filtered;
  };

  const createWorker = (data: WorkerFormData) => {
    if (!companyId) return;
    const newWorker: Worker = {
      id: Date.now().toString(),
      companyId,
      firstName: data.firstName,
      lastName: data.lastName,
      dni: data.dni,
      position: data.position,
      registrationDate: new Date().toISOString(),
      status: 'Pendiente',
      documents: REQUIRED_WORKER_DOCUMENTS.map((doc) => ({
        id: `${Date.now()}-${doc.type}`,
        workerId: Date.now().toString(),
        type: doc.type,
        name: doc.name,
        status: 'Pendiente' as const,
      })),
    };

    setWorkers((prev) => [...prev, newWorker]);
    console.log(`Trabajador ${data.firstName} ${data.lastName} creado`);
  };

  const updateWorker = (workerId: string, data: WorkerFormData) => {
    setWorkers((prev) =>
      prev.map((worker) => (worker.id === workerId ? { ...worker, ...data } : worker))
    );
  };

  const deleteWorker = (workerId: string) => {
    setWorkers((prev) => prev.filter((worker) => worker.id !== workerId));
    console.log(`Trabajador eliminado`);
  };

  const uploadWorkerDocument = (
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
                status: 'Pendiente' as const,
                validatorComment: undefined,
                validatedBy: undefined,
                validatedAt: undefined,
              }
            : doc
        );

        // Recalcular estado del trabajador
        const allValidated = updatedDocuments.every((doc) => doc.status === 'Validado');
        const anyRejected = updatedDocuments.some((doc) => doc.status === 'Rechazado');

        let newStatus: Worker['status'] = 'Pendiente';
        if (allValidated) newStatus = 'Apto';
        else if (anyRejected) newStatus = 'No apto';

        return {
          ...worker,
          documents: updatedDocuments,
          status: newStatus,
        };
      })
    );

    console.log(`Documento ${data.file.name} subido para validación`);
  };

  const validateWorkerDocument = (
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
                status: (isValid ? 'Validado' : 'Rechazado') as WorkerDocument['status'],
                validatorComment: comment,
                validatedBy: 'Ana Técnico', // En un caso real vendría del usuario logueado
                validatedAt: now,
              }
            : doc
        );

        // Recalcular estado del trabajador
        const allValidated = updatedDocuments.every((doc) => doc.status === 'Validado');
        const anyRejected = updatedDocuments.some((doc) => doc.status === 'Rechazado');

        let newStatus: Worker['status'] = 'Pendiente';
        if (allValidated) newStatus = 'Apto';
        else if (anyRejected) newStatus = 'No apto';

        return {
          ...worker,
          documents: updatedDocuments,
          status: newStatus,
        };
      })
    );

    const status = isValid ? 'validado' : 'rechazado';
    console.log(`Documento ${status}. Notificación enviada a la empresa.`);
  };

  return {
    workers: companyWorkers,
    userRole,
    filteredWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
    uploadWorkerDocument,
    validateWorkerDocument,
  };
};
