"use client";

import { useDeferredValue, useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/interfaces/api-response";
import {
  LeadOrigin,
  LeadListQuery,
  LeadPagedResult,
  LeadStatus,
} from "@/types/lead";
import {
  WebInquiryListQuery,
  WebInquiryPagedResult,
  WebInquiryType,
} from "@/types/web-inquiry";
import { LeadService } from "@/services/lead.service";
import { WebInquiryService } from "@/services/web-inquiry.service";

export type DashboardLeadTabId = "inquiries" | "registrations";
export type InquiryTypeFilter = "all" | WebInquiryType;
export type LeadOriginFilter = "all" | LeadOrigin;

interface UseDashboardLeadsParams {
  activeTab: DashboardLeadTabId;
  page: number;
  pageSize: number;
  search: string;
  inquiryType: InquiryTypeFilter;
  leadOrigin: LeadOriginFilter;
  leadStatuses: LeadStatus[];
  hideRegistered: boolean;
}

const leadService = new LeadService();
const webInquiryService = new WebInquiryService();

const emptyLeadResult: LeadPagedResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
};

const emptyInquiryResult: WebInquiryPagedResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
};

export function useDashboardLeads(params: UseDashboardLeadsParams) {
  const deferredSearch = useDeferredValue(params.search);

  const normalizedSearch = useMemo(() => {
    const value = deferredSearch.trim();
    return value.length > 0 ? value : undefined;
  }, [deferredSearch]);

  const inquiryQuery = useMemo<WebInquiryListQuery>(
    () => ({
      page: params.page,
      pageSize: params.pageSize,
      search: normalizedSearch,
      type: params.inquiryType === "all" ? undefined : params.inquiryType,
    }),
    [normalizedSearch, params.inquiryType, params.page, params.pageSize]
  );

  const leadQuery = useMemo<LeadListQuery>(
    () => ({
      page: params.page,
      pageSize: params.pageSize,
      search: normalizedSearch,
      origin: params.leadOrigin === "all" ? undefined : params.leadOrigin,
      statuses: params.leadStatuses.length ? params.leadStatuses : undefined,
      hideRegistered: params.hideRegistered,
    }),
    [normalizedSearch, params.leadOrigin, params.leadStatuses, params.hideRegistered, params.page, params.pageSize]
  );

  const {
    data: inquiries = emptyInquiryResult,
    error: inquiriesError,
    isLoading: inquiriesLoading,
    isValidating: inquiriesValidating,
    mutate: mutateInquiries,
  } = useSWR<WebInquiryPagedResult, ApiError>(
    ["dashboard-web-inquiries", inquiryQuery],
    async () => {
      const response = await webInquiryService.getAll(inquiryQuery);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 2,
      dedupingInterval: 500,
    }
  );

  const {
    data: leads = emptyLeadResult,
    error: leadsError,
    isLoading: leadsLoading,
    isValidating: leadsValidating,
    mutate: mutateLeads,
  } = useSWR<LeadPagedResult, ApiError>(
    ["dashboard-leads", leadQuery],
    async () => {
      const response = await leadService.getAll(leadQuery);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 2,
      dedupingInterval: 500,
    }
  );

  return {
    inquiries,
    leads,
    inquiryError: inquiriesError,
    leadError: leadsError,
    isLoading:
      params.activeTab === "inquiries" ? inquiriesLoading : leadsLoading,
    isValidating:
      params.activeTab === "inquiries" ? inquiriesValidating : leadsValidating,
    refresh: async () => {
      await Promise.all([mutateInquiries(), mutateLeads()]);
    },
    mutateLeads,
    mutateInquiries,
  };
}
