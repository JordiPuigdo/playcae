"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { internalWorkerRowSchema } from "@/app/utils/worker-schema";
import { WorkerFormData } from "@/types/worker";
import { FileSpreadsheet, Upload } from "lucide-react";

interface InternalWorkersImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: WorkerFormData[]) => Promise<void>;
}

interface ParsedRow {
  firstName: string;
  lastName: string;
  cardId: string;
  ssn: string;
  position: string;
  email: string;
  error?: string;
}

const normalizeHeader = (header: string): string =>
  header
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const HEADER_MAP: Record<string, keyof Omit<ParsedRow, "error">> = {
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

const mapRecord = (record: Record<string, unknown>): ParsedRow => {
  const row: ParsedRow = {
    firstName: "",
    lastName: "",
    cardId: "",
    ssn: "",
    position: "",
    email: "",
  };
  Object.entries(record).forEach(([key, value]) => {
    const field = HEADER_MAP[normalizeHeader(key)];
    if (field) row[field] = value == null ? "" : String(value).trim();
  });
  return row;
};

export const InternalWorkersImport = ({
  isOpen,
  onClose,
  onSubmit,
}: InternalWorkersImportProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const validateRows = (parsed: ParsedRow[]): ParsedRow[] => {
    const seen = new Set<string>();
    return parsed.map((row) => {
      const result = internalWorkerRowSchema.safeParse(row);
      if (!result.success) {
        return { ...row, error: result.error.issues[0]?.message };
      }
      const cardId = result.data.cardId.toUpperCase();
      if (seen.has(cardId)) {
        return { ...row, cardId, error: t("internalWorkers.duplicateCardId") };
      }
      seen.add(cardId);
      return { ...row, cardId, error: undefined };
    });
  };

  const handleFile = async (file: File) => {
    setIsParsing(true);
    setFileName(file.name);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      });
      const parsed = records.map(mapRecord);
      setRows(validateRows(parsed));
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("internalWorkers.importParseError"),
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleClose = () => {
    setRows([]);
    setFileName("");
    onClose();
  };

  const validRows = rows.filter((row) => !row.error);
  const invalidCount = rows.length - validRows.length;

  const handleImport = async () => {
    if (!validRows.length) return;
    setIsSaving(true);
    try {
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
      handleClose();
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("internalWorkers.bulkError"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("internalWorkers.importExcel")}</DialogTitle>
          <DialogDescription>
            {t("internalWorkers.importDesc")}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isParsing}
            className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {t("internalWorkers.selectFile")}
          </Button>
          {fileName && (
            <span className="text-sm text-brand-primary/70">{fileName}</span>
          )}
        </div>

        {rows.length > 0 && (
          <>
            <div className="flex gap-2 text-sm">
              <Badge className="bg-playGreen text-white">
                {t("internalWorkers.validRows", { count: validRows.length })}
              </Badge>
              {invalidCount > 0 && (
                <Badge variant="secondary" className="bg-playGrey text-brand-secondary">
                  {t("internalWorkers.invalidRows", { count: invalidCount })}
                </Badge>
              )}
            </div>

            <div className="max-h-[45vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    <TableHead className="text-brand-primary">{t("workers.title")}</TableHead>
                    <TableHead className="text-brand-primary">{t("workers.dni")}</TableHead>
                    <TableHead className="text-brand-primary">SSN</TableHead>
                    <TableHead className="text-brand-primary">{t("workers.position")}</TableHead>
                    <TableHead className="text-brand-primary">Email</TableHead>
                    <TableHead className="text-brand-primary">{t("common.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      className={row.error ? "bg-brand-secondary/5" : ""}
                    >
                      <TableCell className="text-brand-primary">
                        {row.firstName} {row.lastName}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-brand-primary">
                        {row.cardId}
                      </TableCell>
                      <TableCell className="text-brand-primary">{row.ssn || "-"}</TableCell>
                      <TableCell className="text-brand-primary">{row.position || "-"}</TableCell>
                      <TableCell className="text-brand-primary">{row.email || "-"}</TableCell>
                      <TableCell>
                        {row.error ? (
                          <span className="text-sm text-brand-secondary">{row.error}</span>
                        ) : (
                          <Badge className="bg-playGreen text-white">
                            {t("internalWorkers.rowOk")}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={isSaving || !validRows.length}
            className="gap-2 bg-playOrange hover:bg-playOrange/90 text-white disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {t("internalWorkers.importValid", { count: validRows.length })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
