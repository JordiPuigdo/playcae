"use client";

import { useMemo } from "react";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { internalWorkerRowSchema } from "@/app/utils/worker-schema";
import { createRowValidator } from "@/app/utils/excel-import";
import { ExcelImportDialog } from "@/components/common/ExcelImportDialog";
import { WorkerFormData } from "@/types/worker";

interface InternalWorkersImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: WorkerFormData[]) => Promise<void>;
}

interface WorkerImportRow {
  firstName: string;
  lastName: string;
  cardId: string;
  ssn: string;
  position: string;
  email: string;
  error?: string;
}

const HEADER_MAP: Record<string, keyof WorkerImportRow> = {
  nombre: "firstName",
  apellidos: "lastName",
  apellido: "lastName",
  "dni/nie": "cardId",
  dni: "cardId",
  nie: "cardId",
  ssn: "ssn",
  puesto: "position",
  actividad: "position",
  email: "email",
  correo: "email",
};

const EMPTY_ROW: WorkerImportRow = {
  firstName: "",
  lastName: "",
  cardId: "",
  ssn: "",
  position: "",
  email: "",
};

export const InternalWorkersImport = ({
  isOpen,
  onClose,
  onSubmit,
}: InternalWorkersImportProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const validateRows = useMemo(
    () =>
      createRowValidator<WorkerImportRow>({
        schema: internalWorkerRowSchema,
        normalize: (row) => ({ ...row, cardId: row.cardId.toUpperCase() }),
        dedupe: {
          key: (row) => row.cardId,
          message: t("internalWorkers.duplicateCardId"),
        },
      }),
    [t]
  );

  const handleImport = async (validRows: WorkerImportRow[]) => {
    await onSubmit(
      validRows.map((row) => ({
        firstName: row.firstName,
        lastName: row.lastName,
        cardId: row.cardId,
        ssn: row.ssn,
        position: row.position,
        email: row.email,
        companyId: "",
      }))
    );
    toast({
      title: t("internalWorkers.bulkCreated"),
      description: t("internalWorkers.bulkCreatedDesc", {
        count: validRows.length,
      }),
    });
  };

  return (
    <ExcelImportDialog<WorkerImportRow>
      isOpen={isOpen}
      onClose={onClose}
      title={t("internalWorkers.importExcel")}
      description={t("internalWorkers.importDesc")}
      headerMap={HEADER_MAP}
      emptyRow={EMPTY_ROW}
      validateRows={validateRows}
      columns={[
        {
          header: t("workers.title"),
          cell: (row) => `${row.firstName} ${row.lastName}`,
        },
        {
          header: t("workers.dni"),
          cell: (row) => (
            <span className="font-mono text-sm">{row.cardId}</span>
          ),
        },
        { header: "SSN", cell: (row) => row.ssn || "-" },
        { header: t("workers.position"), cell: (row) => row.position || "-" },
        { header: "Email", cell: (row) => row.email || "-" },
      ]}
      onImport={handleImport}
      labels={{
        selectFile: t("internalWorkers.selectFile"),
        statusHeader: t("common.status"),
        rowOk: t("internalWorkers.rowOk"),
        cancel: t("common.cancel"),
        validRows: (count) => t("internalWorkers.validRows", { count }),
        invalidRows: (count) => t("internalWorkers.invalidRows", { count }),
        importValid: (count) => t("internalWorkers.importValid", { count }),
        parseErrorTitle: t("errors.generic"),
        parseError: t("internalWorkers.importParseError"),
        errorTitle: t("errors.generic"),
        errorDescription: t("internalWorkers.bulkError"),
      }}
    />
  );
};
