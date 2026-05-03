import { useMemo } from "react";
import useSWR from "swr";
import { DocumentTypeService } from "@/services/documentType.service";
import { DocumentType, CreateDocumentTypeRequest, UpdateDocumentTypeRequest } from "@/types/documentType";
import { ApiError } from "@/interfaces/api-response";

export const useDocumentTypes = () => {
  const service = useMemo(() => new DocumentTypeService(), []);

  const { data, error, isValidating, mutate } = useSWR<DocumentType[]>(
    "document-types-all",
    async () => {
      const response = await service.getAll();
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const create = async (request: CreateDocumentTypeRequest): Promise<DocumentType> => {
    const response = await service.create(request);
    await mutate();
    return response.data;
  };

  const update = async (id: string, request: UpdateDocumentTypeRequest): Promise<DocumentType> => {
    const response = await service.update(id, request);
    await mutate();
    return response.data;
  };

  const deactivate = async (id: string): Promise<void> => {
    await service.deactivate(id);
    await mutate();
  };

  return {
    documentTypes: data ?? [],
    isLoading: !data && !error,
    isValidating,
    error: error as ApiError | undefined,
    refresh: mutate,
    create,
    update,
    deactivate,
  };
};
