"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { companyImportRowSchema } from "@/app/utils/company-schema";
import { CompanyImportRow, ImportCompaniesResult } from "@/types/company";
import { Plus, Trash2 } from "lucide-react";

interface CompaniesBulkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: CompanyImportRow[]) => Promise<ImportCompaniesResult>;
}

interface DraftRow {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
}

const emptyRow = (): DraftRow => ({
  name: "",
  taxId: "",
  contactPerson: "",
  email: "",
  phone: "",
});

export const CompaniesBulkForm = ({
  isOpen,
  onClose,
  onSubmit,
}: CompaniesBulkFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [rows, setRows] = useState<DraftRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateRow = (index: number, field: keyof DraftRow, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const reset = () => {
    setRows([emptyRow()]);
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    const nextErrors: Record<number, Record<string, string>> = {};
    const valid: CompanyImportRow[] = [];
    const seenEmails = new Set<string>();

    rows.forEach((row, index) => {
      const result = companyImportRowSchema.safeParse(row);
      if (!result.success) {
        nextErrors[index] = {};
        result.error.issues.forEach((issue) => {
          const key = String(issue.path[0] ?? "");
          if (key) nextErrors[index][key] = issue.message;
        });
        return;
      }

      const normalizedEmail = result.data.email.toLowerCase();
      if (seenEmails.has(normalizedEmail)) {
        nextErrors[index] = { email: t("companies.bulk.duplicateEmail") };
        return;
      }
      seenEmails.add(normalizedEmail);

      valid.push({
        email: normalizedEmail,
        name: result.data.name,
        taxId: result.data.taxId,
        contactPerson: result.data.contactPerson,
        phone: result.data.phone,
      });
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      const result = await onSubmit(valid);
      toast({
        title: t("companies.bulk.created"),
        description: t("companies.bulk.createdDesc", {
          created: result.createdCount,
          linked: result.linkedCount,
          skipped: result.skippedCount,
        }),
      });
      reset();
      onClose();
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("companies.bulk.error"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t("companies.bulk.addMultiple")}</DialogTitle>
          <DialogDescription>
            {t("companies.bulk.addMultipleDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
            >
              <div className="sm:col-span-3">
                <Input
                  placeholder={t("companies.companyName")}
                  value={row.name}
                  onChange={(e) => updateRow(index, "name", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("companies.cif")}
                  value={row.taxId}
                  onChange={(e) => updateRow(index, "taxId", e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("companies.contact")}
                  value={row.contactPerson}
                  onChange={(e) =>
                    updateRow(index, "contactPerson", e.target.value)
                  }
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={row.email}
                  onChange={(e) => updateRow(index, "email", e.target.value)}
                  className={errors[index]?.email ? "border-destructive" : ""}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  placeholder={t("companies.form.phone")}
                  value={row.phone}
                  onChange={(e) => updateRow(index, "phone", e.target.value)}
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                  className="border-playBlueLight text-brand-secondary hover:bg-playGrey"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={addRow}
            className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
          >
            <Plus className="h-4 w-4" />
            {t("companies.bulk.addRow")}
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
            >
              {t("companies.bulk.saveAll")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
