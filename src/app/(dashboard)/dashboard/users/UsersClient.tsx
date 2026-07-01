"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-Toast";
import { UsersTable } from "@/components/UsersTable";
import { UserFormModal } from "@/components/UserFormModal";
import { UpdateUserRequest, UserRole } from "@/types/user";
import { UserManagementItem } from "@/types/userSitePermission";

const getErrorMessage = (err: unknown, fallback: string) =>
  (err as { message?: string })?.message ?? fallback;

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

      {loading ? (
        <p className="text-muted-foreground">Cargando usuarios…</p>
      ) : (
        <UsersTable
          users={users}
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
