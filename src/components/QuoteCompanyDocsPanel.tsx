"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteCompanyDocumentSpecRequest,
  Quote,
} from "@/types/quote";
import { TableCard } from "./TableCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
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
  quote: Quote;
  readOnly: boolean;
  onAdd: (data: CreateQuoteCompanyDocumentSpecRequest) => Promise<void>;
  onRemove: (specId: string) => Promise<void>;
}

export const QuoteCompanyDocsPanel = ({ quote, readOnly, onAdd, onRemove }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [busy, setBusy] = useState(false);

  const sorted = [...quote.companyDocumentSpecs].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await onAdd({
        documentTypeId: null,
        customName: name.trim(),
        isTemplate,
        sortOrder: sorted.length,
      });
      setName("");
      setIsTemplate(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <TableCard
      title={t("quotes.companyDocs.title", { count: sorted.length })}
      subtitle={t("quotes.companyDocs.subtitle")}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("quotes.companyDocs.name")}</TableHead>
            <TableHead className="text-center">{t("quotes.companyDocs.isTemplate")}</TableHead>
            {!readOnly && <TableHead className="text-right">{t("common.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={readOnly ? 2 : 3} className="text-center text-muted-foreground py-6">
                {t("quotes.companyDocs.empty")}
              </TableCell>
            </TableRow>
          )}
          {sorted.map((spec) => (
            <TableRow key={spec.id}>
              <TableCell>
                {spec.documentTypeName ?? spec.customName}
              </TableCell>
              <TableCell className="text-center">
                {spec.isTemplate ? t("common.yes") : t("common.no")}
              </TableCell>
              {!readOnly && (
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemove(spec.id!)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!readOnly && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-playBlueLight/20 bg-playGrey/30 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-brand-primary">
              {t("quotes.companyDocs.addPlaceholder")}
            </label>
            <Input
              uppercase={false}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("quotes.companyDocs.addPlaceholder")}
              className="border-playBlueLight bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isTemplate} onCheckedChange={setIsTemplate} />
            <span className="text-sm text-brand-primary">
              {t("quotes.companyDocs.isTemplate")}
            </span>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!name.trim() || busy}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("common.add")}
          </Button>
        </div>
      )}
    </TableCard>
  );
};
