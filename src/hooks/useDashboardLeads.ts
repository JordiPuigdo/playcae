"use client";

import { useDeferredValue, useMemo } from "react";
import useSWR from "swr";
import { ApiError } from "@/interfaces/api-response";
import {
  LeadOrigin,
  LeadListQuery,
  LeadPagedResult,
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
    }),
    [normalizedSearch, params.leadOrigin, params.page, params.pageSize]
  );

  const {
    data: inquiries = emptyInquiryResult,
    error: inquiriesError,
    isValidating: inquiriesLoading,
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
    }
  );

  const {
    data: leads = emptyLeadResult,
    error: leadsError,
    isValidating: leadsLoading,
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
    }
  );

  return {
    inquiries,
    leads,
    inquiryError: inquiriesError,
    leadError: leadsError,
    isLoading:
      params.activeTab === "inquiries" ? inquiriesLoading : leadsLoading,
    refresh: async () => {
      await Promise.all([mutateInquiries(), mutateLeads()]);
    },
  };
}
