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
import { internalWorkerRowSchema } from "@/app/utils/worker-schema";
import { WorkerFormData } from "@/types/worker";
import { Plus, Trash2 } from "lucide-react";

interface InternalWorkersBulkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: WorkerFormData[]) => Promise<void>;
}

interface DraftRow {
  firstName: string;
  lastName: string;
  cardId: string;
  position: string;
  email: string;
}

const emptyRow = (): DraftRow => ({
  firstName: "",
  lastName: "",
  cardId: "",
  position: "",
  email: "",
});

export const InternalWorkersBulkForm = ({
  isOpen,
  onClose,
  onSubmit,
}: InternalWorkersBulkFormProps) => {
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
    const valid: WorkerFormData[] = [];
    const seenCardIds = new Set<string>();

    rows.forEach((row, index) => {
      const result = internalWorkerRowSchema.safeParse(row);
      if (!result.success) {
        nextErrors[index] = {};
        result.error.issues.forEach((issue) => {
          const key = String(issue.path[0] ?? "");
          if (key) nextErrors[index][key] = issue.message;
        });
        return;
      }

      const normalizedCardId = result.data.cardId.toUpperCase();
      if (seenCardIds.has(normalizedCardId)) {
        nextErrors[index] = { cardId: t("internalWorkers.duplicateCardId") };
        return;
      }
      seenCardIds.add(normalizedCardId);

      valid.push({
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        cardId: normalizedCardId,
        ssn: "",
        position: result.data.position ?? "",
        email: result.data.email ?? "",
        companyId: "",
      });
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      await onSubmit(valid);
      toast({
        title: t("internalWorkers.bulkCreated"),
        description: t("internalWorkers.bulkCreatedDesc", { count: valid.length }),
      });
      reset();
      onClose();
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
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{t("internalWorkers.addMultiple")}</DialogTitle>
          <DialogDescription>
            {t("internalWorkers.addMultipleDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start"
            >
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("workers.firstName")}
                  value={row.firstName}
                  onChange={(e) => updateRow(index, "firstName", e.target.value)}
                  className={errors[index]?.firstName ? "border-destructive" : ""}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("workers.lastName")}
                  value={row.lastName}
                  onChange={(e) => updateRow(index, "lastName", e.target.value)}
                  className={errors[index]?.lastName ? "border-destructive" : ""}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("workers.dni")}
                  value={row.cardId}
                  onChange={(e) =>
                    updateRow(index, "cardId", e.target.value.toUpperCase())
                  }
                  className={errors[index]?.cardId ? "border-destructive" : ""}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  placeholder={t("workers.position")}
                  value={row.position}
                  onChange={(e) => updateRow(index, "position", e.target.value)}
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
            {t("internalWorkers.addRow")}
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
              {t("internalWorkers.saveAll")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
