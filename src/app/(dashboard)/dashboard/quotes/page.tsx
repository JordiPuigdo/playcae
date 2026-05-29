"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { QuoteFilters, QuoteFiltersState } from "@/components/QuoteFilters";
import { QuoteTable } from "@/components/QuoteTable";
import { QuoteGeneratorWizard } from "@/components/QuoteGenerator";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useQuotes } from "@/hooks/useQuotes";
import { useTranslation } from "@/hooks/useTranslation";
import { QuoteListQuery } from "@/types/quote";
import { QuoteService } from "@/services/quote.service";
import { UserRole } from "@/types/user";

const PAGE_SIZE = 20;

const QuotesContent = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const { items, total, page, totalPages, query, setQuery, isLoading, remove, send, downloadPdf } =
    useQuotes({ page: 1, pageSize: PAGE_SIZE });

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!user) return <Loader text="" />;
  if (user.role !== UserRole.SuperAdmin) return null;

  const handleFilter = (filters: QuoteFiltersState) => {
    const next: QuoteListQuery = {
      page: 1,
      pageSize: PAGE_SIZE,
      search: filters.search || undefined,
      status: filters.status === "all" ? undefined : filters.status,
      language: filters.language === "all" ? undefined : filters.language,
    };
    setQuery(next);
  };

  const handleSend = async (id: string) => {
    await send(id);
  };

  const goPage = (next: number) => {
    setQuery({ ...query, page: next });
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <FileText className="h-7 w-7 text-brand-primary" />
                {t("quotes.title")}
              </h1>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center bg-playOrange hover:bg-playOrange/90 text-white"
                variant={"submit"}
              >
                <Plus className="h-4 w-4" />
                {t("quotes.addQuote")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <QuoteFilters
          initialFilters={{
            search: query.search ?? "",
            status: query.status ?? "all",
            language: query.language ?? "all",
          }}
          onFilter={handleFilter}
        />

        {isLoading ? (
          <Loader text={t("common.loading")} />
        ) : (
          <QuoteTable
            quotes={items}
            total={total}
            onDelete={async (id) => {
              await remove(id);
            }}
            onSend={handleSend}
            onDownload={downloadPdf}
          />
        )}

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-500">
            {total === 0
              ? t("quotes.pagination.empty")
              : t("quotes.pagination.summary", {
                  page,
                  totalPages,
                  total,
                })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => goPage(Math.max(1, (query.page ?? 1) - 1))}
              disabled={(query.page ?? 1) <= 1}
            >
              {t("common.previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goPage((query.page ?? 1) + 1)}
              disabled={(query.page ?? 1) >= totalPages}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      </div>

      <QuoteGeneratorWizard
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        generateQuote={async (config) => {
          const service = new QuoteService();
          const res = await service.generate(config);
          return res.data;
        }}
        onCreated={(quote) => {
          toast({
            title: t("quotes.created"),
            description: t("quotes.createdDesc", { reference: quote.reference }),
          });
          router.push(`/dashboard/quotes/${quote.id}`);
        }}
      />
    </div>
  );
};

export default function QuotesPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<Loader text={t("common.loading")} />}>
      <QuotesContent />
    </Suspense>
  );
}
