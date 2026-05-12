"use client";

import { Edit, Trash2, FileText, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useSortableTable } from "@/hooks/useSortableTable";
import { QuoteSimple, QuoteStatus } from "@/types/quote";
import dayjs from "dayjs";
import { formatDate } from "@/app/utils/date";
import { SortableHeader } from "./SortableHeader";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { TableCard } from "./TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { toast } from "@/hooks/use-Toast";

type SortField =
  | "reference"
  | "clientCompanyName"
  | "issueDate"
  | "status"
  | "firstYearTotal";

interface QuoteTableProps {
  quotes: QuoteSimple[];
  total: number;
  onDelete: (id: string) => Promise<void>;
  onSend?: (id: string) => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const QuoteTable = ({ quotes, total, onDelete, onSend }: QuoteTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [toDelete, setToDelete] = useState<QuoteSimple | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toSend, setToSend] = useState<QuoteSimple | null>(null);
  const [isSending, setIsSending] = useState(false);

  const { sortField, sortDirection, handleSort, sortedData } = useSortableTable<
    QuoteSimple,
    SortField
  >(quotes, (a, b, field) => {
    switch (field) {
      case "reference":
        return a.reference.localeCompare(b.reference);
      case "clientCompanyName":
        return a.clientCompanyName.localeCompare(b.clientCompanyName);
      case "issueDate":
        return dayjs(a.issueDate).valueOf() - dayjs(b.issueDate).valueOf();
      case "status":
        return a.status - b.status;
      case "firstYearTotal":
        return a.firstYearTotal - b.firstYearTotal;
    }
  });

  const isResend = toSend?.status === QuoteStatus.Sent;

  const handleConfirmSend = async () => {
    if (!toSend || !onSend) return;
    setIsSending(true);
    try {
      await onSend(toSend.id!);
      toast({
        title: isResend ? t("quotes.resent") : t("quotes.sent"),
        description: isResend ? t("quotes.resentDesc") : t("quotes.sentDesc"),
      });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.sendError"),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setToSend(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(toDelete.id!);
      toast({
        title: t("quotes.deleted"),
        description: t("quotes.deletedDesc", { reference: toDelete.reference }),
      });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.deleteError"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setToDelete(null);
    }
  };

  if (quotes.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">{t("quotes.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TableCard title={t("quotes.registered", { count: total })}>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                field="reference"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t("quotes.table.reference")}
              </SortableHeader>
              <SortableHeader
                field="clientCompanyName"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t("quotes.table.client")}
              </SortableHeader>
              <SortableHeader
                field="issueDate"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              >
                {t("quotes.table.issueDate")}
              </SortableHeader>
              <SortableHeader
                field="status"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-center"
              >
                {t("quotes.table.status")}
              </SortableHeader>
              <SortableHeader
                field="firstYearTotal"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-right"
              >
                {t("quotes.table.firstYearTotal")}
              </SortableHeader>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((q) => (
              <TableRow
                key={q.id}
                className="hover:bg-playOrange/5 cursor-pointer transition-colors group"
                onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
              >
                <TableCell className="font-mono text-sm font-medium group-hover:text-playOrange transition-colors">
                  {q.reference}
                </TableCell>
                <TableCell>{q.clientCompanyName}</TableCell>
                <TableCell>{formatDate(q.issueDate)}</TableCell>
                <TableCell className="text-center">
                  <QuoteStatusBadge status={q.status} />
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(q.firstYearTotal)}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/quotes/${q.id}`)}
                      className="gap-1"
                      title={t("quotes.actions.openEditor")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onSend && (q.status === QuoteStatus.Draft || q.status === QuoteStatus.Sent) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setToSend(q)}
                        className="gap-1 text-brand-primary"
                        title={q.status === QuoteStatus.Sent ? t("quotes.actions.resend") : t("quotes.actions.send")}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/presupuesto/preview/${q.id}`,
                          "_blank"
                        )
                      }
                      className="gap-1"
                      title={t("quotes.actions.preview")}
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setToDelete(q)}
                      className="gap-1 text-destructive hover:text-destructive"
                      title={t("common.delete")}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>

      <DeleteConfirmationModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("quotes.deleteQuote")}
        description={t("quotes.confirmDelete")}
        itemName={toDelete?.reference}
        isLoading={isDeleting}
      />

      <ConfirmationModal
        isOpen={!!toSend}
        onClose={() => setToSend(null)}
        onConfirm={handleConfirmSend}
        title={isResend ? t("quotes.resendQuote") : t("quotes.sendQuote")}
        description={isResend ? t("quotes.confirmResend") : t("quotes.confirmSend")}
        itemName={toSend?.reference}
        confirmLabel={isSending ? (isResend ? t("quotes.resending") : t("quotes.sending")) : (isResend ? t("quotes.actions.resend") : t("quotes.actions.send"))}
        isLoading={isSending}
      />
    </>
  );
};
