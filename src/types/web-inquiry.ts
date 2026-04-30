import { BaseEntity } from "./baseEntity";
import { PagedResult } from "./pagination";

export enum WebInquiryType {
  Contact = 0,
  Pricing = 1,
}

export interface WebInquiry extends BaseEntity {
  type: WebInquiryType;
  name?: string;
  email: string;
  message?: string;
  pricingDataJson?: string;
}

export interface WebInquiryListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: WebInquiryType;
}

export type WebInquiryPagedResult = PagedResult<WebInquiry>;
