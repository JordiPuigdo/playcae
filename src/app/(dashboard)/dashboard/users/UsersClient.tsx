"use client";

import { useMemo, useState } from "react";
import { Search, Users, X } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-Toast";
import { UsersTable } from "@/components/UsersTable";
import { UserFormModal } from "@/components/UserFormModal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { UpdateUserRequest, USER_ROLE_LABELS, UserRole } from "@/types/user";
import { UserManagementItem } from "@/types/userSitePermission";

const getErrorMessage = (err: unknown, fallback: string) =>
  (err as { message?: string })?.message ?? fallback;

type RoleFilter = UserRole | "all";
type StatusFilter = "all" | "active" | "inactive";

const ROLE_OPTIONS = Object.values(UserRole).filter(
  (value): value is UserRole => typeof value === "number"
);

export const UsersClient = () => {
  const { role } = usePermissions();
  const { toast } = useToast();
  const {
    users,
    loading,
    error,
    updateUser,
    toggleActive,
    removeUser,
    resendPasswordReset,
  } = useUsers();

  const [editingUser, setEditingUser] = useState<UserManagementItem | undefined>(
    undefined
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      if (term && !(user.email ?? "").toLowerCase().includes(term)) return false;
      if (roleFilter !== "all" && user.role !== roleFilter) return false;
      if (statusFilter === "active" && !user.active) return false;
      if (statusFilter === "inactive" && user.active) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const hasFilters =
    search.trim() !== "" || roleFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  if (role !== UserRole.SuperAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">
          No tienes permiso para acceder a esta sección.
        </p>
      </div>
    );
  }

  const openEdit = (user: UserManagementItem) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: UpdateUserRequest) => {
    if (!editingUser?.id) return;
    try {
      await updateUser(editingUser.id, data);
      toast({ title: "Usuario actualizado" });
    } catch (err) {
      toast({
        title: "No se pudo actualizar",
        description: getErrorMessage(err, "Inténtalo de nuevo."),
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (user: UserManagementItem) => {
    if (!user.id) return;
    const nextActive = !user.active;
    try {
      await toggleActive(user.id, nextActive);
      toast({ title: nextActive ? "Usuario activado" : "Usuario inactivado" });
    } catch (err) {
      toast({
        title: "No se pudo cambiar el estado",
        description: getErrorMessage(err, "Inténtalo de nuevo."),
        variant: "destructive",
      });
    }
  };

  const handleResendPassword = async (user: UserManagementItem) => {
    if (!user.id) return;
    try {
      await resendPasswordReset(user.id);
      toast({
        title: "Email enviado",
        description: `Se ha enviado un enlace de cambio de contraseña a ${user.email}.`,
      });
    } catch (err) {
      toast({
        title: "No se pudo enviar el email",
        description: getErrorMessage(err, "Inténtalo de nuevo."),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (user: UserManagementItem) => {
    if (!user.id) return;
    try {
      await removeUser(user.id);
      toast({ title: "Usuario eliminado" });
    } catch (err) {
      toast({
        title: "No se pudo eliminar",
        description: getErrorMessage(err, "Inténtalo de nuevo."),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Users className="h-7 w-7 text-brand-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Gestión de usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Edita, cambia la contraseña, inactiva o elimina usuarios.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            uppercase={false}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por email…"
            className="pl-9"
          />
        </div>

        <Select
          value={roleFilter === "all" ? "all" : String(roleFilter)}
          onValueChange={(value) =>
            setRoleFilter(value === "all" ? "all" : (Number(value) as UserRole))
          }
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {ROLE_OPTIONS.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {USER_ROLE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-1">
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {loading && users.length === 0 ? (
        <p className="text-muted-foreground">Cargando usuarios…</p>
      ) : (
        <UsersTable
          users={filteredUsers}
          totalCount={users.length}
          onEdit={openEdit}
          onToggleActive={handleToggleActive}
          onResendPassword={handleResendPassword}
          onDelete={handleDelete}
        />
      )}

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        user={editingUser}
      />
    </div>
  );
};
