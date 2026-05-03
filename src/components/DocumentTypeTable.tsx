"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Edit, Search, Trash2, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { DocumentType, CreateDocumentTypeRequest, UpdateDocumentTypeRequest } from "@/types/documentType";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Switch } from "./ui/Switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";

interface Props {
  documentTypes: DocumentType[];
  onCreate: (data: CreateDocumentTypeRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateDocumentTypeRequest) => Promise<void>;
  onDeactivate: (id: string) => Promise<void>;
}

interface FormState {
  code: string;
  name: string;
  legalPeriod: string;
  isRequired: boolean;
  excludeIfInternalPrevention: boolean;
  prompt: string;
  extractDueDatePrompt: string;
}

const blankForm = (): FormState => ({
  code: "",
  name: "",
  legalPeriod: "",
  isRequired: false,
  excludeIfInternalPrevention: false,
  prompt: "",
  extractDueDatePrompt: "",
});

export interface DocumentTypeTableRef {
  openCreate: () => void;
}

export const DocumentTypeTable = forwardRef<DocumentTypeTableRef, Props>(
  ({ documentTypes, onCreate, onUpdate, onDeactivate }, ref) => {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<DocumentType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DocumentType | null>(null);
    const [form, setForm] = useState<FormState>(blankForm());
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");
    const [requiredFilter, setRequiredFilter] = useState<"all" | "yes" | "no">("all");
    const [excludeFilter, setExcludeFilter] = useState<"all" | "yes" | "no">("all");

    const hasActiveFilters = search !== "" || requiredFilter !== "all" || excludeFilter !== "all";

    const filteredDocumentTypes = useMemo(() => {
      return documentTypes.filter((dt) => {
        const term = search.toLowerCase();
        const matchesSearch =
          !term ||
          dt.code.toLowerCase().includes(term) ||
          dt.name.toLowerCase().includes(term);
        const matchesRequired =
          requiredFilter === "all" ||
          (requiredFilter === "yes" ? dt.isRequired : !dt.isRequired);
        const matchesExclude =
          excludeFilter === "all" ||
          (excludeFilter === "yes" ? dt.excludeIfInternalPrevention : !dt.excludeIfInternalPrevention);
        return matchesSearch && matchesRequired && matchesExclude;
      });
    }, [documentTypes, search, requiredFilter, excludeFilter]);

    const clearFilters = () => {
      setSearch("");
      setRequiredFilter("all");
      setExcludeFilter("all");
    };

    useImperativeHandle(ref, () => ({
      openCreate: () => {
        setEditTarget(null);
        setForm(blankForm());
        setDialogOpen(true);
      },
    }));

    const openEdit = (dt: DocumentType) => {
      setEditTarget(dt);
      setForm({
        code: dt.code,
        name: dt.name,
        legalPeriod: dt.legalPeriod != null ? String(dt.legalPeriod) : "",
        isRequired: dt.isRequired,
        excludeIfInternalPrevention: dt.excludeIfInternalPrevention,
        prompt: dt.prompt ?? "",
        extractDueDatePrompt: dt.extractDueDatePrompt ?? "",
      });
      setDialogOpen(true);
    };

    const handleSave = async () => {
      if (!form.code.trim() || !form.name.trim()) return;
      setSaving(true);
      try {
        const payload: CreateDocumentTypeRequest = {
          code: form.code.trim(),
          name: form.name.trim(),
          legalPeriod: form.legalPeriod ? Number(form.legalPeriod) : null,
          isRequired: form.isRequired,
          excludeIfInternalPrevention: form.excludeIfInternalPrevention,
          prompt: form.prompt.trim() || "",
          extractDueDatePrompt: form.extractDueDatePrompt.trim() || "",
        };
        if (editTarget?.id) {
          await onUpdate(editTarget.id, payload);
        } else {
          await onCreate(payload);
        }
        setDialogOpen(false);
      } finally {
        setSaving(false);
      }
    };

    return (
      <>
        <Card className="bg-white border border-playBlueLight/30">
          <CardHeader>
            <CardTitle className="text-brand-primary">
              {t("documentTypes.registered", { count: documentTypes.length })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("documentTypes.filters.searchPlaceholder")}
                  className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
                />
              </div>

              <div className="min-w-[160px]">
                <Select value={requiredFilter} onValueChange={(v) => setRequiredFilter(v as typeof requiredFilter)}>
                  <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                    <SelectValue placeholder={t("documentTypes.filters.isRequired")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30">
                    <SelectItem value="all" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.isRequired")}: {t("documentTypes.filters.allRequired")}
                    </SelectItem>
                    <SelectItem value="yes" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.isRequired")}: {t("common.yes")}
                    </SelectItem>
                    <SelectItem value="no" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.isRequired")}: {t("common.no")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="min-w-[180px]">
                <Select value={excludeFilter} onValueChange={(v) => setExcludeFilter(v as typeof excludeFilter)}>
                  <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                    <SelectValue placeholder={t("documentTypes.filters.excludeIfInternal")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30">
                    <SelectItem value="all" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.excludeIfInternal")}: {t("documentTypes.filters.allExclude")}
                    </SelectItem>
                    <SelectItem value="yes" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.excludeIfInternal")}: {t("common.yes")}
                    </SelectItem>
                    <SelectItem value="no" className="hover:bg-playGrey hover:text-brand-primary">
                      {t("documentTypes.filters.excludeIfInternal")}: {t("common.no")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={`gap-2 border-playBlueLight transition-all ${
                  hasActiveFilters
                    ? "text-brand-primary hover:bg-playGrey"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <X className="h-4 w-4" />
                {t("documentTypes.filters.clearFilters")}
              </Button>
            </div>

            {documentTypes.length === 0 ? (
              <p className="text-center py-8 text-playBlueLight">{t("documentTypes.empty")}</p>
            ) : filteredDocumentTypes.length === 0 ? (
              <p className="text-center py-8 text-playBlueLight">{t("documentTypes.filters.noResults")}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-playGrey">
                      <TableHead className="text-brand-primary">{t("documentTypes.table.code")}</TableHead>
                      <TableHead className="text-brand-primary">{t("documentTypes.table.name")}</TableHead>
                      <TableHead className="text-brand-primary">{t("documentTypes.table.legalPeriod")}</TableHead>
                      <TableHead className="text-brand-primary">{t("documentTypes.table.isRequired")}</TableHead>
                      <TableHead className="text-brand-primary">{t("documentTypes.table.excludeIfInternal")}</TableHead>
                      <TableHead className="text-brand-primary w-24">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocumentTypes.map((dt) => (
                      <TableRow key={dt.id} className="hover:bg-playGrey/30">
                        <TableCell className="font-mono text-sm text-brand-primary">{dt.code}</TableCell>
                        <TableCell className="text-brand-primary font-medium">{dt.name}</TableCell>
                        <TableCell className="text-brand-primary">
                          {dt.legalPeriod != null ? `${dt.legalPeriod}d` : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={dt.isRequired ? "default" : "secondary"}>
                            {dt.isRequired ? t("common.yes") : t("common.no")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dt.excludeIfInternalPrevention ? "secondary" : "outline"}>
                            {dt.excludeIfInternalPrevention ? t("common.yes") : t("common.no")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(dt)}
                              title={t("common.edit")}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(dt)}
                              title={t("common.deactivate")}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-brand-primary">
                {editTarget ? t("documentTypes.editTitle") : t("documentTypes.addTitle")}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {editTarget && (
                <div className="flex items-center justify-between rounded-lg border border-playBlueLight/30 bg-playGrey/30 px-3 py-2">
                  <span className="text-sm text-brand-primary">{t("documentTypes.form.status")}</span>
                  <Badge variant={editTarget.active !== false ? "default" : "secondary"}>
                    {editTarget.active !== false
                      ? t("documentTypes.form.statusActive")
                      : t("documentTypes.form.statusInactive")}
                  </Badge>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-brand-primary">{t("documentTypes.form.code")} *</Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                    placeholder="DOC_001"
                    className="border-playBlueLight focus-visible:ring-brand-primary font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-brand-primary">{t("documentTypes.form.legalPeriod")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.legalPeriod}
                    onChange={(e) => setForm((f) => ({ ...f, legalPeriod: e.target.value }))}
                    placeholder="365"
                    className="border-playBlueLight focus-visible:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-brand-primary">{t("documentTypes.form.name")} *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="border-playBlueLight focus-visible:ring-brand-primary"
                  uppercase={false}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-playBlueLight/30 p-3">
                <Label className="text-brand-primary cursor-pointer">
                  {t("documentTypes.form.isRequired")}
                </Label>
                <Switch
                  checked={form.isRequired}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isRequired: v }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-playBlueLight/30 p-3">
                <Label className="text-brand-primary cursor-pointer text-sm">
                  {t("documentTypes.form.excludeIfInternalPrevention")}
                </Label>
                <Switch
                  checked={form.excludeIfInternalPrevention}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, excludeIfInternalPrevention: v }))}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-brand-primary">{t("documentTypes.form.prompt")}</Label>
                <textarea
                  value={form.prompt}
                  onChange={(e) => setForm((f) => ({ ...f, prompt: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-playBlueLight px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary resize-none"
                  placeholder={t("documentTypes.form.promptPlaceholder")}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-brand-primary">{t("documentTypes.form.extractDueDatePrompt")}</Label>
                <textarea
                  value={form.extractDueDatePrompt}
                  onChange={(e) => setForm((f) => ({ ...f, extractDueDatePrompt: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-playBlueLight px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary resize-none"
                  placeholder={t("documentTypes.form.extractDueDatePromptPlaceholder")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                {t("common.cancel")}
              </Button>
              <Button
                variant="submit"
                onClick={handleSave}
                disabled={saving || !form.code.trim() || !form.name.trim()}
                className="bg-playOrange hover:bg-playOrange/90 text-white"
              >
                {saving ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {deleteTarget && (
          <DeleteConfirmationModal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={async () => {
              await onDeactivate(deleteTarget.id!);
              setDeleteTarget(null);
            }}
            title={t("documentTypes.deactivateTitle")}
            description={t("documentTypes.confirmDeactivate", { name: deleteTarget.name })}
          />
        )}
      </>
    );
  }
);

DocumentTypeTable.displayName = "DocumentTypeTable";
