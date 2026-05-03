"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Megaphone, Search } from "lucide-react";

import { useAuthStore } from "@/hooks/useAuthStore";
import {
  DashboardLeadTabId,
  InquiryTypeFilter,
  LeadOriginFilter,
  useDashboardLeads,
} from "@/hooks/useDashboardLeads";
import { useTranslation } from "@/hooks/useTranslation";
import { useSortableTable } from "@/hooks/useSortableTable";
import { toast } from "@/hooks/use-Toast";

import { UserRole } from "@/types/user";
import { LeadOrigin, Lead } from "@/types/lead";
import { WebInquiry, WebInquiryType } from "@/types/web-inquiry";
import { CreateQuoteRequest } from "@/types/quote";
import { QuoteService } from "@/services/quote.service";

import { formatDate } from "@/app/utils/date";
import Loader from "@/components/Loader";
import { QuoteForm } from "@/components/QuoteForm";
import { SortableHeader } from "@/components/SortableHeader";
import { TableCard } from "@/components/TableCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type InquirySortField = "type" | "name" | "email" | "creationDate";
type LeadSortField =
  | "companyName"
  | "contactPerson"
  | "email"
  | "phone"
  | "origin"
  | "emailVerified"
  | "creationDate";

export default function LeadsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<DashboardLeadTabId>("inquiries");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryTypeFilter>("all");
  const [leadOrigin, setLeadOrigin] = useState<LeadOriginFilter>("all");
  const [quoteLead, setQuoteLead] = useState<{ id: string; companyName: string } | null>(null);

  const { inquiries, leads, inquiryError, leadError, isLoading } =
    useDashboardLeads({
      activeTab,
      page,
      pageSize,
      search,
      inquiryType,
      leadOrigin,
    });

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, pageSize, inquiryType, leadOrigin]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPage(1);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const inquirySort = useSortableTable<WebInquiry, InquirySortField>(
    inquiries.items,
    (a, b, field) => {
      switch (field) {
        case "type":
          return Number(a.type) - Number(b.type);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "creationDate":
          return (
            new Date(a.creationDate ?? 0).getTime() -
            new Date(b.creationDate ?? 0).getTime()
          );
      }
    }
  );

  const leadSort = useSortableTable<Lead, LeadSortField>(
    leads.items,
    (a, b, field) => {
      switch (field) {
        case "companyName":
          return a.companyName.localeCompare(b.companyName);
        case "contactPerson":
          return (a.contactPerson || "").localeCompare(b.contactPerson || "");
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "phone":
          return (a.phone || "").localeCompare(b.phone || "");
        case "origin":
          return Number(a.origin) - Number(b.origin);
        case "emailVerified":
          return Number(a.emailVerified) - Number(b.emailVerified);
        case "creationDate":
          return (
            new Date(a.creationDate ?? 0).getTime() -
            new Date(b.creationDate ?? 0).getTime()
          );
      }
    }
  );

  if (!user) return <Loader text="" />;
  if (user.role !== UserRole.SuperAdmin) return null;

  const currentTotal = activeTab === "inquiries" ? inquiries.total : leads.total;
  const currentError = activeTab === "inquiries" ? inquiryError : leadError;
  const totalPages = currentTotal > 0 ? Math.ceil(currentTotal / pageSize) : 1;
  const currentPage = Math.min(page, totalPages);
  const rangeStart = currentTotal === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, currentTotal);

  const tableTitle =
    activeTab === "inquiries"
      ? `${t("dashboard.leads.tabs.inquiries")} (${inquiries.total})`
      : `${t("dashboard.leads.tabs.registrations")} (${leads.total})`;

  return (
    <div>
      {/* Header band */}
      <div className="border-b bg-playGrey">
        {isLoading && <Loader text={t("dashboard.leads.loading")} />}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                  <Megaphone className="h-7 w-7 text-brand-primary" />
                  {t("dashboard.leads.title")}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("dashboard.leads.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as DashboardLeadTabId)}
        >
          <TabsList className="grid grid-cols-2 w-full md:w-[480px] bg-playGrey border border-playBlueLight">
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-white data-[state=active]:text-brand-primary"
            >
              <span className="flex items-center gap-2">
                {t("dashboard.leads.tabs.inquiries")}
                <Badge variant="secondary" className="text-xs">
                  {inquiries.total}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="data-[state=active]:bg-white data-[state=active]:text-brand-primary"
            >
              <span className="flex items-center gap-2">
                {t("dashboard.leads.tabs.registrations")}
                <Badge variant="secondary" className="text-xs">
                  {leads.total}
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <Card className="border border-playBlueLight/30 bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-brand-primary">
                  {t("dashboard.leads.filters.searchLabel")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-playBlueLight" />
                  <Input
                    uppercase={false}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("dashboard.leads.filters.searchPlaceholder")}
                    className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
                  />
                </div>
              </div>

              {activeTab === "inquiries" ? (
                <div className="space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium text-brand-primary">
                    {t("dashboard.leads.filters.typeLabel")}
                  </label>
                  <Select
                    value={String(inquiryType)}
                    onValueChange={(value) =>
                      setInquiryType(
                        value === "all"
                          ? "all"
                          : (Number(value) as WebInquiryType)
                      )
                    }
                  >
                    <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value="all"
                      >
                        {t("dashboard.leads.filters.allTypes")}
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value={String(WebInquiryType.Contact)}
                      >
                        {t("dashboard.leads.types.contact")}
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value={String(WebInquiryType.Pricing)}
                      >
                        {t("dashboard.leads.types.pricing")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium text-brand-primary">
                    {t("dashboard.leads.filters.originLabel")}
                  </label>
                  <Select
                    value={String(leadOrigin)}
                    onValueChange={(value) =>
                      setLeadOrigin(
                        value === "all"
                          ? "all"
                          : (Number(value) as LeadOrigin)
                      )
                    }
                  >
                    <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value="all"
                      >
                        {t("dashboard.leads.filters.allOrigins")}
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value={String(LeadOrigin.Web)}
                      >
                        {t("dashboard.leads.origins.web")}
                      </SelectItem>
                      <SelectItem
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value={String(LeadOrigin.Landing)}
                      >
                        {t("dashboard.leads.origins.landing")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 min-w-[120px]">
                <label className="text-sm font-medium text-brand-primary">
                  {t("dashboard.leads.filters.pageSizeLabel")}
                </label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30 hover:cursor-pointer">
                    {PAGE_SIZE_OPTIONS.map((value) => (
                      <SelectItem
                        key={value}
                        className="hover:bg-playGrey hover:text-brand-primary"
                        value={String(value)}
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {t("dashboard.leads.error")}
          </div>
        )}

        {/* Table */}
        {!currentError && activeTab === "inquiries" && (
          <TableCard title={tableTitle}>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader
                    field="type"
                    sortField={inquirySort.sortField}
                    sortDirection={inquirySort.sortDirection}
                    onSort={inquirySort.handleSort}
                  >
                    {t("dashboard.leads.table.inquiries.type")}
                  </SortableHeader>
                  <SortableHeader
                    field="name"
                    sortField={inquirySort.sortField}
                    sortDirection={inquirySort.sortDirection}
                    onSort={inquirySort.handleSort}
                  >
                    {t("common.name")}
                  </SortableHeader>
                  <SortableHeader
                    field="email"
                    sortField={inquirySort.sortField}
                    sortDirection={inquirySort.sortDirection}
                    onSort={inquirySort.handleSort}
                  >
                    {t("common.email")}
                  </SortableHeader>
                  <TableHead>
                    {t("dashboard.leads.table.inquiries.detail")}
                  </TableHead>
                  <SortableHeader
                    field="creationDate"
                    sortField={inquirySort.sortField}
                    sortDirection={inquirySort.sortDirection}
                    onSort={inquirySort.handleSort}
                  >
                    {t("common.date")}
                  </SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquirySort.sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {t("dashboard.leads.emptyInquiries")}
                    </TableCell>
                  </TableRow>
                ) : (
                  inquirySort.sortedData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-playOrange/5 transition-colors">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            item.type === WebInquiryType.Contact
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-playOrange/40 bg-playOrange/10 text-playOrange"
                          }
                        >
                          {item.type === WebInquiryType.Contact
                            ? t("dashboard.leads.types.contact")
                            : t("dashboard.leads.types.pricing")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.name ?? (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-brand-primary hover:underline"
                        >
                          {item.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.type === WebInquiryType.Contact ? (
                          item.message ?? (
                            <span className="text-muted-foreground">-</span>
                          )
                        ) : item.pricingDataJson ? (
                          <PricingSummary json={item.pricingDataJson} />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(item.creationDate)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableCard>
        )}

        {!currentError && activeTab === "registrations" && (
          <TableCard title={tableTitle}>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader
                    field="companyName"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("dashboard.leads.table.registrations.company")}
                  </SortableHeader>
                  <SortableHeader
                    field="contactPerson"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("dashboard.leads.table.registrations.contact")}
                  </SortableHeader>
                  <SortableHeader
                    field="email"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("common.email")}
                  </SortableHeader>
                  <SortableHeader
                    field="phone"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("common.phone")}
                  </SortableHeader>
                  <SortableHeader
                    field="origin"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("dashboard.leads.table.registrations.origin")}
                  </SortableHeader>
                  <SortableHeader
                    field="emailVerified"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                    className="text-center"
                  >
                    {t("dashboard.leads.table.registrations.verified")}
                  </SortableHeader>
                  <SortableHeader
                    field="creationDate"
                    sortField={leadSort.sortField}
                    sortDirection={leadSort.sortDirection}
                    onSort={leadSort.handleSort}
                  >
                    {t("common.date")}
                  </SortableHeader>
                  <TableHead className="text-right">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadSort.sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {t("dashboard.leads.emptyRegistrations")}
                    </TableCell>
                  </TableRow>
                ) : (
                  leadSort.sortedData.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-playOrange/5 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {lead.companyName}
                      </TableCell>
                      <TableCell>{lead.contactPerson}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-brand-primary hover:underline"
                        >
                          {lead.email}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {lead.phone}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {lead.origin === LeadOrigin.Web
                            ? t("dashboard.leads.origins.web")
                            : t("dashboard.leads.origins.landing")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {lead.emailVerified ? (
                          <Badge
                            variant="outline"
                            className="border-success/40 bg-success/10 text-success"
                          >
                            {t("common.yes")}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {t("common.no")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(lead.creationDate)}
                      </TableCell>
                      <TableCell
                        className="text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setQuoteLead({
                              id: lead.id!,
                              companyName: lead.companyName,
                            })
                          }
                          className="gap-1 border-playOrange text-playOrange hover:bg-playOrange/10"
                        >
                          <FileText className="h-3 w-3" />
                          {t("quotes.actions.createFromLead")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableCard>
        )}

        {/* Pagination */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">
            {currentTotal === 0
              ? t("dashboard.leads.pagination.empty")
              : t("dashboard.leads.pagination.summary", {
                  from: rangeStart,
                  to: rangeEnd,
                  total: currentTotal,
                })}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="border-playBlueLight"
            >
              {t("common.previous")}
            </Button>
            <span className="text-sm text-muted-foreground min-w-20 text-center">
              {t("dashboard.leads.pagination.page", {
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages}
              className="border-playBlueLight"
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      </div>

      <QuoteForm
        isOpen={!!quoteLead}
        onClose={() => setQuoteLead(null)}
        fixedLead={quoteLead ?? undefined}
        onSubmit={async (data: CreateQuoteRequest) => {
          try {
            const service = new QuoteService();
            const created = await service.create(data);
            toast({
              title: t("quotes.created"),
              description: t("quotes.createdDesc", { reference: created.data.reference }),
            });
            router.push(`/dashboard/quotes/${created.data.id}`);
          } catch {
            toast({
              title: t("errors.generic"),
              description: t("quotes.createError"),
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}

interface PricingData {
  siteMode?: "single" | "multiple";
  siteCount?: number;
  contractors?: number;
  estimatedPrice?: number;
  isCustom?: boolean;
}

function PricingSummary({ json }: { json: string }) {
  try {
    const data = JSON.parse(json) as PricingData;
    const sites =
      data.siteMode === "multiple" ? `${data.siteCount} sedes` : "1 sede";
    const price = data.isCustom
      ? "Enterprise"
      : `EUR ${data.estimatedPrice}/mes`;

    return (
      <span className="text-muted-foreground">
        {sites} · {data.contractors} contratas · {price}
      </span>
    );
  } catch {
    return <span className="text-muted-foreground">-</span>;
  }
}
