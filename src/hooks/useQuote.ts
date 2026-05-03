import { useMemo } from "react";
import useSWR from "swr";
import { QuoteService } from "@/services/quote.service";
import {
  CreateQuoteCompanyDocumentSpecRequest,
  CreateQuoteLineRequest,
  CreateQuoteWorkerProfileDocumentSpecRequest,
  CreateQuoteWorkerProfileSpecRequest,
  Quote,
  UpdateQuoteLineRequest,
  UpdateQuoteRequest,
  UpdateQuoteWorkerProfileSpecRequest,
} from "@/types/quote";
import { ApiError } from "@/interfaces/api-response";

export const useQuote = (id: string | undefined) => {
  const service = useMemo(() => new QuoteService(), []);
  const swrKey = id ? ["quote", id] : null;

  const { data, error, isValidating, mutate } = useSWR<Quote>(
    swrKey,
    async () => {
      const response = await service.getById(id!);
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const update = async (request: UpdateQuoteRequest) => {
    const response = await service.update(id!, request);
    await mutate(response.data, { revalidate: false });
    return response.data;
  };

  const send = async () => {
    const response = await service.send(id!);
    await mutate(response.data, { revalidate: false });
    return response.data;
  };

  const addLine = async (request: CreateQuoteLineRequest) => {
    await service.addLine(id!, request);
    await mutate();
  };

  const updateLine = async (lineId: string, request: UpdateQuoteLineRequest) => {
    await service.updateLine(id!, lineId, request);
    await mutate();
  };

  const removeLine = async (lineId: string) => {
    await service.removeLine(id!, lineId);
    await mutate();
  };

  const addCompanyDocument = async (request: CreateQuoteCompanyDocumentSpecRequest) => {
    await service.addCompanyDocument(id!, request);
    await mutate();
  };

  const removeCompanyDocument = async (specId: string) => {
    await service.removeCompanyDocument(id!, specId);
    await mutate();
  };

  const addWorkerProfile = async (request: CreateQuoteWorkerProfileSpecRequest) => {
    await service.addWorkerProfile(id!, request);
    await mutate();
  };

  const updateWorkerProfile = async (
    specId: string,
    request: UpdateQuoteWorkerProfileSpecRequest
  ) => {
    await service.updateWorkerProfile(id!, specId, request);
    await mutate();
  };

  const removeWorkerProfile = async (specId: string) => {
    await service.removeWorkerProfile(id!, specId);
    await mutate();
  };

  const addWorkerProfileDocument = async (
    specId: string,
    request: CreateQuoteWorkerProfileDocumentSpecRequest
  ) => {
    await service.addWorkerProfileDocument(id!, specId, request);
    await mutate();
  };

  const removeWorkerProfileDocument = async (specId: string, docId: string) => {
    await service.removeWorkerProfileDocument(id!, specId, docId);
    await mutate();
  };

  return {
    quote: data,
    isLoading: !data && !error,
    isValidating,
    error: error as ApiError | undefined,
    refresh: mutate,
    update,
    send,
    addLine,
    updateLine,
    removeLine,
    addCompanyDocument,
    removeCompanyDocument,
    addWorkerProfile,
    updateWorkerProfile,
    removeWorkerProfile,
    addWorkerProfileDocument,
    removeWorkerProfileDocument,
  };
};
