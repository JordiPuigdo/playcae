import { useCallback, useEffect, useMemo, useState } from "react";
import { UserService } from "@/services/user.services";
import { UpdateUserRequest, User } from "@/types/user";
import { UserManagementItem } from "@/types/userSitePermission";

export interface CreateUserRequest {
  companyName: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface CreateUserResponse {
  user: User;
  errorMessage: string;
}

export const useUsers = () => {
  const userService = useMemo(() => new UserService(), []);
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await userService.getAll();
        setUsers(res.data ?? []);
      } catch (err) {
        const message =
          (err as { message?: string })?.message ??
          "No se pudieron cargar los usuarios.";
        setError(message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [userService]
  );

  useEffect(() => {
    load();
  }, [load]);

  const createUser = useCallback(
    async (data: CreateUserRequest) => userService.create(data),
    [userService]
  );

  const updateUser = useCallback(
    async (id: string, request: UpdateUserRequest) => {
      await userService.update(id, request);
      await load(true);
    },
    [userService, load]
  );

  const toggleActive = useCallback(
    async (id: string, active: boolean) => {
      await userService.setActive(id, active);
      await load(true);
    },
    [userService, load]
  );

  const removeUser = useCallback(
    async (id: string) => {
      await userService.remove(id);
      await load(true);
    },
    [userService, load]
  );

  const resendPasswordReset = useCallback(
    async (id: string) => {
      await userService.sendPasswordReset(id);
    },
    [userService]
  );

  return {
    users,
    loading,
    error,
    reload: load,
    createUser,
    updateUser,
    toggleActive,
    removeUser,
    resendPasswordReset,
  };
};
