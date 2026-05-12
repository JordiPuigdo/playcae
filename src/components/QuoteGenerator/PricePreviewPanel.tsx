"use client";

import { QuoteBillingType } from "@/types/quote";
import { GeneratorPriceLine } from "@/types/quote-generator";
import { cn } from "@/app/utils/utis";

interface PricePreviewPanelProps {
  lines: GeneratorPriceLine[];
  annualSubtotal: number;
  oneTimeSubtotal: number;
  firstYearTotal: number;
  className?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);

export const PricePreviewPanel = ({
  lines,
  annualSubtotal,
  oneTimeSubtotal,
  firstYearTotal,
  className,
}: PricePreviewPanelProps) => {
  const annualLines = lines.filter((l) => l.billingType === QuoteBillingType.Annual);
  const oneTimeLines = lines.filter((l) => l.billingType === QuoteBillingType.OneTime);

  if (lines.length === 0) {
    return (
      <div className={cn("rounded-xl border border-playBlueLight/30 bg-playGrey/30 p-5 flex items-center justify-center min-h-[160px]", className)}>
        <p className="text-sm text-muted-foreground text-center">
          Configura los parámetros para ver el desglose de precio
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-playBlueLight/30 bg-white shadow-sm overflow-hidden", className)}>
      <div className="px-5 py-3 bg-brand-primary">
        <h3 className="text-sm font-semibold text-white">Estimación de precio</h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        {annualLines.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Anual
            </p>
            {annualLines.map((l, i) => (
              <LineRow key={i} line={l} />
            ))}
            {annualLines.length > 1 && (
              <div className="flex justify-between text-sm font-medium text-brand-primary pt-1 border-t border-playBlueLight/20">
                <span>Subtotal anual</span>
                <span>{fmt(annualSubtotal)}</span>
              </div>
            )}
          </div>
        )}

        {oneTimeLines.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Pago único
            </p>
            {oneTimeLines.map((l, i) => (
              <LineRow key={i} line={l} />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 bg-brand-primary/5 border-t border-playBlueLight/30 space-y-1">
        {annualSubtotal > 0 && (
          <div className="flex justify-between text-sm text-brand-primary">
            <span>Cuota anual</span>
            <span className="font-medium">{fmt(annualSubtotal)} / año</span>
          </div>
        )}
        {oneTimeSubtotal > 0 && (
          <div className="flex justify-between text-sm text-brand-primary">
            <span>Pago único</span>
            <span className="font-medium">{fmt(oneTimeSubtotal)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-brand-primary pt-1 border-t border-playBlueLight/30">
          <span>Total primer año</span>
          <span>{fmt(firstYearTotal)}</span>
        </div>
      </div>
    </div>
  );
};

const LineRow = ({ line }: { line: GeneratorPriceLine }) => (
  <div className="flex justify-between items-baseline gap-2">
    <span className="text-xs text-brand-accent truncate flex-1 min-w-0">
      {line.label}
      {line.quantity > 1 && (
        <span className="ml-1 text-muted-foreground">×{line.quantity}</span>
      )}
    </span>
    <span
      className={cn(
        "text-xs font-medium shrink-0",
        line.unitPrice < 0 ? "text-green-600" : "text-brand-primary"
      )}
    >
      {fmt(line.unitPrice * line.quantity)}
    </span>
  </div>
);
