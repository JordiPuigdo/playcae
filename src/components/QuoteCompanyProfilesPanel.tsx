"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteCompanyProfileSpecRequest,
  Quote,
  QuoteCompanyProfileSpec,
  UpdateQuoteCompanyProfileSpecRequest,
} from "@/types/quote";
import { TableCard } from "./TableCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent } from "./ui/Card";

interface Props {
  quote: Quote;
  readOnly: boolean;
  onAddProfile: (data: CreateQuoteCompanyProfileSpecRequest) => Promise<void>;
  onUpdateProfile: (specId: string, data: UpdateQuoteCompanyProfileSpecRequest) => Promise<void>;
  onRemoveProfile: (specId: string) => Promise<void>;
}

export const QuoteCompanyProfilesPanel = ({
  quote,
  readOnly,
  onAddProfile,
  onUpdateProfile,
  onRemoveProfile,
}: Props) => {
  const { t } = useTranslation();
  const [newName, setNewName] = useState("");
  const [newCompanyCount, setNewCompanyCount] = useState(1);
  const [newDocumentCount, setNewDocumentCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const sorted = [...quote.companyProfileSpecs].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await onAddProfile({
        name: newName.trim(),
        companyCount: newCompanyCount,
        documentCount: newDocumentCount,
        sortOrder: sorted.length,
      });
      setNewName("");
      setNewCompanyCount(1);
      setNewDocumentCount(0);
    } finally {
      setBusy(false);
    }
  };

  return (
    <TableCard
      title={t("quotes.companyProfiles.title", { count: sorted.length })}
      subtitle={t("quotes.companyProfiles.subtitle")}
    >
      <div className="p-4 space-y-3">
        {sorted.length === 0 && (
          <Card className="border-dashed border-playBlueLight/30">
            <CardContent className="p-6 text-center text-muted-foreground">
              {t("quotes.companyProfiles.empty")}
            </CardContent>
          </Card>
        )}

        {sorted.map((spec) => (
          <CompanyProfileRow
            key={spec.id}
            spec={spec}
            readOnly={readOnly}
            onUpdate={(data) => onUpdateProfile(spec.id!, data)}
            onRemove={() => onRemoveProfile(spec.id!)}
          />
        ))}

        {!readOnly && (
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-end pt-2">
            <div>
              <label className="text-sm font-medium text-brand-primary block mb-2">
                {t("quotes.companyProfiles.newProfileLabel")}
              </label>
              <Input
                uppercase={false}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("quotes.companyProfiles.newProfilePlaceholder")}
                className="border-playBlueLight bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-brand-accent block mb-2">
                {t("quotes.companyProfiles.companyCount")}
              </label>
              <Input
                type="number"
                min={1}
                value={newCompanyCount}
                onChange={(e) => setNewCompanyCount(Math.max(1, Number(e.target.value)))}
                className="border-playBlueLight w-20"
              />
            </div>
            <div>
              <label className="text-xs text-brand-accent block mb-2">
                {t("quotes.companyProfiles.documentCount")}
              </label>
              <Input
                type="number"
                min={0}
                value={newDocumentCount}
                onChange={(e) => setNewDocumentCount(Math.max(0, Number(e.target.value)))}
                className="border-playBlueLight w-20"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || busy}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white self-end"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("quotes.companyProfiles.addProfile")}
            </Button>
          </div>
        )}
      </div>
    </TableCard>
  );
};

interface CompanyProfileRowProps {
  spec: QuoteCompanyProfileSpec;
  readOnly: boolean;
  onUpdate: (data: UpdateQuoteCompanyProfileSpecRequest) => Promise<void>;
  onRemove: () => Promise<void>;
}

const CompanyProfileRow = ({
  spec,
  readOnly,
  onUpdate,
  onRemove,
}: CompanyProfileRowProps) => {
  const { t } = useTranslation();

  return (
    <Card className="border border-playBlueLight/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {readOnly ? (
              <div className="font-medium text-brand-primary">{spec.name}</div>
            ) : (
              <Input
                uppercase={false}
                defaultValue={spec.name}
                onBlur={(e) => {
                  if (e.target.value !== spec.name) onUpdate({ name: e.target.value });
                }}
                className="border-playBlueLight"
              />
            )}
            {readOnly ? (
              <div className="text-sm text-muted-foreground">
                {t("quotes.companyProfiles.companiesCount", { count: spec.companyCount })}
              </div>
            ) : (
              <div>
                <label className="text-xs text-brand-accent block mb-1">
                  {t("quotes.companyProfiles.companyCount")}
                </label>
                <Input
                  type="number"
                  min={1}
                  defaultValue={spec.companyCount}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== spec.companyCount) onUpdate({ companyCount: v });
                  }}
                  className="border-playBlueLight"
                />
              </div>
            )}
            {readOnly ? (
              <div className="text-xs text-muted-foreground self-center">
                {t("quotes.companyProfiles.documentsCount", { count: spec.documentCount })}
              </div>
            ) : (
              <div>
                <label className="text-xs text-brand-accent block mb-1">
                  {t("quotes.companyProfiles.documentCount")}
                </label>
                <Input
                  type="number"
                  min={0}
                  defaultValue={spec.documentCount}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v !== spec.documentCount) onUpdate({ documentCount: v });
                  }}
                  className="border-playBlueLight"
                />
              </div>
            )}
          </div>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
