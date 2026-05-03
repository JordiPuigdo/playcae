"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteRequest,
  QuoteLanguage,
} from "@/types/quote";
import { LeadForm } from "./LeadForm";
import { LeadPicker, LeadPickerSelection } from "./LeadPicker";
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
import { Switch } from "./ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuoteRequest) => Promise<void> | void;
  /**
   * Optional pre-selected lead. If provided, the lead picker is hidden.
   */
  fixedLead?: { id: string; companyName: string };
}

export const QuoteForm = ({ isOpen, onClose, onSubmit, fixedLead }: QuoteFormProps) => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadPickerSelection | null>(
    fixedLead ? { id: fixedLead.id, companyName: fixedLead.companyName, email: "" } : null
  );
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [form, setForm] = useState<Omit<CreateQuoteRequest, "leadId">>({
    language: QuoteLanguage.Es,
    scope: "",
    externalCompaniesCount: 0,
    externalWorkersCount: 0,
    internalWorkersCount: 0,
    activeDocumentsApprox: 0,
    usersCount: 0,
    sitesCount: 0,
    hasWorksModule: false,
    simultaneousWorksCount: 0,
    hasInternalWorkersModule: false,
    validUntil: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setSelectedLead(
      fixedLead ? { id: fixedLead.id, companyName: fixedLead.companyName, email: "" } : null
    );
    setForm({
      language: QuoteLanguage.Es,
      scope: "",
      externalCompaniesCount: 0,
      externalWorkersCount: 0,
      internalWorkersCount: 0,
      activeDocumentsApprox: 0,
      usersCount: 0,
      sitesCount: 0,
      hasWorksModule: false,
      simultaneousWorksCount: 0,
      hasInternalWorkersModule: false,
      validUntil: null,
    });
    setErrors({});
  }, [isOpen, fixedLead]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!selectedLead) e.leadId = t("quotes.form.leadRequired");
    if (form.externalCompaniesCount < 0) e.externalCompaniesCount = t("quotes.form.invalid");
    if (form.externalWorkersCount < 0) e.externalWorkersCount = t("quotes.form.invalid");
    if (form.internalWorkersCount < 0) e.internalWorkersCount = t("quotes.form.invalid");
    if (form.activeDocumentsApprox < 0) e.activeDocumentsApprox = t("quotes.form.invalid");
    if (form.usersCount < 0) e.usersCount = t("quotes.form.invalid");
    if (form.sitesCount < 0) e.sitesCount = t("quotes.form.invalid");
    if (form.hasWorksModule && form.simultaneousWorksCount < 0)
      e.simultaneousWorksCount = t("quotes.form.invalid");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || !selectedLead) return;
    setSubmitting(true);
    try {
      const payload: CreateQuoteRequest = {
        ...form,
        leadId: selectedLead.id,
        simultaneousWorksCount: form.hasWorksModule ? form.simultaneousWorksCount : 0,
        internalWorkersCount: form.hasInternalWorkersModule ? form.internalWorkersCount : 0,
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const setField = <K extends keyof Omit<CreateQuoteRequest, "leadId">>(
    key: K,
    value: Omit<CreateQuoteRequest, "leadId">[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[640px] bg-white border border-brand-accent/30 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-brand-primary">
              {t("quotes.form.createTitle")}
            </DialogTitle>
            <DialogDescription className="text-brand-accent">
              {t("quotes.form.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-brand-primary">{t("quotes.form.lead")} *</Label>
              {fixedLead ? (
                <div className="rounded-md border border-playBlueLight/30 bg-playGrey px-3 py-2 text-sm">
                  {fixedLead.companyName}
                </div>
              ) : (
                <LeadPicker
                  value={selectedLead}
                  onChange={(lead) => {
                    setSelectedLead(lead);
                    if (errors.leadId) setErrors((prev) => ({ ...prev, leadId: "" }));
                  }}
                  onCreateNew={() => setIsLeadFormOpen(true)}
                />
              )}
              {errors.leadId && (
                <p className="text-sm text-destructive">{errors.leadId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.language")} *
                </Label>
                <Select
                  value={String(form.language)}
                  onValueChange={(v) => setField("language", Number(v) as QuoteLanguage)}
                >
                  <SelectTrigger className="border-brand-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30">
                    <SelectItem value={String(QuoteLanguage.Es)}>
                      {t("quotes.language.es")}
                    </SelectItem>
                    <SelectItem value={String(QuoteLanguage.Ca)}>
                      {t("quotes.language.ca")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.validUntil")}
                </Label>
                <Input
                  type="date"
                  value={form.validUntil ? form.validUntil.slice(0, 10) : ""}
                  onChange={(e) =>
                    setField(
                      "validUntil",
                      e.target.value ? new Date(e.target.value).toISOString() : null
                    )
                  }
                  className="border-brand-accent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-brand-primary">{t("quotes.form.scope")}</Label>
              <Input
                uppercase={false}
                value={form.scope ?? ""}
                onChange={(e) => setField("scope", e.target.value)}
                placeholder={t("quotes.form.scopePlaceholder")}
                className="border-brand-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.externalCompaniesCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.externalCompaniesCount}
                  onChange={(e) => setField("externalCompaniesCount", Number(e.target.value))}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.externalWorkersCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.externalWorkersCount}
                  onChange={(e) => setField("externalWorkersCount", Number(e.target.value))}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.activeDocumentsApprox")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.activeDocumentsApprox}
                  onChange={(e) => setField("activeDocumentsApprox", Number(e.target.value))}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.usersCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.usersCount}
                  onChange={(e) => setField("usersCount", Number(e.target.value))}
                  className="border-brand-accent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.form.sitesCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.sitesCount}
                  onChange={(e) => setField("sitesCount", Number(e.target.value))}
                  className="border-brand-accent"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-md border border-playBlueLight/30 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-brand-primary">
                  {t("quotes.form.hasWorksModule")}
                </Label>
                <Switch
                  checked={form.hasWorksModule}
                  onCheckedChange={(v) => setField("hasWorksModule", v)}
                />
              </div>
              {form.hasWorksModule && (
                <div className="space-y-2">
                  <Label className="text-brand-primary">
                    {t("quotes.form.simultaneousWorksCount")}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.simultaneousWorksCount}
                    onChange={(e) =>
                      setField("simultaneousWorksCount", Number(e.target.value))
                    }
                    className="border-brand-accent"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3 rounded-md border border-playBlueLight/30 p-3">
              <div className="flex items-center justify-between">
                <Label className="text-brand-primary">
                  {t("quotes.form.hasInternalWorkersModule")}
                </Label>
                <Switch
                  checked={form.hasInternalWorkersModule}
                  onCheckedChange={(v) => setField("hasInternalWorkersModule", v)}
                />
              </div>
              {form.hasInternalWorkersModule && (
                <div className="space-y-2">
                  <Label className="text-brand-primary">
                    {t("quotes.form.internalWorkersCount")}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.internalWorkersCount}
                    onChange={(e) =>
                      setField("internalWorkersCount", Number(e.target.value))
                    }
                    className="border-brand-accent"
                  />
                </div>
              )}
            </div>

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
                {submitting ? t("common.saving") : t("quotes.form.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <LeadForm
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        onCreated={(lead) => {
          setSelectedLead({
            id: lead.id!,
            companyName: lead.companyName,
            email: lead.email,
          });
          if (errors.leadId) setErrors((prev) => ({ ...prev, leadId: "" }));
        }}
      />
    </>
  );
};
