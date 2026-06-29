"use client";

import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Filter, Megaphone, Pencil, Plus, Rocket, Search, ShieldCheck, ShieldOff, Trash2, X } from "lucide-react";

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
import { Lead, LeadOrigin, LeadListItem, LeadStatus } from "@/types/lead";
import { WebInquiry, WebInquiryType } from "@/types/web-inquiry";

import { LeadService } from "@/services/lead.service";
import { QuoteService } from "@/services/quote.service";
import { WebInquiryService } from "@/services/web-inquiry.service";

import { formatDate } from "@/app/utils/date";
import Loader from "@/components/Loader";
import { LeadDetailPanel } from "@/components/LeadDetailPanel";
import { LeadForm } from "@/components/LeadForm";
import { LeadStatusCell } from "@/components/LeadStatusCell";
import { QuoteGeneratorWizard } from "@/components/QuoteGenerator";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Switch } from "@/components/ui/Switch";

const leadService = new LeadService();

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const LEAD_STATUS_CHIPS: { value: LeadStatus; label: string }[] = [
  { value: LeadStatus.New, label: "Nuevo" },
  { value: LeadStatus.Contacted, label: "Contactado" },
  { value: LeadStatus.QuoteSent, label: "Presupuesto enviado" },
  { value: LeadStatus.PendingClaim, label: "Pendiente reclamar" },
  { value: LeadStatus.Converted, label: "Convertido" },
  { value: LeadStatus.Rejected, label: "Rechazado" },
  { value: LeadStatus.Lost, label: "Perdido" },
];

