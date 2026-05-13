"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckSquare2, FileDown, FileText, Square } from "lucide-react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { EditableQuoteInfo } from "@/components/EditableQuoteInfo";
import { QuoteCompanyDocsPanel } from "@/components/QuoteCompanyDocsPanel";
import { QuoteCompanyProfilesPanel } from "@/components/QuoteCompanyProfilesPanel";
import { QuoteEconomicSummary } from "@/components/QuoteEconomicSummary";
import { QuoteLinesTable } from "@/components/QuoteLinesTable";
import { QuoteProfilesPanel } from "@/components/QuoteProfilesPanel";
import { QuoteStatusBadge } from "@/components/QuoteStatusBadge";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useQuote } from "@/hooks/useQuote";
import { useQuoteModules } from "@/hooks/useQuoteModules";
import { useTranslation } from "@/hooks/useTranslation";
import { QuoteService } from "@/services/quote.service";
import { QuoteStatus } from "@/types/quote";
import { UserRole } from "@/types/user";

const quoteService = new QuoteService();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuoteDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
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
    addCompanyProfile,
    updateCompanyProfile,
    removeCompanyProfile,
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

  const handleDownloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const res = await quoteService.generatePdf(quote.id!);
      if (res.data?.pdfUrl) {
        window.open(res.data.pdfUrl, "_blank");
      } else {
        throw new Error("No PDF URL returned");
      }
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.pdfError"),
        variant: "destructive",
      });
    } finally {
      setIsPdfLoading(false);
    }
  };

  const isResend = quote.status === QuoteStatus.Sent;

  const handleConfirmSend = async () => {
    setIsSending(true);
    try {
      await send();
      toast({
        title: isResend ? t("quotes.resent") : t("quotes.sent"),
        description: isResend ? t("quotes.resentDesc") : t("quotes.sentDesc"),
      });
      setIsConfirmSendOpen(false);
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quotes.sendError"),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
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
                  window.open(`/quote-preview/${quote.id}`, "_blank")
                }
                className="border-playBlueLight"
              >
                {t("quotes.actions.preview")}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                disabled={isPdfLoading}
                className="border-playBlueLight"
              >
                <FileDown className="h-4 w-4 mr-1" />
                {isPdfLoading ? t("common.loading") : t("quotes.actions.downloadPdf")}
              </Button>
              {(quote.status === QuoteStatus.Draft || quote.status === QuoteStatus.Sent) && (
                <Button
                  onClick={() => setIsConfirmSendOpen(true)}
                  className="bg-playOrange hover:bg-playOrange/90 text-white"
                >
                  {quote.status === QuoteStatus.Sent
                    ? <CheckSquare2 className="h-4 w-4 mr-1" />
                    : <Square className="h-4 w-4 mr-1" />
                  }
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

        <QuoteCompanyProfilesPanel
          quote={quote}
          readOnly={readOnly}
          onAddProfile={addCompanyProfile}
          onUpdateProfile={updateCompanyProfile}
          onRemoveProfile={removeCompanyProfile}
        />
      </div>

      <ConfirmationModal
        isOpen={isConfirmSendOpen}
        onClose={() => setIsConfirmSendOpen(false)}
        onConfirm={handleConfirmSend}
        title={isResend ? t("quotes.resendQuote") : t("quotes.sendQuote")}
        description={isResend ? t("quotes.confirmResend") : t("quotes.confirmSend")}
        itemName={quote.reference}
        confirmLabel={isSending ? (isResend ? t("quotes.resending") : t("quotes.sending")) : (isResend ? t("quotes.actions.resend") : t("quotes.actions.send"))}
        isLoading={isSending}
      />
    </div>
  );
}
