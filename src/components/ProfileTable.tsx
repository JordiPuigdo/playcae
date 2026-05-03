"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { ChevronDown, ChevronUp, Edit, Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "@/app/utils/utis";
import { getDocumentTypeNameById } from "@/app/utils/document-type-utils";
import { useTranslation } from "@/hooks/useTranslation";
import { DocumentType } from "@/types/documentType";
import { CreateProfileRequest, Profile, ProfileScopeType, ProfileTargetType, UpdateProfileRequest } from "@/types/profile";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { TableCard } from "./TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";

interface Props {
  profiles: Profile[];
  documentTypes: DocumentType[];
  onCreate: (data: CreateProfileRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateProfileRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddDocumentType: (profileId: string, documentTypeId: string) => Promise<void>;
  onRemoveDocumentType: (profileId: string, documentTypeId: string) => Promise<void>;
  onBatchDocumentTypes: (profileId: string, toAdd: string[], toRemove: string[]) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  sortOrder: number;
  scopeType: number;
  targetType: number;
  isDefaultOnCompanyCreation: boolean;
  isDefaultOnWorkerCreation: boolean;
  selectedDocTypeIds: string[];
}

const blankForm = (sortOrder = 0): FormState => ({
  name: "",
  description: "",
  sortOrder,
  scopeType: ProfileScopeType.Global,
  targetType: ProfileTargetType.Worker,
  isDefaultOnCompanyCreation: false,
  isDefaultOnWorkerCreation: false,
  selectedDocTypeIds: [],
});

const normalizeDocumentTypeIds = (requirements: Profile["documentRequirements"]): string[] =>
  Array.from(
    new Set(
      requirements
        .filter((requirement) => requirement.active !== false)
        .map((requirement) => requirement.documentTypeId.toUpperCase())
    )
  );

export interface ProfileTableRef {
  openCreate: () => void;
}

export const ProfileTable = forwardRef<ProfileTableRef, Props>(({
  profiles,
  documentTypes,
  onCreate,
  onUpdate,
  onDelete,
  onAddDocumentType,
  onRemoveDocumentType,
  onBatchDocumentTypes,
}, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [toDelete, setToDelete] = useState<Profile | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const sorted = [...profiles].sort((a, b) => a.sortOrder - b.sortOrder);

  const openCreate = () => {
    setEditing(null);
    setForm(blankForm(profiles.length));
    setDocSearch("");
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({ openCreate }));

  const openEdit = (p: Profile) => {
    setEditing(p);
    setDocSearch("");
    setForm({
      name: p.name,
      description: p.description ?? "",
      sortOrder: p.sortOrder,
      scopeType: p.scopeType,
      targetType: p.targetType,
      isDefaultOnCompanyCreation: p.isDefaultOnCompanyCreation,
      isDefaultOnWorkerCreation: p.isDefaultOnWorkerCreation,
      selectedDocTypeIds: normalizeDocumentTypeIds(p.documentRequirements),
    });
    setOpen(true);
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleDocType = (id: string) =>
    setForm((prev) => ({
      ...prev,
      selectedDocTypeIds: prev.selectedDocTypeIds.includes(id)
        ? prev.selectedDocTypeIds.filter((d) => d !== id)
        : [...prev.selectedDocTypeIds, id],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await onUpdate(editing.id!, {
          name: form.name,
          description: form.description || null,
          sortOrder: form.sortOrder,
          scopeType: form.scopeType,
          targetType: form.targetType,
          isDefaultOnCompanyCreation: form.isDefaultOnCompanyCreation,
          isDefaultOnWorkerCreation: form.isDefaultOnWorkerCreation,
        });
        const originalIds = normalizeDocumentTypeIds(editing.documentRequirements);
        const toAdd = form.selectedDocTypeIds.filter((id) => !originalIds.includes(id));
        const toRemove = originalIds.filter((id) => !form.selectedDocTypeIds.includes(id));
        if (toAdd.length > 0 || toRemove.length > 0) {
          await onBatchDocumentTypes(editing.id!, toAdd, toRemove);
        }
      } else {
        await onCreate({
          name: form.name,
          description: form.description || null,
          scopeType: form.scopeType,
          targetType: form.targetType,
          isDefaultOnCompanyCreation: form.isDefaultOnCompanyCreation,
          isDefaultOnWorkerCreation: form.isDefaultOnWorkerCreation,
          sortOrder: form.sortOrder,
          documentRequirements: form.selectedDocTypeIds.map((id) => ({
            documentTypeId: id,
          })),
        });
      }
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TableCard title={t("profiles.registered", { count: profiles.length })}>
        {profiles.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{t("profiles.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>{t("profiles.table.name")}</TableHead>
                <TableHead>{t("profiles.table.description")}</TableHead>
                <TableHead className="text-center">{t("profiles.table.scope")}</TableHead>
                <TableHead className="text-center">{t("profiles.table.target")}</TableHead>
                <TableHead className="text-center">{t("profiles.table.docCount")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <>
                  <TableRow key={p.id}>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(p.id!)}
                        className="h-7 w-7 p-0 border-playBlueLight"
                      >
                        {expanded[p.id!] ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium text-brand-primary">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.scopeType === ProfileScopeType.Global ? (
                        <Badge className="bg-playGreen text-white">{t("profiles.scope.global")}</Badge>
                      ) : (
                        <Badge variant="secondary">{t("profiles.scope.tenant")}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {p.targetType === ProfileTargetType.Company ? (
                        <Badge className="bg-playBlueLight text-white">{t("profiles.target.company")}</Badge>
                      ) : (
                        <Badge variant="secondary">{t("profiles.target.worker")}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {p.documentRequirements.length}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setToDelete(p)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expanded[p.id!] && (
                    <TableRow key={`${p.id}-docs`}>
                      <TableCell colSpan={7} className="bg-playGrey/30 px-6 py-4">
                        <DocTypeManager
                          profile={p}
                          documentTypes={documentTypes}
                          onAdd={onAddDocumentType}
                          onRemove={onRemoveDocumentType}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px] bg-white border border-brand-accent/30 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">
              {editing ? t("profiles.editTitle") : t("profiles.addTitle")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">{t("profiles.form.name")} *</Label>
              <Input
                uppercase={false}
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-brand-accent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">{t("profiles.form.description")}</Label>
              <Input
                uppercase={false}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border-brand-accent"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("profiles.form.sortOrder")}</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("profiles.form.scopeType")}</Label>
                <Select
                  value={String(form.scopeType)}
                  onValueChange={(v) => setForm({ ...form, scopeType: Number(v) })}
                >
                  <SelectTrigger className="border-brand-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(ProfileScopeType.Global)}>{t("profiles.scope.global")}</SelectItem>
                    <SelectItem value={String(ProfileScopeType.Tenant)}>{t("profiles.scope.tenant")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("profiles.form.targetType")}</Label>
                <Select
                  value={String(form.targetType)}
                  onValueChange={(v) => setForm({ ...form, targetType: Number(v) })}
                >
                  <SelectTrigger className="border-brand-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(ProfileTargetType.Company)}>{t("profiles.target.company")}</SelectItem>
                    <SelectItem value={String(ProfileTargetType.Worker)}>{t("profiles.target.worker")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {form.targetType === ProfileTargetType.Company ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefaultOnCompanyCreation}
                    onChange={(e) => setForm({ ...form, isDefaultOnCompanyCreation: e.target.checked })}
                    className="accent-brand-primary"
                  />
                  <span className="text-sm text-brand-primary">{t("profiles.form.isDefaultOnCompanyCreation")}</span>
                </label>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isDefaultOnWorkerCreation}
                    onChange={(e) => setForm({ ...form, isDefaultOnWorkerCreation: e.target.checked })}
                    className="accent-brand-primary"
                  />
                  <span className="text-sm text-brand-primary">{t("profiles.form.isDefaultOnWorkerCreation")}</span>
                </label>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-brand-primary">{t("profiles.form.documentTypes")}</Label>
                {form.selectedDocTypeIds.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {t("profiles.form.selectedCount", { count: form.selectedDocTypeIds.length })}
                  </span>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  uppercase={false}
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder={t("profiles.form.docSearchPlaceholder")}
                  className="border-brand-accent/50 pl-8 h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 gap-0.5 max-h-52 overflow-y-auto border border-brand-accent/30 rounded-md p-2">
                {(() => {
                  const searchTerm = docSearch.toLowerCase().trim();
                  const filtered = documentTypes.filter((dt) => {
                    if (!searchTerm) return true;
                    const name = getDocumentTypeNameById(dt.id!.toUpperCase(), t, dt.name);
                    return name.toLowerCase().includes(searchTerm);
                  });
                  if (filtered.length === 0) {
                    return (
                      <p className="text-sm text-muted-foreground text-center py-3">
                        {t("profiles.form.docNoResults")}
                      </p>
                    );
                  }
                  const selected = filtered.filter((dt) => form.selectedDocTypeIds.includes(dt.id!.toUpperCase()));
                  const unselected = filtered.filter((dt) => !form.selectedDocTypeIds.includes(dt.id!.toUpperCase()));
                  const renderItem = (dt: DocumentType) => {
                    const id = dt.id!.toUpperCase();
                    const name = getDocumentTypeNameById(id, t, dt.name);
                    const checked = form.selectedDocTypeIds.includes(id);
                    const isOriginallyAssigned =
                      editing != null &&
                      editing.documentRequirements.some((r) => r.documentTypeId.toUpperCase() === id);
                    return (
                      <label
                        key={id}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer py-1 px-2 rounded text-sm transition-colors",
                          isOriginallyAssigned
                            ? "hover:bg-playGreen/20"
                            : "hover:bg-playGrey/40"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDocType(id)}
                          className="accent-brand-primary shrink-0"
                        />
                        <span
                          className={cn(
                            isOriginallyAssigned
                              ? checked
                                ? "text-playGreen font-medium"
                                : "text-playGreen/70 line-through"
                              : checked
                              ? "text-brand-primary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {name}
                        </span>
                        {isOriginallyAssigned && (
                          <span className="ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-playGreen/15 text-playGreen border border-playGreen/30 font-medium">
                            {t("profiles.form.assigned")}
                          </span>
                        )}
                      </label>
                    );
                  };
                  return (
                    <>
                      {selected.map(renderItem)}
                      {selected.length > 0 && unselected.length > 0 && (
                        <div className="my-1 border-t border-brand-accent/20" />
                      )}
                      {unselected.map(renderItem)}
                    </>
                  );
                })()}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="border-brand-accent text-brand-primary"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={busy}
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-white"
              >
                {busy ? t("common.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) {
            await onDelete(toDelete.id!);
            setToDelete(null);
          }
        }}
        title={t("profiles.deleteTitle")}
        description={t("profiles.confirmDelete")}
        itemName={toDelete?.name}
      />
    </>
  );
});

ProfileTable.displayName = "ProfileTable";

interface DocTypeManagerProps {
  profile: Profile;
  documentTypes: DocumentType[];
  onAdd: (profileId: string, documentTypeId: string) => Promise<void>;
  onRemove: (profileId: string, documentTypeId: string) => Promise<void>;
}

const DocTypeManager = ({ profile, documentTypes, onAdd, onRemove }: DocTypeManagerProps) => {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const assignedIds = profile.documentRequirements.map((r) => r.documentTypeId.toUpperCase());
  const availableToAdd = documentTypes.filter((dt) => !assignedIds.includes(dt.id!.toUpperCase()));

  const handleAdd = async (docTypeId: string) => {
    setBusy(docTypeId);
    try {
      await onAdd(profile.id!, docTypeId);
    } finally {
      setBusy(null);
      setAddOpen(false);
    }
  };

  const handleRemove = async (docTypeId: string) => {
    setBusy(docTypeId);
    try {
      await onRemove(profile.id!, docTypeId);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-brand-accent uppercase tracking-wide">
        {t("profiles.docTypes.label")}
      </p>
      <div className="flex flex-wrap gap-2">
        {profile.documentRequirements.length === 0 && (
          <span className="text-sm text-muted-foreground">{t("profiles.docTypes.empty")}</span>
        )}
        {profile.documentRequirements.map((req) => (
          <Badge
            key={req.id}
            variant="secondary"
            className="flex items-center gap-1 pr-1 bg-white border border-playBlueLight/40"
          >
            <span className="text-xs">{getDocumentTypeNameById(req.documentTypeId, t, req.documentTypeName ?? undefined)}</span>
            <button
              type="button"
              disabled={busy === req.documentTypeId}
              onClick={() => handleRemove(req.documentTypeId)}
              className="ml-1 text-muted-foreground hover:text-destructive disabled:opacity-50"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {availableToAdd.length > 0 && (
        <>
          {addOpen ? (
            <div className="flex flex-wrap gap-1">
              {availableToAdd.map((dt) => {
                const dtId = dt.id!.toUpperCase();
                return (
                  <button
                    key={dtId}
                    type="button"
                    disabled={busy === dtId}
                    onClick={() => handleAdd(dtId)}
                    className="text-xs px-2 py-1 rounded border border-dashed border-brand-accent/40 hover:bg-playGrey/60 text-brand-accent hover:text-brand-primary disabled:opacity-50 transition-colors"
                  >
                    + {getDocumentTypeNameById(dtId, t, dt.name)}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="text-xs px-2 py-1 rounded text-muted-foreground hover:text-brand-primary"
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddOpen(true)}
              className="border-dashed border-playBlueLight text-brand-accent hover:text-brand-primary"
            >
              <Plus className="h-3 w-3 mr-1" />
              {t("profiles.docTypes.add")}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
