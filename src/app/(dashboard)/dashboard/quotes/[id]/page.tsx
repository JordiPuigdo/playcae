"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Send } from "lucide-react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { EditableQuoteInfo } from "@/components/EditableQuoteInfo";
import { QuoteCompanyDocsPanel } from "@/components/QuoteCompanyDocsPanel";
import { QuoteEconomicSummary } from "@/components/QuoteEconomicSummary";
import { QuoteLinesTable } from "@/components/QuoteLinesTable";
import { QuoteProfilesPanel } from "@/components/QuoteProfilesPanel";
import { QuoteStatusBadge } from "@/components/QuoteStatusBadge";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useQuote } from "@/hooks/useQuote";
import { useQuoteModules } from "@/hooks/useQuoteModules";
import { useTranslation } from "@/hooks/useTranslation";
import { QuoteStatus } from "@/types/quote";
import { UserRole } from "@/types/user";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuoteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    quote,
    isLoading,
    update,
    send,
    addLine,
    updateLine,
    removeLine,
    addCompanyDocument,
    removeCompanyDocument,
    addWorkerProfile,
    updateWorkerProfile,
    removeWorkerProfile,
    addWorkerProfileDocument,
    removeWorkerProfileDocument,
  } = useQuote(id);
  const { modules } = useQuoteModules({ isActive: true });

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!user || isLoading || !quote) return <Loader text={t("common.loading")} />;
  if (user.role !== UserRole.SuperAdmin) return null;

  const readOnly = quote.status === QuoteStatus.Accepted;

  const handleSave = async (data: Parameters<typeof update>[0]) => {
    try {
      await update(data);
      toast({ title: t("quotes.saved") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.saveError"),
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    try {
      await send();
      toast({ title: t("quotes.sent"), description: t("quotes.sentDesc") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.sendError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/quotes")}
              className="border-playBlueLight"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("common.back")}
            </Button>
            <div className="h-6 w-px bg-playBlueLight" />
            <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
              <FileText className="h-7 w-7 text-brand-primary" />
              {quote.reference}
            </h1>
            <QuoteStatusBadge status={quote.status} />
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(`/presupuesto/preview/${quote.id}`, "_blank")
                }
                className="border-playBlueLight"
              >
                {t("quotes.actions.preview")}
              </Button>
              {quote.status === QuoteStatus.Draft && (
                <Button
                  onClick={handleSend}
                  className="bg-playOrange hover:bg-playOrange/90 text-white"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {t("quotes.actions.send")}
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-brand-accent">
            {t("quotes.detail.client")}: <strong>{quote.clientCompanyName}</strong>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EditableQuoteInfo quote={quote} readOnly={readOnly} onSave={handleSave} />
          </div>
          <div>
            <QuoteEconomicSummary quote={quote} />
          </div>
        </div>

        <QuoteLinesTable
          quote={quote}
          modules={modules}
          readOnly={readOnly}
          onAdd={addLine}
          onUpdate={updateLine}
          onRemove={removeLine}
        />

        <QuoteCompanyDocsPanel
          quote={quote}
          readOnly={readOnly}
          onAdd={addCompanyDocument}
          onRemove={removeCompanyDocument}
        />

        <QuoteProfilesPanel
          quote={quote}
          readOnly={readOnly}
          onAddProfile={addWorkerProfile}
          onUpdateProfile={updateWorkerProfile}
          onRemoveProfile={removeWorkerProfile}
          onAddDoc={addWorkerProfileDocument}
          onRemoveDoc={removeWorkerProfileDocument}
        />
      </div>
    </div>
  );
}
