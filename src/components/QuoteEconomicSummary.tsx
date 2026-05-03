"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import { Quote } from "@/types/quote";

interface Props {
  quote: Quote;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const QuoteEconomicSummary = ({ quote }: Props) => {
  const { t } = useTranslation();

  return (
    <Card className="border border-playBlueLight/30 bg-white">
      <CardHeader>
        <CardTitle className="text-brand-primary">
          {t("quotes.summary.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-accent">
            {t("quotes.summary.annualSubtotal")}
          </span>
          <span className="font-mono">{formatCurrency(quote.annualSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brand-accent">
            {t("quotes.summary.oneTimeSubtotal")}
          </span>
          <span className="font-mono">{formatCurrency(quote.oneTimeSubtotal)}</span>
        </div>
        <div className="border-t border-playBlueLight/30 pt-3 flex justify-between font-semibold">
          <span className="text-brand-primary">
            {t("quotes.summary.firstYearTotal")}
          </span>
          <span className="font-mono text-brand-primary">
            {formatCurrency(quote.firstYearTotal)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          {t("quotes.summary.note")}
        </p>
      </CardContent>
    </Card>
  );
};
