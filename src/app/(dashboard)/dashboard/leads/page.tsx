"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  DashboardLeadTabId,
  InquiryTypeFilter,
  LeadOriginFilter,
  useDashboardLeads,
} from "@/hooks/useDashboardLeads";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";
import { LeadOrigin } from "@/types/lead";
import { WebInquiryType } from "@/types/web-inquiry";
import { formatDate } from "@/app/utils/date";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

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

  const tabs = useMemo(
    () => [
      {
        id: "inquiries" as const,
        label: t("dashboard.leads.tabs.inquiries"),
        count: inquiries.total,
      },
      {
        id: "registrations" as const,
        label: t("dashboard.leads.tabs.registrations"),
        count: leads.total,
      },
    ],
    [inquiries.total, leads.total, t]
  );

  if (!user) return <Loader text="" />;
  if (user.role !== UserRole.SuperAdmin) return null;

  const currentTotal = activeTab === "inquiries" ? inquiries.total : leads.total;
  const currentItems = activeTab === "inquiries" ? inquiries.items : leads.items;
  const currentError = activeTab === "inquiries" ? inquiryError : leadError;
  const totalPages =
    currentTotal > 0 ? Math.ceil(currentTotal / pageSize) : 1;
  const currentPage = Math.min(page, totalPages);
  const rangeStart = currentTotal === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, currentTotal);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.leads.title")}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {t("dashboard.leads.subtitle")}
        </p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-end md:justify-between">
        <div className="grid gap-3 md:grid-cols-[minmax(280px,1fr)_180px] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("dashboard.leads.filters.searchLabel")}
            </label>
            <Input
              uppercase={false}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("dashboard.leads.filters.searchPlaceholder")}
            />
          </div>

          {activeTab === "inquiries" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("dashboard.leads.filters.typeLabel")}
              </label>
              <select
                value={String(inquiryType)}
                onChange={(event) =>
                  setInquiryType(
                    event.target.value === "all"
                      ? "all"
                      : Number(event.target.value) as WebInquiryType
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">{t("dashboard.leads.filters.allTypes")}</option>
                <option value={String(WebInquiryType.Contact)}>
                  {t("dashboard.leads.types.contact")}
                </option>
                <option value={String(WebInquiryType.Pricing)}>
                  {t("dashboard.leads.types.pricing")}
                </option>
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("dashboard.leads.filters.originLabel")}
              </label>
              <select
                value={String(leadOrigin)}
                onChange={(event) =>
                  setLeadOrigin(
                    event.target.value === "all"
                      ? "all"
                      : Number(event.target.value) as LeadOrigin
                  )
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">{t("dashboard.leads.filters.allOrigins")}</option>
                <option value={String(LeadOrigin.Web)}>
                  {t("dashboard.leads.origins.web")}
                </option>
                <option value={String(LeadOrigin.Landing)}>
                  {t("dashboard.leads.origins.landing")}
                </option>
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("dashboard.leads.filters.pageSizeLabel")}
            </label>
            <select
              value={String(pageSize)}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {PAGE_SIZE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading && <Loader text={t("dashboard.leads.loading")} />}

      {currentError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {t("dashboard.leads.error")}
        </div>
      )}

      {!isLoading && !currentError && activeTab === "inquiries" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.inquiries.type")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.name")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.email")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.inquiries.detail")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.date")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    {t("dashboard.leads.emptyInquiries")}
                  </td>
                </tr>
              ) : (
                inquiries.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.type === WebInquiryType.Contact
                            ? "bg-blue-100 text-blue-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.type === WebInquiryType.Contact
                          ? t("dashboard.leads.types.contact")
                          : t("dashboard.leads.types.pricing")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.name ?? <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${item.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {item.type === WebInquiryType.Contact ? (
                        item.message ?? <span className="text-gray-400">-</span>
                      ) : item.pricingDataJson ? (
                        <PricingSummary json={item.pricingDataJson} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(item.creationDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !currentError && activeTab === "registrations" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.registrations.company")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.registrations.contact")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.email")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.phone")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.registrations.origin")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("dashboard.leads.table.registrations.verified")}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {t("common.date")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    {t("dashboard.leads.emptyRegistrations")}
                  </td>
                </tr>
              ) : (
                leads.items.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {lead.companyName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {lead.contactPerson}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                        {lead.origin === LeadOrigin.Web
                          ? t("dashboard.leads.origins.web")
                          : t("dashboard.leads.origins.landing")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.emailVerified ? (
                        <span className="text-green-600 font-medium">
                          {t("common.yes")}
                        </span>
                      ) : (
                        <span className="text-gray-400">{t("common.no")}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {formatDate(lead.creationDate)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-gray-500">
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
          >
            {t("common.previous")}
          </Button>
          <span className="text-sm text-gray-600 min-w-20 text-center">
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
          >
            {t("common.next")}
          </Button>
        </div>
      </div>
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
      <span className="text-gray-600">
        {sites} · {data.contractors} contratas · {price}
      </span>
    );
  } catch {
    return <span className="text-gray-400">-</span>;
  }
}
