"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CreateLeadRequest, Lead, LeadOrigin } from "@/types/lead";
import { LeadService } from "@/services/lead.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (lead: Lead) => void;
  initialCompanyName?: string;
}

const generatePassword = () => {
  // Strong placeholder password; real password is set only when the lead is
  // promoted to a tenant Admin user upon quote acceptance.
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return (
    "Tmp!" +
    Array.from(bytes)
      .map((b) => b.toString(36))
      .join("")
      .slice(0, 20) +
    "9"
  );
};

export const LeadForm = ({ isOpen, onClose, onCreated, initialCompanyName }: LeadFormProps) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateLeadRequest>({
    companyName: initialCompanyName ?? "",
    email: "",
    phone: "",
    taxId: "",
    contactPerson: "",
    address: "",
    password: generatePassword(),
    origin: LeadOrigin.Web,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      companyName: initialCompanyName ?? "",
      email: "",
      phone: "",
      taxId: "",
      contactPerson: "",
      address: "",
      password: generatePassword(),
      origin: LeadOrigin.Web,
    });
    setErrors({});
    setServerError(null);
  }, [isOpen, initialCompanyName]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = t("leads.form.companyNameRequired");
    if (!form.email.trim()) e.email = t("leads.form.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t("leads.form.emailInvalid");
    if (!form.contactPerson.trim()) e.contactPerson = t("leads.form.contactPersonRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const service = new LeadService();
      const response = await service.create(form);
      onCreated(response.data);
      onClose();
    } catch (err) {
      const e = err as { message?: string };
      setServerError(e.message || t("leads.form.createError"));
    } finally {
      setSubmitting(false);
    }
  };

  const setField = <K extends keyof CreateLeadRequest>(
    key: K,
    value: CreateLeadRequest[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key as string]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] bg-white border border-brand-accent/30 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            {t("leads.form.createTitle")}
          </DialogTitle>
          <DialogDescription className="text-brand-accent">
            {t("leads.form.createDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("leads.form.companyName")} *
            </Label>
            <Input
              uppercase={false}
              value={form.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
              className={errors.companyName ? "border-destructive" : "border-brand-accent"}
              placeholder="Constructora ABC S.L."
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">{errors.companyName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-brand-primary">
                {t("leads.form.email")} *
              </Label>
              <Input
                uppercase={false}
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={errors.email ? "border-destructive" : "border-brand-accent"}
                placeholder="contacto@empresa.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">{t("leads.form.phone")}</Label>
              <Input
                uppercase={false}
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="border-brand-accent"
                placeholder="123 456 789"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">{t("leads.form.taxId")}</Label>
              <Input
                value={form.taxId}
                onChange={(e) => setField("taxId", e.target.value)}
                className="border-brand-accent"
                placeholder="A12345678"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-brand-primary">
                {t("leads.form.contactPerson")} *
              </Label>
              <Input
                uppercase={false}
                value={form.contactPerson}
                onChange={(e) => setField("contactPerson", e.target.value)}
                className={errors.contactPerson ? "border-destructive" : "border-brand-accent"}
                placeholder="Nombre y apellidos"
              />
              {errors.contactPerson && (
                <p className="text-sm text-destructive">{errors.contactPerson}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-brand-primary">{t("leads.form.address")}</Label>
            <Input
              uppercase={false}
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              className="border-brand-accent"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-brand-primary">{t("leads.form.origin")}</Label>
            <Select
              value={String(form.origin)}
              onValueChange={(v) => setField("origin", Number(v) as LeadOrigin)}
            >
              <SelectTrigger className="border-brand-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem value={String(LeadOrigin.Web)}>
                  {t("dashboard.leads.origins.web")}
                </SelectItem>
                <SelectItem value={String(LeadOrigin.Landing)}>
                  {t("dashboard.leads.origins.landing")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
              {serverError}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="border-brand-accent text-brand-primary hover:bg-brand-neutral"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md"
            >
              {submitting ? t("common.saving") : t("leads.form.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
