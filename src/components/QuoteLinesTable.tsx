"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CreateQuoteLineRequest,
  Quote,
  QuoteBillingType,
  QuoteLine,
  QuoteModule,
  UpdateQuoteLineRequest,
} from "@/types/quote";
import { TableCard } from "./TableCard";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Switch } from "./ui/Switch";

interface QuoteLinesTableProps {
  quote: Quote;
  modules: QuoteModule[];
  readOnly: boolean;
  onAdd: (data: CreateQuoteLineRequest) => Promise<void>;
  onUpdate: (lineId: string, data: UpdateQuoteLineRequest) => Promise<void>;
  onRemove: (lineId: string) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const QuoteLinesTable = ({
  quote,
  modules,
  readOnly,
  onAdd,
  onUpdate,
  onRemove,
}: QuoteLinesTableProps) => {
  const { t } = useTranslation();
  const isCa = quote.language === 1;
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [adding, setAdding] = useState(false);

  const sortedLines = useMemo(
    () => [...quote.lines].sort((a, b) => a.sortOrder - b.sortOrder),
    [quote.lines]
  );

  const handleAddModule = async () => {
    if (!selectedModuleId) return;
    const mod = modules.find((m) => m.id === selectedModuleId);
    if (!mod) return;
    setAdding(true);
    try {
      await onAdd({
        quoteModuleId: mod.id,
        nameSnapshot: isCa ? mod.nameCa : mod.nameEs,
        descriptionSnapshot: isCa ? mod.descriptionCa : mod.descriptionEs,
        unitPrice: mod.defaultPrice,
        quantity: 1,
        billingType: mod.billingType,
        isOptional: false,
        sortOrder: sortedLines.length,
      });
      setSelectedModuleId("");
    } finally {
      setAdding(false);
    }
  };

  const handleAddCustom = async () => {
    setAdding(true);
    try {
      await onAdd({
        quoteModuleId: null,
        nameSnapshot: t("quotes.lines.newCustomLine"),
        descriptionSnapshot: null,
        unitPrice: 0,
        quantity: 1,
        billingType: QuoteBillingType.Annual,
        isOptional: false,
        sortOrder: sortedLines.length,
      });
    } finally {
      setAdding(false);
    }
  };

  const handleField = async <K extends keyof UpdateQuoteLineRequest>(
    line: QuoteLine,
    field: K,
    value: UpdateQuoteLineRequest[K]
  ) => {
    await onUpdate(line.id!, { [field]: value } as UpdateQuoteLineRequest);
  };

  return (
    <TableCard
      title={t("quotes.lines.title", { count: sortedLines.length })}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("quotes.lines.name")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.unitPrice")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.quantity")}</TableHead>
            <TableHead>{t("quotes.lines.billingType")}</TableHead>
            <TableHead className="text-center">{t("quotes.lines.optional")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.subtotal")}</TableHead>
            {!readOnly && <TableHead className="text-right">{t("common.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLines.length === 0 && (
            <TableRow>
              <TableCell colSpan={readOnly ? 6 : 7} className="text-center text-muted-foreground py-8">
                {t("quotes.lines.empty")}
              </TableCell>
            </TableRow>
          )}
          {sortedLines.map((line) => {
            const subtotal = line.unitPrice * line.quantity;
            return (
              <TableRow key={line.id}>
                <TableCell>
                  {readOnly ? (
                    <div>
                      <div className="font-medium">{line.nameSnapshot}</div>
                      {line.descriptionSnapshot && (
                        <div className="text-xs text-muted-foreground">
                          {line.descriptionSnapshot}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      uppercase={false}
                      defaultValue={line.nameSnapshot}
                      onBlur={(e) => {
                        if (e.target.value !== line.nameSnapshot)
                          handleField(line, "nameSnapshot", e.target.value);
                      }}
                      className="border-playBlueLight"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right w-32">
                  {readOnly ? (
                    <span className="font-mono">{formatCurrency(line.unitPrice)}</span>
                  ) : (
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      defaultValue={line.unitPrice}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== line.unitPrice) handleField(line, "unitPrice", v);
                      }}
                      className="border-playBlueLight text-right"
                    />
                  )}
                </TableCell>
                <TableCell className="text-right w-24">
                  {readOnly ? (
                    line.quantity
                  ) : (
                    <Input
                      type="number"
                      min={1}
                      defaultValue={line.quantity}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== line.quantity) handleField(line, "quantity", v);
                      }}
                      className="border-playBlueLight text-right"
                    />
                  )}
                </TableCell>
                <TableCell className="w-40">
                  {readOnly ? (
                    line.billingType === QuoteBillingType.Annual
                      ? t("quotes.billingType.annual")
                      : t("quotes.billingType.oneTime")
                  ) : (
                    <Select
                      value={String(line.billingType)}
                      onValueChange={(v) =>
                        handleField(line, "billingType", Number(v) as QuoteBillingType)
                      }
                    >
                      <SelectTrigger className="border-playBlueLight">
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
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {readOnly ? (
                    line.isOptional ? t("common.yes") : t("common.no")
                  ) : (
                    <Switch
                      checked={line.isOptional}
                      onCheckedChange={(v) => handleField(line, "isOptional", v)}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(subtotal)}
                </TableCell>
                {!readOnly && (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemove(line.id!)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {!readOnly && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-playBlueLight/20 bg-playGrey/30">
          <div className="flex-1 flex gap-2 items-center">
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
              <SelectTrigger className="border-playBlueLight bg-white">
                <SelectValue placeholder={t("quotes.lines.selectModule")} />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-72 overflow-y-auto">
                {modules
                  .filter((m) => m.isActive)
                  .map((m) => (
                    <SelectItem key={m.id} value={m.id!}>
                      {(isCa ? m.nameCa : m.nameEs) + " — " + formatCurrency(m.defaultPrice)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddModule}
              disabled={!selectedModuleId || adding}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-1" /> {t("quotes.lines.addModule")}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={handleAddCustom}
            disabled={adding}
            className="border-playBlueLight"
          >
            <Plus className="h-4 w-4 mr-1" /> {t("quotes.lines.addCustom")}
          </Button>
        </div>
      )}
    </TableCard>
  );
};
