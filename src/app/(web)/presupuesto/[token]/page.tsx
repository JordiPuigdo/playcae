"use client";

import { use, useEffect, useMemo, useState } from "react";
import { FileText, Printer } from "lucide-react";
import { QuoteService } from "@/services/quote.service";
import { QuoteDocument } from "@/components/QuoteDocument";
import { Quote } from "@/types/quote";

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

  return (
    <div className="min-h-screen bg-playGrey py-6 px-4">
      <div className="no-print max-w-[900px] mx-auto mb-4 flex justify-end">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Guardar PDF
        </button>
      </div>
      <QuoteDocument quote={quote} />
    </div>
  );
}
