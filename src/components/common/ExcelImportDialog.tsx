"use client";

import { ReactNode, useRef, useState } from "react";
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
import { mapRecord } from "@/app/utils/excel-import";
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";

interface ImportColumn<TRow> {
  header: string;
  cell: (row: TRow) => ReactNode;
}

export interface ImportSummaryItem {
  label: string;
  value: number;
  tone?: "success" | "muted" | "warning";
}

export interface ImportSummary {
  items: ImportSummaryItem[];
}

export interface ExcelImportLabels {
  selectFile: string;
  statusHeader: string;
  rowOk: string;
  cancel: string;
  validRows: (count: number) => string;
  invalidRows: (count: number) => string;
  importValid: (count: number) => string;
  importing: (count: number) => string;
  doneTitle: string;
  doneButton: string;
  parseErrorTitle: string;
  parseError: string;
  errorTitle: string;
  errorDescription: string;
}

interface ExcelImportDialogProps<TRow extends { error?: string }> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  headerMap: Record<string, keyof TRow>;
  emptyRow: TRow;
  validateRows: (rows: TRow[]) => TRow[];
  columns: ImportColumn<TRow>[];
  onImport: (validRows: TRow[]) => Promise<ImportSummary | void>;
  labels: ExcelImportLabels;
}

const TONE_CLASS: Record<NonNullable<ImportSummaryItem["tone"]>, string> = {
  success: "text-playGreen",
  muted: "text-brand-primary/60",
  warning: "text-brand-secondary",
};

export const ExcelImportDialog = <TRow extends { error?: string }>({
  isOpen,
  onClose,
  title,
  description,
  headerMap,
  emptyRow,
  validateRows,
  columns,
  onImport,
  labels,
}: ExcelImportDialogProps<TRow>) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<TRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

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
      const parsed = records.map((record) =>
        mapRecord(record, headerMap, emptyRow)
      );
      setRows(validateRows(parsed));
    } catch {
      toast({
        title: labels.parseErrorTitle,
        description: labels.parseError,
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleClose = () => {
    setRows([]);
    setFileName("");
    setSummary(null);
    onClose();
  };

  const validRows = rows.filter((row) => !row.error);
  const invalidCount = rows.length - validRows.length;

  const handleImport = async () => {
    if (!validRows.length) return;
    setIsSaving(true);
    try {
      const result = await onImport(validRows);
      setSummary(result ?? { items: [] });
    } catch {
      toast({
        title: labels.errorTitle,
        description: labels.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSaving) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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

        {isSaving ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-playOrange" />
            <p className="text-sm font-medium text-brand-primary">
              {labels.importing(validRows.length)}
            </p>
          </div>
        ) : summary ? (
          <div className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-playGreen/15">
              <CheckCircle2 className="h-9 w-9 text-playGreen" />
            </div>
            <h3 className="text-lg font-semibold text-playGreen">
              {labels.doneTitle}
            </h3>
            {summary.items.length > 0 && (
              <div className="flex w-full max-w-xs flex-col gap-2">
                {summary.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-6 border-b border-playGrey pb-2 text-sm last:border-0"
                  >
                    <span className="text-brand-primary/70">{item.label}</span>
                    <span
                      className={`font-semibold ${
                        TONE_CLASS[item.tone ?? "success"]
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              onClick={handleClose}
              className="mt-2 gap-2 bg-playGreen hover:bg-playGreen/90 text-white"
            >
              {labels.doneButton}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={isParsing}
            className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {labels.selectFile}
          </Button>
          {fileName && (
            <span className="text-sm text-brand-primary/70">{fileName}</span>
          )}
        </div>

        {rows.length > 0 && (
          <>
            <div className="flex gap-2 text-sm">
              <Badge className="bg-playGreen text-white">
                {labels.validRows(validRows.length)}
              </Badge>
              {invalidCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-playGrey text-brand-secondary"
                >
                  {labels.invalidRows(invalidCount)}
                </Badge>
              )}
            </div>

            <div className="max-h-[45vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    {columns.map((column) => (
                      <TableHead
                        key={column.header}
                        className="text-brand-primary"
                      >
                        {column.header}
                      </TableHead>
                    ))}
                    <TableHead className="text-brand-primary">
                      {labels.statusHeader}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      className={row.error ? "bg-brand-secondary/5" : ""}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.header}
                          className="text-brand-primary"
                        >
                          {column.cell(row)}
                        </TableCell>
                      ))}
                      <TableCell>
                        {row.error ? (
                          <span className="text-sm text-brand-secondary">
                            {row.error}
                          </span>
                        ) : (
                          <Badge className="bg-playGreen text-white">
                            {labels.rowOk}
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
                {labels.cancel}
              </Button>
              <Button
                type="button"
                onClick={handleImport}
                disabled={!validRows.length}
                className="gap-2 bg-playOrange hover:bg-playOrange/90 text-white disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                {labels.importValid(validRows.length)}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
