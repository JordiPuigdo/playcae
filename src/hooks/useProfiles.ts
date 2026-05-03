import { useMemo } from "react";
import useSWR from "swr";
import { ProfileService } from "@/services/profile.service";
import { CreateProfileRequest, Profile, UpdateProfileRequest } from "@/types/profile";
import { ApiError } from "@/interfaces/api-response";

export const useProfiles = () => {
  const service = useMemo(() => new ProfileService(), []);

  const { data, error, isValidating, mutate } = useSWR<Profile[]>(
    "profiles-global",
    async () => {
      const response = await service.getGlobal();
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const create = async (request: CreateProfileRequest): Promise<Profile> => {
    const response = await service.create(request);
    await mutate();
    return response.data;
  };

  const update = async (id: string, request: UpdateProfileRequest): Promise<Profile> => {
    const response = await service.update(id, request);
    await mutate();
    return response.data;
  };

  const remove = async (id: string): Promise<void> => {
    await service.delete(id);
    await mutate();
  };

  const addDocumentType = async (profileId: string, documentTypeId: string): Promise<void> => {
    await service.addDocumentType(profileId, documentTypeId);
    await mutate();
  };

  const removeDocumentType = async (profileId: string, documentTypeId: string): Promise<void> => {
    await service.removeDocumentType(profileId, documentTypeId);
    await mutate();
  };

  const batchUpdateDocTypes = async (
    profileId: string,
    toAdd: string[],
    toRemove: string[]
  ): Promise<void> => {
    await Promise.all([
      ...toAdd.map((id) => service.addDocumentType(profileId, id)),
      ...toRemove.map((id) => service.removeDocumentType(profileId, id)),
    ]);
    await mutate();
  };

  return {
    profiles: data ?? [],
    isLoading: !data && !error,
    isValidating,
    error: error as ApiError | undefined,
    refresh: mutate,
    create,
    update,
    remove,
    addDocumentType,
    removeDocumentType,
    batchUpdateDocTypes,
  };
};
