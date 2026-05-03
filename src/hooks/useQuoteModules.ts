import { useMemo } from "react";
import useSWR from "swr";
import { QuoteModuleService } from "@/services/quote-module.service";
import {
  CreateQuoteModuleRequest,
  QuoteModule,
  QuoteModuleListQuery,
  UpdateQuoteModuleRequest,
} from "@/types/quote";
import { ApiError } from "@/interfaces/api-response";

export const useQuoteModules = (query: QuoteModuleListQuery = {}) => {
  const service = useMemo(() => new QuoteModuleService(), []);

  const swrKey = useMemo(
    () => ["quote-modules", JSON.stringify(query)],
    [query]
  );

  const { data, error, isValidating, mutate } = useSWR<QuoteModule[]>(
    swrKey,
    async () => {
      const response = await service.getAll(query);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const create = async (request: CreateQuoteModuleRequest) => {
    const response = await service.create(request);
    await mutate();
    return response.data;
  };

  const update = async (id: string, request: UpdateQuoteModuleRequest) => {
    const response = await service.update(id, request);
    await mutate();
    return response.data;
  };

  const remove = async (id: string) => {
    await service.delete(id);
    await mutate();
  };

  return {
    modules: data ?? [],
    isLoading: !data && !error,
    isValidating,
    error: error as ApiError | undefined,
    refresh: mutate,
    create,
    update,
    remove,
  };
};
