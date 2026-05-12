"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Printer, Eye } from "lucide-react";
import { QuoteService } from "@/services/quote.service";
import { QuoteDocument } from "@/components/QuoteDocument";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Quote } from "@/types/quote";
import { UserRole } from "@/types/user";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuotePreviewPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const service = useMemo(() => new QuoteService(), []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
      return;
    }
    service
      .getById(id)
      .then((res) => setQuote(res.data))
      .catch(() => setError("Presupuesto no disponible"))
      .finally(() => setLoading(false));
  }, [service, id, isAuthenticated, user, router]);

  if (!isAuthenticated || !user || loading) {
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
            Este presupuesto no existe o no tienes acceso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-playGrey">
      <div className="no-print bg-playOrange text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium">
        <Eye className="h-4 w-4" />
        Vista previa interna — el cliente no ve esta barra
      </div>
      <div className="py-6 px-4">
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
    </div>
  );
}
