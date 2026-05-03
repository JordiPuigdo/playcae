import { useMemo, useState } from "react";
import useSWR from "swr";
import { QuoteService } from "@/services/quote.service";
import {
  CreateQuoteRequest,
  Quote,
  QuoteListQuery,
  QuotePagedResult,
  QuoteSimple,
  UpdateQuoteRequest,
} from "@/types/quote";
import { ApiError } from "@/interfaces/api-response";

export const useQuotes = (initialQuery: QuoteListQuery = { page: 1, pageSize: 20 }) => {
  const service = useMemo(() => new QuoteService(), []);
  const [query, setQuery] = useState<QuoteListQuery>(initialQuery);

  const swrKey = useMemo(
    () => ["quotes", JSON.stringify(query)],
    [query]
  );

  const { data, error, isValidating, mutate } = useSWR<QuotePagedResult>(
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

  const items: QuoteSimple[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const page = data?.page ?? query.page ?? 1;
  const pageSize = data?.pageSize ?? query.pageSize ?? 20;
  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize);

  const create = async (request: CreateQuoteRequest): Promise<Quote> => {
    const response = await service.create(request);
    await mutate();
    return response.data;
  };

  const update = async (id: string, request: UpdateQuoteRequest): Promise<Quote> => {
    const response = await service.update(id, request);
    await mutate();
    return response.data;
  };

  const remove = async (id: string): Promise<void> => {
    await service.delete(id);
    await mutate();
  };

  const send = async (id: string): Promise<Quote> => {
    const response = await service.send(id);
    await mutate();
    return response.data;
  };

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    query,
    setQuery,
    error: error as ApiError | undefined,
    isLoading: !data && !error,
    isValidating,
    create,
    update,
    remove,
    send,
    refresh: mutate,
  };
};
