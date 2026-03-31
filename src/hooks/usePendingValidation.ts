import useSWR, { mutate as globalMutate } from "swr";
import { ApiError } from "@/interfaces/api-response";
import {
  PendingValidationQueryParams,
  PendingValidationService,
} from "@/services/pending-validation.service";
import { HttpClient } from "@/services/http-client";
import { PendingDocumentValidationItem } from "@/types/pendingValidation";

const PENDING_VALIDATION_KEY = "/api/admin/pending-document-validations";

export const usePendingValidation = (
  adminUserId?: string,
  params: PendingValidationQueryParams = {}
) => {
  const pendingValidationService = new PendingValidationService(new HttpClient());

  const {
    data: items = [],
    mutate,
    error,
    isValidating,
  } = useSWR<PendingDocumentValidationItem[], ApiError>(
    adminUserId
      ? [
          PENDING_VALIDATION_KEY,
          adminUserId,
          params.includeActionRequired,
          params.includeSubcontractors,
          params.page,
          params.pageSize,
        ]
      : null,
    async () => {
      const response = await pendingValidationService.getByAdminUserId(
        adminUserId!,
        params
      );
      return response.data || [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    }
  );

  return {
    items,
    isLoading: isValidating && !items.length,
    isRefreshing: isValidating,
    error,
    refresh: mutate,
  };
};

export const revalidatePendingValidation = () => {
  return globalMutate((key) => {
    return Array.isArray(key) && key[0] === PENDING_VALIDATION_KEY;
  });
};
