"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Quote,
  QuoteLanguage,
  UpdateQuoteRequest,
} from "@/types/quote";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Switch } from "./ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";

interface Props {
  quote: Quote;
  readOnly: boolean;
  onSave: (data: UpdateQuoteRequest) => Promise<void>;
}

export const EditableQuoteInfo = ({ quote, readOnly, onSave }: Props) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<UpdateQuoteRequest>({
    language: quote.language,
    clientCompanyName: quote.clientCompanyName,
    scope: quote.scope ?? "",
    externalCompaniesCount: quote.externalCompaniesCount,
    externalWorkersCount: quote.externalWorkersCount,
    internalWorkersCount: quote.internalWorkersCount,
    activeDocumentsApprox: quote.activeDocumentsApprox,
    usersCount: quote.usersCount,
    sitesCount: quote.sitesCount,
    hasWorksModule: quote.hasWorksModule,
    simultaneousWorksCount: quote.simultaneousWorksCount,
    hasInternalWorkersModule: quote.hasInternalWorkersModule,
    validUntil: quote.validUntil,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    form.language !== quote.language ||
    form.clientCompanyName !== quote.clientCompanyName ||
    (form.scope ?? "") !== (quote.scope ?? "") ||
    form.externalCompaniesCount !== quote.externalCompaniesCount ||
    form.externalWorkersCount !== quote.externalWorkersCount ||
    form.internalWorkersCount !== quote.internalWorkersCount ||
    form.activeDocumentsApprox !== quote.activeDocumentsApprox ||
    form.usersCount !== quote.usersCount ||
    form.sitesCount !== quote.sitesCount ||
    form.hasWorksModule !== quote.hasWorksModule ||
    form.simultaneousWorksCount !== quote.simultaneousWorksCount ||
    form.hasInternalWorkersModule !== quote.hasInternalWorkersModule ||
    form.validUntil !== quote.validUntil;

  return (
    <Card className="border border-playBlueLight/30 bg-white">
      <CardHeader>
        <CardTitle className="text-brand-primary">
          {t("quotes.info.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-brand-primary">{t("quotes.info.client")}</Label>
            <Input
              uppercase={false}
              value={form.clientCompanyName ?? ""}
              disabled={readOnly}
              onChange={(e) => setForm({ ...form, clientCompanyName: e.target.value })}
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">{t("quotes.info.language")}</Label>
            <Select
              value={String(form.language)}
              disabled={readOnly}
              onValueChange={(v) => setForm({ ...form, language: Number(v) as QuoteLanguage })}
            >
              <SelectTrigger className="border-playBlueLight">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={String(QuoteLanguage.Es)}>{t("quotes.language.es")}</SelectItem>
                <SelectItem value={String(QuoteLanguage.Ca)}>{t("quotes.language.ca")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-brand-primary">{t("quotes.info.scope")}</Label>
            <Input
              uppercase={false}
              value={form.scope ?? ""}
              disabled={readOnly}
              onChange={(e) => setForm({ ...form, scope: e.target.value })}
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("quotes.info.externalCompaniesCount")}
            </Label>
            <Input
              type="number"
              min={0}
              value={form.externalCompaniesCount}
              disabled={readOnly}
              onChange={(e) =>
                setForm({ ...form, externalCompaniesCount: Number(e.target.value) })
              }
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("quotes.info.externalWorkersCount")}
            </Label>
            <Input
              type="number"
              min={0}
              value={form.externalWorkersCount}
              disabled={readOnly}
              onChange={(e) =>
                setForm({ ...form, externalWorkersCount: Number(e.target.value) })
              }
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("quotes.info.activeDocumentsApprox")}
            </Label>
            <Input
              type="number"
              min={0}
              value={form.activeDocumentsApprox}
              disabled={readOnly}
              onChange={(e) =>
                setForm({ ...form, activeDocumentsApprox: Number(e.target.value) })
              }
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("quotes.info.usersCount")}
            </Label>
            <Input
              type="number"
              min={0}
              value={form.usersCount ?? 0}
              disabled={readOnly}
              onChange={(e) =>
                setForm({ ...form, usersCount: Number(e.target.value) })
              }
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">
              {t("quotes.info.sitesCount")}
            </Label>
            <Input
              type="number"
              min={0}
              value={form.sitesCount ?? 0}
              disabled={readOnly}
              onChange={(e) =>
                setForm({ ...form, sitesCount: Number(e.target.value) })
              }
              className="border-playBlueLight"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-brand-primary">{t("quotes.info.validUntil")}</Label>
            <Input
              type="date"
              value={form.validUntil ? form.validUntil.slice(0, 10) : ""}
              disabled={readOnly}
              onChange={(e) =>
                setForm({
                  ...form,
                  validUntil: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : quote.validUntil,
                })
              }
              className="border-playBlueLight"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-md border border-playBlueLight/30 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-brand-primary">
                {t("quotes.info.hasWorksModule")}
              </Label>
              <Switch
                checked={!!form.hasWorksModule}
                disabled={readOnly}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    hasWorksModule: v,
                    simultaneousWorksCount: v ? form.simultaneousWorksCount : 0,
                  })
                }
              />
            </div>
            {form.hasWorksModule && (
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.info.simultaneousWorksCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.simultaneousWorksCount ?? 0}
                  disabled={readOnly}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      simultaneousWorksCount: Number(e.target.value),
                    })
                  }
                  className="border-playBlueLight"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 rounded-md border border-playBlueLight/30 p-3">
            <div className="flex items-center justify-between">
              <Label className="text-brand-primary">
                {t("quotes.info.hasInternalWorkersModule")}
              </Label>
              <Switch
                checked={!!form.hasInternalWorkersModule}
                disabled={readOnly}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    hasInternalWorkersModule: v,
                    internalWorkersCount: v ? form.internalWorkersCount : 0,
                  })
                }
              />
            </div>
            {form.hasInternalWorkersModule && (
              <div className="space-y-2">
                <Label className="text-brand-primary">
                  {t("quotes.info.internalWorkersCount")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={form.internalWorkersCount ?? 0}
                  disabled={readOnly}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      internalWorkersCount: Number(e.target.value),
                    })
                  }
                  className="border-playBlueLight"
                />
              </div>
            )}
          </div>
        </div>

        {!readOnly && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