type InquirySortField = "type" | "name" | "email" | "phone" | "creationDate";
type LeadSortField =
  | "companyName"
  | "contactPerson"
  | "email"
  | "phone"
  | "origin"
  | "status"
  | "emailVerified"
  | "creationDate"
  | "lastEventDate";

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
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [hideRegistered, setHideRegistered] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadListItem | null>(null);
  const [quoteLead, setQuoteLead] = useState<{ id: string; companyName: string } | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [inquiryToConvert, setInquiryToConvert] = useState<WebInquiry | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<WebInquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [onboardTarget, setOnboardTarget] = useState<LeadListItem | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<LeadListItem | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<LeadListItem | null>(null);
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [deleteUserToo, setDeleteUserToo] = useState(false);

  const { inquiries, leads, inquiryError, leadError, isLoading, mutateLeads, mutateInquiries } =
    useDashboardLeads({
      activeTab,
      page,
      pageSize,
      search,
      inquiryType,
      leadOrigin,
      leadStatuses,
      hideRegistered,
    });

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, pageSize, inquiryType, leadOrigin, leadStatuses, hideRegistered]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPage(1), 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const handleStatusUpdated = useCallback(
    (leadId: string, newStatus: LeadStatus) => {
      mutateLeads((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === leadId ? { ...item, status: newStatus } : item
          ),
        };
      }, false);

      setSelectedLead((prev) =>
        prev?.id === leadId ? { ...prev, status: newStatus } : prev
      );
    },
    [mutateLeads]
  );

  const handleEmailVerified = useCallback(
    (leadId: string, verified: boolean) => {
      mutateLeads((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === leadId ? { ...item, emailVerified: verified } : item
          ),
        };
      }, false);

      setSelectedLead((prev) =>
        prev?.id === leadId ? { ...prev, emailVerified: verified } : prev
      );
    },
    [mutateLeads]
  );

  const handleToggleEmailVerified = useCallback(
    async (lead: LeadListItem) => {
      const action = lead.emailVerified
        ? leadService.deactivate(lead.id!)
        : leadService.activate(lead.id!);
      try {
        await action;
        handleEmailVerified(lead.id!, !lead.emailVerified);
      } catch {
        /* noop */
      }
    },
    [handleEmailVerified]
  );

  const handleDeleteInquiry = useCallback(async () => {
    if (!inquiryToDelete?.id) return;
    setIsDeleting(true);
    try {
      const service = new WebInquiryService();
      await service.delete(inquiryToDelete.id);
      mutateInquiries((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.filter((i) => i.id !== inquiryToDelete.id),
          total: current.total - 1,
        };
      }, false);
      toast({ title: "Contacto eliminado" });
    } catch {
      toast({ title: "Error al eliminar", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setInquiryToDelete(null);
    }
  }, [inquiryToDelete, mutateInquiries]);

  const handleDeleteLead = useCallback(async () => {
    if (!leadToDelete?.id) return;
    const alsoDeleteUser = deleteUserToo && !!leadToDelete.userId;
    setIsDeletingLead(true);
    try {
      await leadService.delete(leadToDelete.id, alsoDeleteUser);
      mutateLeads((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.filter((i) => i.id !== leadToDelete.id),
          total: current.total - 1,
        };
      }, false);
      if (selectedLead?.id === leadToDelete.id) setSelectedLead(null);
      toast({
        title: alsoDeleteUser ? "Lead y usuario eliminados" : "Lead eliminado",
      });
    } catch {
      toast({ title: "Error al eliminar el lead", variant: "destructive" });
    } finally {
      setIsDeletingLead(false);
      setLeadToDelete(null);
      setDeleteUserToo(false);
    }
  }, [leadToDelete, deleteUserToo, mutateLeads, selectedLead]);

  const handleLeadUpdated = useCallback(
    (lead: Lead) => {
      mutateLeads((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === lead.id ? { ...item, ...lead } : item
          ),
        };
      }, false);
      setSelectedLead((prev) => (prev?.id === lead.id ? { ...prev, ...lead } : prev));
    },
    [mutateLeads]
  );

  const handleOnboardClient = useCallback(async () => {
    if (!onboardTarget?.id) return;
    setIsOnboarding(true);
    try {
      const response = await leadService.onboardClient(onboardTarget.id);
      mutateLeads((current) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) =>
            item.id === onboardTarget.id
              ? { ...item, userId: response.data.userId, emailVerified: true, status: response.data.status }
              : item
          ),
        };
      }, false);
      toast({ title: "Cliente activado. Se ha enviado el email de acceso." });
    } catch {
      toast({ title: "Error al activar el cliente", variant: "destructive" });
    } finally {
      setIsOnboarding(false);
      setOnboardTarget(null);
    }
  }, [onboardTarget, mutateLeads]);

  const activeFilterCount =
    activeTab === "inquiries"
      ? (inquiryType !== "all" ? 1 : 0)
      : leadStatuses.length + (leadOrigin !== "all" ? 1 : 0) + (hideRegistered ? 1 : 0);

  const clearAllFilters = useCallback(() => {
    setLeadStatuses([]);
    setLeadOrigin("all");
    setHideRegistered(false);
    setInquiryType("all");
  }, []);

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
        case "phone":
          return (a.phone || "").localeCompare(b.phone || "");
        case "creationDate":
          return dayjs(a.creationDate).valueOf() - dayjs(b.creationDate).valueOf();
      }
    }
  );

  const leadSort = useSortableTable<LeadListItem, LeadSortField>(
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
        case "status":
          return Number(a.status) - Number(b.status);
        case "emailVerified":
          return Number(a.emailVerified) - Number(b.emailVerified);
        case "creationDate":
          return dayjs(a.creationDate).valueOf() - dayjs(b.creationDate).valueOf();
        case "lastEventDate":
          return dayjs(a.lastEventDate ?? 0).valueOf() - dayjs(b.lastEventDate ?? 0).valueOf();
      }
    },
    { initialSortField: "lastEventDate", initialSortDirection: "desc" }
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
      {/* Header */}
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
              <Button
                type="button"
                onClick={() => setIsLeadFormOpen(true)}
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("leads.form.createTitle")}
              </Button>
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
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
                <Input
                  uppercase={false}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("dashboard.leads.filters.searchPlaceholder")}
                  className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 border-playBlueLight shrink-0">
                    <Filter className="h-4 w-4 text-brand-primary" />
                    Filtros
                    {activeFilterCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-brand-primary text-white text-xs px-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-brand-primary flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filtros
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6">
                    {activeTab === "inquiries" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-primary">
                          {t("dashboard.leads.filters.typeLabel")}
                        </label>
                        <Select
                          value={String(inquiryType)}
                          onValueChange={(value) =>
                            setInquiryType(value === "all" ? "all" : (Number(value) as WebInquiryType))
                          }
                        >
                          <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-playBlueLight/30">
                            <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="all">
                              {t("dashboard.leads.filters.allTypes")}
                            </SelectItem>
                            <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value={String(WebInquiryType.Contact)}>
                              {t("dashboard.leads.types.contact")}
                            </SelectItem>
                            <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value={String(WebInquiryType.Pricing)}>
                              {t("dashboard.leads.types.pricing")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <label className="text-sm font-medium text-brand-primary">Estado</label>
                          <div className="flex flex-wrap gap-2">
                            {LEAD_STATUS_CHIPS.map((opt) => {
                              const active = leadStatuses.includes(opt.value);
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() =>
                                    setLeadStatuses((prev) =>
                                      prev.includes(opt.value)
                                        ? prev.filter((s) => s !== opt.value)
                                        : [...prev, opt.value]
                                    )
                                  }
                                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                                    active
                                      ? "bg-brand-primary text-white border-brand-primary"
                                      : "bg-white text-muted-foreground border-playBlueLight hover:border-brand-primary hover:text-brand-primary"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-brand-primary">
                            {t("dashboard.leads.filters.originLabel")}
                          </label>
                          <Select
                            value={String(leadOrigin)}
                            onValueChange={(value) =>
                              setLeadOrigin(value === "all" ? "all" : (Number(value) as LeadOrigin))
                            }
                          >
                            <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-playBlueLight/30">
                              <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value="all">
                                {t("dashboard.leads.filters.allOrigins")}
                              </SelectItem>
                              <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value={String(LeadOrigin.Web)}>
                                {t("dashboard.leads.origins.web")}
                              </SelectItem>
                              <SelectItem className="hover:bg-playGrey hover:text-brand-primary" value={String(LeadOrigin.Landing)}>
                                {t("dashboard.leads.origins.landing")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <label className="text-sm font-medium text-brand-primary">
                            Solo leads activas
                          </label>
                          <Switch
                            checked={!hideRegistered}
                            onCheckedChange={(checked) => setHideRegistered(!checked)}
                            className="data-[state=checked]:bg-brand-primary"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2 pt-4 border-t border-playBlueLight/20">
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
                        <SelectContent className="bg-white border border-playBlueLight/30">
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

                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="w-full text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg py-2 transition-colors"
                      >
                        Limpiar todos los filtros
                      </button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-playBlueLight/20">
                {leadStatuses.map((s) => {
                  const label = LEAD_STATUS_CHIPS.find((c) => c.value === s)?.label ?? String(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLeadStatuses((prev) => prev.filter((x) => x !== s))}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      {label}
                      <X className="h-3 w-3" />
                    </button>
                  );
                })}
                {leadOrigin !== "all" && (
                  <button
                    type="button"
                    onClick={() => setLeadOrigin("all")}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    {leadOrigin === LeadOrigin.Web ? t("dashboard.leads.origins.web") : t("dashboard.leads.origins.landing")}
                    <X className="h-3 w-3" />
                  </button>
                )}
                {hideRegistered && (
                  <button
                    type="button"
                    onClick={() => setHideRegistered(false)}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    Solo inactivas
                    <X className="h-3 w-3" />
                  </button>
                )}
                {inquiryType !== "all" && (
                  <button
                    type="button"
                    onClick={() => setInquiryType("all")}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    {inquiryType === WebInquiryType.Contact ? t("dashboard.leads.types.contact") : t("dashboard.leads.types.pricing")}
                    <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-red-600 ml-1 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {currentError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {t("dashboard.leads.error")}
          </div>
        )}

        {/* Inquiries table */}
        {!currentError && activeTab === "inquiries" && (
          <TableCard title={tableTitle}>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="type" sortField={inquirySort.sortField} sortDirection={inquirySort.sortDirection} onSort={inquirySort.handleSort}>
                    {t("dashboard.leads.table.inquiries.type")}
                  </SortableHeader>
                  <SortableHeader field="name" sortField={inquirySort.sortField} sortDirection={inquirySort.sortDirection} onSort={inquirySort.handleSort}>
                    {t("common.name")}
                  </SortableHeader>
                  <SortableHeader field="email" sortField={inquirySort.sortField} sortDirection={inquirySort.sortDirection} onSort={inquirySort.handleSort}>
                    {t("common.email")}
                  </SortableHeader>
                  <SortableHeader field="phone" sortField={inquirySort.sortField} sortDirection={inquirySort.sortDirection} onSort={inquirySort.handleSort}>
                    {t("common.phone")}
                  </SortableHeader>
                  <TableHead>{t("dashboard.leads.table.inquiries.detail")}</TableHead>
                  <SortableHeader field="creationDate" sortField={inquirySort.sortField} sortDirection={inquirySort.sortDirection} onSort={inquirySort.handleSort}>
                    {t("common.date")}
                  </SortableHeader>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquirySort.sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
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
                      <TableCell>{item.name ?? <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>
                        <a href={`mailto:${item.email}`} className="text-brand-primary hover:underline">
                          {item.email}
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {item.phone ? (
                          <a href={`tel:${item.phone}`} className="text-brand-primary hover:underline">
                            {item.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.type === WebInquiryType.Contact ? (
                          item.message ?? <span className="text-muted-foreground">-</span>
                        ) : item.pricingDataJson ? (
                          <PricingSummary json={item.pricingDataJson} />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(item.creationDate)}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setInquiryToConvert(item)}
                            disabled={!!item.isConverted}
                            className="gap-1 border-brand-primary text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {item.isConverted ? "Convertido" : t("leads.actions.convertToLead")}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setInquiryToDelete(item)}
                            className="gap-1 border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableCard>
        )}

        {/* Leads CRM table */}
        {!currentError && activeTab === "registrations" && (
          <TableCard title={tableTitle}>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="companyName" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    {t("dashboard.leads.table.registrations.company")}
                  </SortableHeader>
                  <SortableHeader field="status" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    Estado
                  </SortableHeader>
                  <SortableHeader field="contactPerson" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    {t("dashboard.leads.table.registrations.contact")}
                  </SortableHeader>
                  <SortableHeader field="phone" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    {t("common.phone")}
                  </SortableHeader>
                  <SortableHeader field="origin" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    {t("dashboard.leads.table.registrations.origin")}
                  </SortableHeader>
                  <SortableHeader field="emailVerified" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    Activa
                  </SortableHeader>
                  <SortableHeader field="creationDate" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    {t("common.date")}
                  </SortableHeader>
                  <SortableHeader field="lastEventDate" sortField={leadSort.sortField} sortDirection={leadSort.sortDirection} onSort={leadSort.handleSort}>
                    Último cambio
                  </SortableHeader>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadSort.sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                      {t("dashboard.leads.emptyRegistrations")}
                    </TableCell>
                  </TableRow>
                ) : (
                  leadSort.sortedData.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-playOrange/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <TableCell className="font-medium">{lead.companyName}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <LeadStatusCell
                          status={lead.status}
                          lastEventType={lead.lastEventType}
                          lastEventDate={lead.lastEventDate}
                          lastEventPreviousStatus={lead.lastEventPreviousStatus}
                          lastEventNewStatus={lead.lastEventNewStatus}
                          lastNote={lead.lastNote}
                        />
                      </TableCell>
                      <TableCell>{lead.contactPerson}</TableCell>
                      <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {lead.origin === LeadOrigin.Web
                            ? t("dashboard.leads.origins.web")
                            : t("dashboard.leads.origins.landing")}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          title={lead.emailVerified ? "Desactivar cuenta" : "Activar cuenta"}
                          onClick={() => handleToggleEmailVerified(lead)}
                          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${
                            lead.emailVerified
                              ? "bg-playGreen/15 text-playGreen hover:bg-red-50 hover:text-red-600"
                              : "bg-gray-100 text-muted-foreground hover:bg-playGreen/15 hover:text-playGreen"
                          }`}
                        >
                          {lead.emailVerified ? (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          ) : (
                            <ShieldOff className="h-3.5 w-3.5" />
                          )}
                          {lead.emailVerified ? "Sí" : "No"}
                        </button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(lead.creationDate)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {lead.lastEventDate ? formatDate(lead.lastEventDate) : <span>—</span>}
                      </TableCell>
                      <TableCell
                        className="text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {!lead.userId && (
                            <Button
                              type="button"
                              size="sm"
                              title="Activar cliente"
                              onClick={() => setOnboardTarget(lead)}
                              className="gap-1 bg-playGreen hover:bg-playGreen/90 text-white"
                            >
                              <Rocket className="h-3 w-3" />
                              Activar
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title={t("quotes.actions.createFromLead")}
                            onClick={() => setQuoteLead({ id: lead.id!, companyName: lead.companyName })}
                            className="border-playOrange text-playOrange hover:bg-playOrange/10"
                          >
                            <FileText className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Editar lead"
                            onClick={() => setLeadToEdit(lead)}
                            className="border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Eliminar lead"
                            onClick={() => setLeadToDelete(lead)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
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

      <LeadForm
        isOpen={isLeadFormOpen || !!inquiryToConvert}
        onClose={() => {
          setIsLeadFormOpen(false);
          setInquiryToConvert(null);
        }}
        initialEmail={inquiryToConvert?.email ?? undefined}
        initialContactPerson={inquiryToConvert?.name ?? undefined}
        sourceInquiryId={inquiryToConvert?.id ?? undefined}
        onCreated={() => {
          setActiveTab("registrations");
          mutateLeads();
          mutateInquiries();
        }}
      />

      <LeadForm
        isOpen={!!leadToEdit}
        onClose={() => setLeadToEdit(null)}
        leadToEdit={leadToEdit ?? undefined}
        onUpdated={(lead) => {
          handleLeadUpdated(lead);
          setLeadToEdit(null);
        }}
      />

      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusUpdated={handleStatusUpdated}
        onEmailVerified={handleEmailVerified}
        onLeadChanged={mutateLeads}
      />

      <Dialog open={!!inquiryToDelete} onOpenChange={(open) => { if (!open) setInquiryToDelete(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar contacto?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente el contacto de{" "}
              <span className="font-medium text-foreground">{inquiryToDelete?.name ?? inquiryToDelete?.email}</span>.
              No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setInquiryToDelete(null)}
              disabled={isDeleting}
              className="border-playBlueLight"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDeleteInquiry}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!leadToDelete} onOpenChange={(open) => { if (!open) { setLeadToDelete(null); setDeleteUserToo(false); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Eliminar lead?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará permanentemente el lead de{" "}
              <span className="font-medium text-foreground">{leadToDelete?.companyName}</span>.
              No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {leadToDelete?.userId && (
            <label className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteUserToo}
                onChange={(e) => setDeleteUserToo(e.target.checked)}
                disabled={isDeletingLead}
                className="mt-0.5 h-4 w-4 accent-red-600"
              />
              <span className="text-sm text-red-700">
                <span className="font-medium">Eliminar también el usuario y todos sus datos</span>
                <br />
                Se borrarán su empresa, sedes, trabajadores, documentos, licencia y todo lo
                asociado. Esta acción es irreversible.
              </span>
            </label>
          )}
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLeadToDelete(null)}
              disabled={isDeletingLead}
              className="border-playBlueLight"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleDeleteLead}
              disabled={isDeletingLead}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeletingLead ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!onboardTarget} onOpenChange={(open) => { if (!open) setOnboardTarget(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Activar cliente?</DialogTitle>
            <DialogDescription>
              Se creará el usuario, empresa, sede y licencia para{" "}
              <span className="font-medium text-foreground">{onboardTarget?.companyName}</span>.
              Se enviará un email con acceso temporal al correo{" "}
              <span className="font-medium text-foreground">{onboardTarget?.email}</span>.
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOnboardTarget(null)}
              disabled={isOnboarding}
              className="border-playBlueLight"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleOnboardClient}
              disabled={isOnboarding}
              className="bg-playGreen hover:bg-playGreen/90 text-white gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isOnboarding ? "Activando..." : "Sí, activar cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuoteGeneratorWizard
        isOpen={!!quoteLead}
        onClose={() => setQuoteLead(null)}
        fixedLead={quoteLead ?? undefined}
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
}

interface PricingData {
  siteMode?: "single" | "multiple";
  SiteMode?: "single" | "multiple";
  siteCount?: number;
  SiteCount?: number;
  contractors?: number;
  Contractors?: number;
  estimatedPrice?: number;
  EstimatedPrice?: number;
  isCustom?: boolean;
  IsCustom?: boolean;
}

function PricingSummary({ json }: { json: string }) {
  try {
    const data = JSON.parse(json) as PricingData;
    const siteMode = data.siteMode ?? data.SiteMode;
    const siteCount = data.siteCount ?? data.SiteCount ?? 1;
    const contractors = data.contractors ?? data.Contractors ?? 0;
    const estimatedPrice = data.estimatedPrice ?? data.EstimatedPrice;
    const isCustom = data.isCustom ?? data.IsCustom ?? false;
    const sites = siteMode === "multiple" ? `${siteCount} sedes` : "1 sede";
    const price = isCustom || estimatedPrice === undefined ? "Enterprise" : `EUR ${estimatedPrice}/mes`;
    return (
      <span className="text-muted-foreground">
        {sites} · {contractors} contratas · {price}
      </span>
    );
  } catch {
    return <span className="text-muted-foreground">-</span>;
  }
}
