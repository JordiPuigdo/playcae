import { ApiResponse } from "@/interfaces/api-response";
import { PendingDocumentValidationItem } from "@/types/pendingValidation";
import { HttpClient } from "./http-client";

export interface PendingValidationQueryParams {
  includeActionRequired?: boolean;
  includeSubcontractors?: boolean;
  page?: number;
  pageSize?: number;
}

export interface IPendingValidationService {
  getByAdminUserId(
    adminUserId: string,
    params?: PendingValidationQueryParams
  ): Promise<ApiResponse<PendingDocumentValidationItem[]>>;
}

export class PendingValidationService implements IPendingValidationService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API +
    "/api/admin/pending-document-validations";

  constructor(private readonly httpClient: HttpClient) {}

  async getByAdminUserId(
    adminUserId: string,
    params: PendingValidationQueryParams = {}
  ): Promise<ApiResponse<PendingDocumentValidationItem[]>> {
    const searchParams = new URLSearchParams();

    if (typeof params.includeActionRequired === "boolean") {
      searchParams.append(
        "includeActionRequired",
        String(params.includeActionRequired)
      );
    }
    if (typeof params.includeSubcontractors === "boolean") {
      searchParams.append(
        "includeSubcontractors",
        String(params.includeSubcontractors)
      );
    }
    if (typeof params.page === "number") {
      searchParams.append("page", String(params.page));
    }
    if (typeof params.pageSize === "number") {
      searchParams.append("pageSize", String(params.pageSize));
    }

    const query = searchParams.toString();
    const suffix = query ? `?${query}` : "";

    return this.httpClient.get<PendingDocumentValidationItem[]>(
      `${this.baseUrl}/by-admin/${adminUserId}${suffix}`
    );
  }
}
