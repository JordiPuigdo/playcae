"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { CreateLeadRequest, Lead, LeadOrigin } from "@/types/lead";
import { LeadService } from "@/services/lead.service";
import { WebInquiryService } from "@/services/web-inquiry.service";
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
  initialEmail?: string;
  initialContactPerson?: string;
  sourceInquiryId?: string;
}

export const LeadForm = ({ isOpen, onClose, onCreated, initialCompanyName, initialEmail, initialContactPerson, sourceInquiryId }: LeadFormProps) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [inquiryWarning, setInquiryWarning] = useState(false);
  const [form, setForm] = useState<CreateLeadRequest>({
    companyName: initialCompanyName ?? "",
    email: "",
    phone: "",
    taxId: "",
    contactPerson: "",
    address: "",
    origin: LeadOrigin.Web,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    let contactPerson = (initialContactPerson ?? "").toUpperCase();
    let companyName = (initialCompanyName ?? "").toUpperCase();

    if (initialEmail) {
      const atIndex = initialEmail.indexOf("@");
      if (atIndex > 0) {
        const localPart = initialEmail.slice(0, atIndex);
        const domainPart = initialEmail.slice(atIndex + 1);

        if (!contactPerson) {
          contactPerson = localPart.split(".").join(" ").toUpperCase();
        }

        if (!companyName) {
          companyName = domainPart.split(".")[0].toUpperCase();
        }
      }
    }

    setForm({
      companyName,
      email: initialEmail ?? "",
      phone: "",
      taxId: "",
      contactPerson,
      address: "",
      origin: LeadOrigin.Web,
    });
    setErrors({});
    setServerError(null);
    setInquiryWarning(false);
  }, [isOpen, initialCompanyName, initialEmail, initialContactPerson]);

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

  const createLead = async () => {
    setSubmitting(true);
    setServerError(null);
    try {
      const service = new LeadService();
      const response = await service.create({ ...form, sourceInquiryId });
      onCreated(response.data);
      onClose();
    } catch (err) {
      const e = err as { message?: string };
      setServerError(e.message || t("leads.form.createError"));
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    if (!sourceInquiryId) {
      setSubmitting(true);
      try {
        const inquiryService = new WebInquiryService();
        const { exists } = await inquiryService.checkEmail(form.email);
        if (exists) {
          setInquiryWarning(true);
          return;
        }
      } catch {
        // si falla el check, dejamos continuar para no bloquear el flujo
      } finally {
        setSubmitting(false);
      }
    }

    await createLead();
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
    <>
    <Dialog open={inquiryWarning} onOpenChange={(open) => { if (!open) setInquiryWarning(false); }}>
      <DialogContent className="sm:max-w-md bg-white border border-brand-accent/30 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            Este email ya existe en Contacto y Precios
          </DialogTitle>
          <DialogDescription>
            El email{" "}
            <span className="font-medium text-foreground">{form.email}</span>{" "}
            ya tiene una entrada en la tabla de Contacto y Precios.
            Te recomendamos generarlo desde allí usando el botón{" "}
            <span className="font-medium">«Convertir a lead»</span>.
            ¿Quieres crearlo igualmente desde aquí?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setInquiryWarning(false)}
            className="border-brand-accent text-brand-primary hover:bg-brand-neutral"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={submitting}
            onClick={() => { setInquiryWarning(false); createLead(); }}
            className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md"
          >
            {submitting ? t("common.saving") : "Sí, crear igualmente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

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
              value={form.companyName}
              onChange={(e) => setField("companyName", e.target.value)}
              className={errors.companyName ? "border-destructive" : "border-brand-accent"}
              placeholder="CONSTRUCTORA ABC S.L."
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
                value={form.contactPerson}
                onChange={(e) => setField("contactPerson", e.target.value)}
                className={errors.contactPerson ? "border-destructive" : "border-brand-accent"}
                placeholder="NOMBRE Y APELLIDOS"
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
    </>
  );
};
