"use client";

import { useMemo } from "react";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { companyImportRowSchema } from "@/app/utils/company-schema";
import { createRowValidator } from "@/app/utils/excel-import";
import { ExcelImportDialog } from "@/components/common/ExcelImportDialog";
import {
  CompanyImportRow,
  ImportCompaniesResult,
} from "@/types/company";

interface CompaniesImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: CompanyImportRow[]) => Promise<ImportCompaniesResult>;
}

interface CompanyRow {
  email: string;
  name: string;
  taxId: string;
  contactPerson: string;
  phone: string;
  error?: string;
}

const HEADER_MAP: Record<string, keyof CompanyRow> = {
  empresa: "name",
  nombre: "name",
  "razon social": "name",
  "nombre empresa": "name",
  cif: "taxId",
  nif: "taxId",
  "cif/nif": "taxId",
  contacto: "contactPerson",
  persona: "contactPerson",
  "persona de contacto": "contactPerson",
  email: "email",
  correo: "email",
  telefono: "phone",
  tel: "phone",
};

const EMPTY_ROW: CompanyRow = {
  email: "",
  name: "",
  taxId: "",
  contactPerson: "",
  phone: "",
};

export const CompaniesImport = ({
  isOpen,
  onClose,
  onImport,
}: CompaniesImportProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const validateRows = useMemo(
    () =>
      createRowValidator<CompanyRow>({
        schema: companyImportRowSchema,
      }),
    []
  );

  const handleImport = async (validRows: CompanyRow[]) => {
    const result = await onImport(
      validRows.map((row) => ({
        email: row.email,
        name: row.name,
        taxId: row.taxId,
        contactPerson: row.contactPerson,
        phone: row.phone,
      }))
    );
    toast({
      title: t("companies.import.done"),
      description: t("companies.import.summary", {
        created: result.createdCount,
        linked: result.linkedCount,
        skipped: result.skippedCount,
        errors: result.errorCount,
      }),
    });
  };

  return (
    <ExcelImportDialog<CompanyRow>
      isOpen={isOpen}
      onClose={onClose}
      title={t("companies.import.title")}
      description={t("companies.import.description")}
      headerMap={HEADER_MAP}
      emptyRow={EMPTY_ROW}
      validateRows={validateRows}
      columns={[
        { header: t("companies.companyName"), cell: (row) => row.name || "-" },
        {
          header: t("companies.cif"),
          cell: (row) => (
            <span className="font-mono text-sm">{row.taxId || "-"}</span>
          ),
        },
        {
          header: t("companies.contact"),
          cell: (row) => row.contactPerson || "-",
        },
        { header: "Email", cell: (row) => row.email || "-" },
        { header: t("companies.form.phone"), cell: (row) => row.phone || "-" },
      ]}
      onImport={handleImport}
      labels={{
        selectFile: t("companies.import.selectFile"),
        statusHeader: t("common.status"),
        rowOk: t("companies.import.rowOk"),
        cancel: t("common.cancel"),
        validRows: (count) => t("companies.import.validRows", { count }),
        invalidRows: (count) => t("companies.import.invalidRows", { count }),
        importValid: (count) => t("companies.import.importValid", { count }),
        parseErrorTitle: t("errors.generic"),
        parseError: t("companies.import.parseError"),
        errorTitle: t("errors.generic"),
        errorDescription: t("companies.import.error"),
      }}
    />
  );
};
