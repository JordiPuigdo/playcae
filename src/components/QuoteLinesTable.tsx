"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronUp, ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import { useTranslation, TranslationKey } from "@/hooks/useTranslation";
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

const formatCurrency = (value: number) => {
  const abs = Math.abs(value).toFixed(2);
  const [int, dec] = abs.split(".");
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decPart = dec === "00" ? "" : `,${dec}`;
  return `${value < 0 ? "-" : ""}${intFormatted}${decPart} €`;
};

interface SortableRowProps {
  line: QuoteLine;
  index: number;
  total: number;
  readOnly: boolean;
  reordering: boolean;
  isCa: boolean;
  onMove: (fromIndex: number, toIndex: number) => void;
  onField: <K extends keyof UpdateQuoteLineRequest>(
    line: QuoteLine,
    field: K,
    value: UpdateQuoteLineRequest[K]
  ) => Promise<void>;
  onRemove: (lineId: string) => Promise<void>;
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string;
}

const SortableRow = ({
  line,
  index,
  total,
  readOnly,
  reordering,
  isCa,
  onMove,
  onField,
  onRemove,
  t,
}: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: line.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const subtotal = line.unitPrice * line.quantity;

  return (
    <TableRow ref={setNodeRef} style={style}>
      {!readOnly && (
        <TableCell className="w-8 px-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            aria-label="Arrastrar para reordenar"
            disabled={reordering}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </TableCell>
      )}
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
                onField(line, "nameSnapshot", e.target.value);
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
              if (v !== line.unitPrice) onField(line, "unitPrice", v);
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
              if (v !== line.quantity) onField(line, "quantity", v);
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
              onField(line, "billingType", Number(v) as QuoteBillingType)
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
            onCheckedChange={(v) => onField(line, "isOptional", v)}
          />
        )}
      </TableCell>
      <TableCell className="text-right font-mono">
        {formatCurrency(subtotal)}
      </TableCell>
      {!readOnly && (
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove(index, index - 1)}
              disabled={index === 0 || reordering}
              aria-label={t("quotes.lines.moveUp")}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMove(index, index + 1)}
              disabled={index === total - 1 || reordering}
              aria-label={t("quotes.lines.moveDown")}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(line.id!)}
              disabled={reordering}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

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
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const sortedLines = useMemo(
    () => [...quote.lines].sort((a, b) => a.sortOrder - b.sortOrder),
    [quote.lines]
  );

  const handleMove = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sortedLines.length) return;
    setReordering(true);
    try {
      const a = sortedLines[fromIndex];
      const b = sortedLines[toIndex];
      await onUpdate(a.id!, { sortOrder: b.sortOrder });
      await onUpdate(b.id!, { sortOrder: a.sortOrder });
    } finally {
      setReordering(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sortedLines.findIndex((l) => l.id === active.id);
    const toIndex = sortedLines.findIndex((l) => l.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      await handleMove(fromIndex, toIndex);
    }
  };

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
            {!readOnly && <TableHead className="w-8" />}
            <TableHead>{t("quotes.lines.name")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.unitPrice")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.quantity")}</TableHead>
            <TableHead>{t("quotes.lines.billingType")}</TableHead>
            <TableHead className="text-center">{t("quotes.lines.optional")}</TableHead>
            <TableHead className="text-right">{t("quotes.lines.subtotal")}</TableHead>
            {!readOnly && <TableHead className="text-right">{t("common.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sortedLines.map((l) => l.id!)}
            strategy={verticalListSortingStrategy}
          >
            <TableBody>
              {sortedLines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={readOnly ? 6 : 8} className="text-center text-muted-foreground py-8">
                    {t("quotes.lines.empty")}
                  </TableCell>
                </TableRow>
              )}
              {sortedLines.map((line, index) => (
                <SortableRow
                  key={line.id}
                  line={line}
                  index={index}
                  total={sortedLines.length}
                  readOnly={readOnly}
                  reordering={reordering}
                  isCa={isCa}
                  onMove={handleMove}
                  onField={handleField}
                  onRemove={onRemove}
                  t={t}
                />
              ))}
            </TableBody>
          </SortableContext>
        </DndContext>
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
