"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteModuleRequest,
  QuoteBillingType,
  QuoteModule,
  UpdateQuoteModuleRequest,
} from "@/types/quote";
import { TableCard } from "./TableCard";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Switch } from "./ui/Switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Badge } from "./ui/Badge";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface Props {
  modules: QuoteModule[];
  onCreate: (data: CreateQuoteModuleRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateQuoteModuleRequest) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const blank: CreateQuoteModuleRequest = {
  code: "",
  nameEs: "",
  nameCa: "",
  descriptionEs: "",
  descriptionCa: "",
  defaultPrice: 0,
  billingType: QuoteBillingType.Annual,
  isActive: true,
  sortOrder: 0,
  iconKey: null,
};

export const QuoteModuleTable = ({ modules, onCreate, onUpdate, onDelete }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<QuoteModule | null>(null);
  const [form, setForm] = useState<CreateQuoteModuleRequest>(blank);
  const [toDelete, setToDelete] = useState<QuoteModule | null>(null);
  const [busy, setBusy] = useState(false);

  const sorted = [...modules].sort((a, b) => a.sortOrder - b.sortOrder);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...blank, sortOrder: modules.length });
    setOpen(true);
  };

  const openEdit = (m: QuoteModule) => {
    setEditing(m);
    setForm({
      code: m.code,
      nameEs: m.nameEs,
      nameCa: m.nameCa,
      descriptionEs: m.descriptionEs ?? "",
      descriptionCa: m.descriptionCa ?? "",
      defaultPrice: m.defaultPrice,
      billingType: m.billingType,
      isActive: m.isActive,
      sortOrder: m.sortOrder,
      iconKey: m.iconKey ?? null,
    });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editing) {
        await onUpdate(editing.id!, form);
      } else {
        await onCreate(form);
      }
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <TableCard title={t("quoteModules.registered", { count: modules.length })}>
        {modules.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">{t("quoteModules.empty")}</p>
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("quoteModules.table.code")}</TableHead>
                <TableHead>{t("quoteModules.table.nameEs")}</TableHead>
                <TableHead>{t("quoteModules.table.nameCa")}</TableHead>
                <TableHead className="text-right">{t("quoteModules.table.price")}</TableHead>
                <TableHead>{t("quoteModules.table.billingType")}</TableHead>
                <TableHead className="text-center">{t("quoteModules.table.active")}</TableHead>
                <TableHead className="text-right">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">{m.code}</TableCell>
                  <TableCell>{m.nameEs}</TableCell>
                  <TableCell>{m.nameCa}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(m.defaultPrice)}
                  </TableCell>
                  <TableCell>
                    {m.billingType === QuoteBillingType.Annual
                      ? t("quotes.billingType.annual")
                      : t("quotes.billingType.oneTime")}
                  </TableCell>
                  <TableCell className="text-center">
                    {m.isActive ? (
                      <Badge className="bg-playGreen text-white">{t("common.yes")}</Badge>
                    ) : (
                      <Badge variant="secondary">{t("common.no")}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(m)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToDelete(m)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <div className="flex justify-end">
        <Button
          onClick={openCreate}
          className="bg-playOrange hover:bg-playOrange/90 text-white"
          variant={"submit"}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("quoteModules.add")}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[640px] bg-white border border-brand-accent/30">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">
              {editing ? t("quoteModules.editTitle") : t("quoteModules.addTitle")}
            </DialogTitle>
            <DialogDescription className="text-brand-accent">
              {t("quoteModules.formDescription")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.code")} *</Label>
                <Input
                  uppercase={false}
                  value={form.code}
                  required
                  disabled={!!editing}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="border-brand-accent font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.sortOrder")}</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.nameEs")} *</Label>
                <Input
                  uppercase={false}
                  value={form.nameEs}
                  required
                  onChange={(e) => setForm({ ...form, nameEs: e.target.value })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.nameCa")} *</Label>
                <Input
                  uppercase={false}
                  value={form.nameCa}
                  required
                  onChange={(e) => setForm({ ...form, nameCa: e.target.value })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-brand-primary">{t("quoteModules.form.descriptionEs")}</Label>
                <Input
                  uppercase={false}
                  value={form.descriptionEs ?? ""}
                  onChange={(e) => setForm({ ...form, descriptionEs: e.target.value })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-brand-primary">{t("quoteModules.form.descriptionCa")}</Label>
                <Input
                  uppercase={false}
                  value={form.descriptionCa ?? ""}
                  onChange={(e) => setForm({ ...form, descriptionCa: e.target.value })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.price")} *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.defaultPrice}
                  onChange={(e) => setForm({ ...form, defaultPrice: Number(e.target.value) })}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">{t("quoteModules.form.billingType")} *</Label>
                <Select
                  value={String(form.billingType)}
                  onValueChange={(v) =>
                    setForm({ ...form, billingType: Number(v) as QuoteBillingType })
                  }
                >
                  <SelectTrigger className="border-brand-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value={String(QuoteBillingType.Annual)}>
                      {t("quotes.billingType.annual")}
                    </SelectItem>
                    <SelectItem value={String(QuoteBillingType.OneTime)}>
                      {t("quotes.billingType.oneTime")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                />
                <span className="text-sm text-brand-primary">
                  {t("quoteModules.form.isActive")}
                </span>
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
        title={t("quoteModules.deleteTitle")}
        description={t("quoteModules.confirmDelete")}
        itemName={toDelete?.code}
      />
    </>
  );
};
