"use client";

import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, FileText, Building2 } from "lucide-react";
import { QuoteService } from "@/services/quote.service";
import {
  Quote,
  QuoteBillingType,
  QuoteLanguage,
  QuoteStatus,
} from "@/types/quote";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (iso?: string | null, lang: QuoteLanguage = QuoteLanguage.Es) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(lang === QuoteLanguage.Ca ? "ca-ES" : "es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default function PublicQuotePage({ params }: PageProps) {
  const { token } = use(params);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const service = useMemo(() => new QuoteService(), []);

  useEffect(() => {
    service
      .getByPublicToken(token)
      .then((res) => setQuote(res.data))
      .catch(() => setError("Presupuesto no disponible"))
      .finally(() => setLoading(false));
  }, [service, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-playGrey">
        <p className="text-brand-accent">Cargando…</p>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-playGrey">
        <div className="bg-white rounded-lg p-8 shadow-md text-center">
          <FileText className="h-12 w-12 text-brand-accent mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-brand-primary mb-2">
            Propuesta no disponible
          </h1>
          <p className="text-brand-accent">
            Este presupuesto ya no está disponible o el enlace no es válido.
          </p>
        </div>
      </div>
    );
  }

  const isCa = quote.language === QuoteLanguage.Ca;

  const labels = isCa
    ? {
        title: "Proposta comercial",
        for: "Per a",
        reference: "Referència",
        issueDate: "Data emissió",
        validUntil: "Vàlid fins",
        scope: "Abast",
        accepted: "Acceptat",
        annualSubtotal: "Subtotal anual",
        oneTimeSubtotal: "Subtotal pagament únic",
        firstYearTotal: "Total primer any",
        unit: "Unit.",
        qty: "Qty.",
        billing: "Tipus",
        line: "Concepte",
        subtotal: "Subtotal",
        annual: "Anual",
        oneTime: "Pagament únic",
        documentsCompany: "Documents d'empresa",
        profiles: "Perfils de treballador",
        workers: "treballadors",
      }
    : {
        title: "Propuesta comercial",
        for: "Para",
        reference: "Referencia",
        issueDate: "Fecha emisión",
        validUntil: "Válido hasta",
        scope: "Alcance",
        accepted: "Aceptada",
        annualSubtotal: "Subtotal anual",
        oneTimeSubtotal: "Subtotal pago único",
        firstYearTotal: "Total primer año",
        unit: "Unit.",
        qty: "Cant.",
        billing: "Tipo",
        line: "Concepto",
        subtotal: "Subtotal",
        annual: "Anual",
        oneTime: "Pago único",
        documentsCompany: "Documentos de empresa",
        profiles: "Perfiles de trabajador",
        workers: "trabajadores",
      };

  return (
    <div className="min-h-screen bg-playGrey">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-brand-primary text-white p-8">
            <div className="flex justify-between items-start gap-6">
              <div>
                <Image
                  src="/assets/playcaeDashboard.png"
                  alt="Play CAE"
                  width={140}
                  height={40}
                  className="mb-4"
                />
                <h1 className="text-3xl font-bold">{labels.title}</h1>
                <p className="text-playBlueLight mt-1 text-sm">
                  {labels.reference}: <span className="font-mono">{quote.reference}</span>
                </p>
              </div>
              {quote.clientLogoUrl ? (
                <Image
                  src={quote.clientLogoUrl}
                  alt={quote.clientCompanyName}
                  width={120}
                  height={120}
                  className="bg-white rounded p-2 object-contain"
                />
              ) : (
                <div className="bg-white/10 rounded p-3">
                  <Building2 className="h-12 w-12 text-white/80" />
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-playBlueLight/20">
            <div>
              <p className="text-xs uppercase text-brand-accent">{labels.for}</p>
              <p className="font-semibold text-brand-primary">{quote.clientCompanyName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-brand-accent">{labels.issueDate}</p>
              <p className="font-semibold text-brand-primary">
                {formatDate(quote.issueDate, quote.language)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-brand-accent">{labels.validUntil}</p>
              <p className="font-semibold text-brand-primary">
                {formatDate(quote.validUntil, quote.language)}
              </p>
            </div>
          </div>

          {quote.status === QuoteStatus.Accepted && (
            <div className="bg-playGreen/10 border-l-4 border-playGreen p-4 m-6 rounded flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-playGreen flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-brand-primary">{labels.accepted}</p>
                {quote.acceptedAt && (
                  <p className="text-brand-accent">
                    {formatDate(quote.acceptedAt, quote.language)}
                    {quote.acceptedByName ? ` · ${quote.acceptedByName}` : ""}
                  </p>
                )}
              </div>
            </div>
          )}

          {quote.scope && (
            <div className="p-6 border-b border-playBlueLight/10">
              <p className="text-xs uppercase text-brand-accent mb-1">{labels.scope}</p>
              <p className="text-brand-primary">{quote.scope}</p>
            </div>
          )}

          {/* Lines */}
          <div className="p-6">
            <table className="w-full text-sm">
              <thead className="bg-playGrey border-b border-playBlueLight/30">
                <tr>
                  <th className="text-left px-3 py-2 text-brand-primary">{labels.line}</th>
                  <th className="text-right px-3 py-2 text-brand-primary">{labels.unit}</th>
                  <th className="text-right px-3 py-2 text-brand-primary">{labels.qty}</th>
                  <th className="text-left px-3 py-2 text-brand-primary">{labels.billing}</th>
                  <th className="text-right px-3 py-2 text-brand-primary">{labels.subtotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-playBlueLight/10">
                {[...quote.lines]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((line) => (
                    <tr key={line.id}>
                      <td className="px-3 py-3">
                        <div className="font-medium text-brand-primary">
                          {line.nameSnapshot}
                          {line.isOptional && (
                            <span className="ml-2 text-xs uppercase bg-playYellow/40 text-brand-primary px-2 py-0.5 rounded">
                              {isCa ? "Opcional" : "Opcional"}
                            </span>
                          )}
                        </div>
                        {line.descriptionSnapshot && (
                          <div className="text-xs text-brand-accent">
                            {line.descriptionSnapshot}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right font-mono">
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td className="px-3 py-3 text-right">{line.quantity}</td>
                      <td className="px-3 py-3 text-xs">
                        {line.billingType === QuoteBillingType.Annual
                          ? labels.annual
                          : labels.oneTime}
                      </td>
                      <td className="px-3 py-3 text-right font-mono">
                        {formatCurrency(line.unitPrice * line.quantity)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-playGrey p-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-accent">{labels.annualSubtotal}</span>
              <span className="font-mono">{formatCurrency(quote.annualSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-accent">{labels.oneTimeSubtotal}</span>
              <span className="font-mono">{formatCurrency(quote.oneTimeSubtotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-playBlueLight/30">
              <span className="text-brand-primary">{labels.firstYearTotal}</span>
              <span className="font-mono text-brand-primary">
                {formatCurrency(quote.firstYearTotal)}
              </span>
            </div>
          </div>

          {/* Company docs */}
          {quote.companyDocumentSpecs.length > 0 && (
            <div className="p-6 border-t border-playBlueLight/20">
              <h3 className="text-sm uppercase text-brand-accent mb-3">
                {labels.documentsCompany}
              </h3>
              <ul className="space-y-1 text-sm">
                {quote.companyDocumentSpecs
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((d) => (
                    <li key={d.id} className="text-brand-primary">
                      • {d.documentTypeName ?? d.customName}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Profiles */}
          {quote.workerProfileSpecs.length > 0 && (
            <div className="p-6 border-t border-playBlueLight/20">
              <h3 className="text-sm uppercase text-brand-accent mb-3">{labels.profiles}</h3>
              <div className="space-y-3">
                {quote.workerProfileSpecs
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="border border-playBlueLight/30 rounded-md p-3 bg-white"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-brand-primary">{p.name}</p>
                        <span className="text-xs text-brand-accent">
                          {p.workerCount} {labels.workers}
                        </span>
                      </div>
                      {p.documents.length > 0 && (
                        <ul className="text-xs text-brand-accent space-y-0.5">
                          {p.documents.map((d) => (
                            <li key={d.id}>• {d.documentTypeName ?? d.customName}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-brand-primary text-white p-6 text-xs text-center">
            <p className="opacity-80">
              Play CAE · {quote.reference} · {formatDate(quote.issueDate, quote.language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
