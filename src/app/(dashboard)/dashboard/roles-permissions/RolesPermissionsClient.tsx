"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { RoleForm } from "@/components/RoleForm";
import { WorkerRoleAssignment } from "@/components/WorkerRoleAssignment";
import { useRoles } from "@/hooks/useRoles";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { CreateRoleRequest, Role } from "@/types/role";
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react";

export const RolesPermissionsClient = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { roles, permissions, loading, createRole, updateRole, deleteRole } = useRoles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>(undefined);

  const openCreate = () => {
    setEditingRole(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreateRoleRequest) => {
    try {
      if (editingRole?.id) {
        await updateRole(editingRole.id, data);
        toast({ title: t("rolesPermissions.toast.updated") });
      } else {
        await createRole(data);
        toast({ title: t("rolesPermissions.toast.created") });
      }
    } catch {
      toast({ title: t("rolesPermissions.toast.error"), variant: "destructive" });
    }
  };

  const handleDelete = async (role: Role) => {
    if (!role.id) return;
    if (!window.confirm(t("rolesPermissions.toast.confirmDelete"))) return;
    try {
      await deleteRole(role.id);
      toast({ title: t("rolesPermissions.toast.deleted") });
    } catch {
      toast({ title: t("rolesPermissions.toast.error"), variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <KeyRound className="h-7 w-7 text-brand-primary" />
        <div>
          <h1 className="text-2xl font-semibold">{t("rolesPermissions.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("rolesPermissions.subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{t("rolesPermissions.roles")}</CardTitle>
            <CardDescription>{t("rolesPermissions.rolesSubtitle")}</CardDescription>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t("rolesPermissions.newRole")}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("rolesPermissions.table.name")}</TableHead>
                <TableHead>{t("rolesPermissions.table.description")}</TableHead>
                <TableHead>{t("rolesPermissions.table.permissions")}</TableHead>
                <TableHead>{t("rolesPermissions.table.type")}</TableHead>
                <TableHead className="text-right">{t("rolesPermissions.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("rolesPermissions.loading")}
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t("rolesPermissions.noRoles")}
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground">{role.description}</TableCell>
                    <TableCell>{role.permissionCodes.length}</TableCell>
                    <TableCell>
                      {role.isSystem
                        ? t("rolesPermissions.table.system")
                        : t("rolesPermissions.table.custom")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(role)}
                          disabled={role.isSystem}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(role)}
                          disabled={role.isSystem}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("rolesPermissions.assign.title")}</CardTitle>
          <CardDescription>{t("rolesPermissions.assign.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkerRoleAssignment roles={roles} />
        </CardContent>
      </Card>

      <RoleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        permissions={permissions}
        role={editingRole}
      />
    </div>
  );
};
