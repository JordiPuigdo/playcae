"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PermissionService } from "@/services/permission.service";
import { RoleService } from "@/services/role.service";
import {
  CreateRoleRequest,
  Permission,
  Role,
  UpdateRoleRequest,
} from "@/types/role";

export const useRoles = () => {
  const roleService = useMemo(() => new RoleService(), []);
  const permissionService = useMemo(() => new PermissionService(), []);

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        roleService.getAll(),
        permissionService.getAll(),
      ]);
      setRoles(rolesRes.data ?? []);
      setPermissions(permissionsRes.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [roleService, permissionService]);

  useEffect(() => {
    load();
  }, [load]);

  const createRole = useCallback(
    async (request: CreateRoleRequest) => {
      const res = await roleService.create(request);
      setRoles((prev) => [...prev, res.data]);
    },
    [roleService]
  );

  const updateRole = useCallback(
    async (id: string, request: UpdateRoleRequest) => {
      const res = await roleService.update(id, request);
      setRoles((prev) => prev.map((r) => (r.id === id ? res.data : r)));
    },
    [roleService]
  );

  const deleteRole = useCallback(
    async (id: string) => {
      await roleService.remove(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    },
    [roleService]
  );

  return { roles, permissions, loading, createRole, updateRole, deleteRole, reload: load };
};
