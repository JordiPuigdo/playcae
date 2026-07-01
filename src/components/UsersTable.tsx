"use client";

import { useState } from "react";
import { Ban, Check, Edit, KeyRound, Trash2 } from "lucide-react";
import { useSortableTable } from "@/hooks/useSortableTable";
import { SortableHeader } from "./SortableHeader";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";
import { TableCard } from "./TableCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { getUserRoleLabel } from "@/types/user";
import { UserManagementItem } from "@/types/userSitePermission";
import { formatDate } from "@/app/utils/date";

type SortField = "email" | "role" | "active" | "creationDate";

interface UsersTableProps {
  users: UserManagementItem[];
  totalCount?: number;
  onEdit: (user: UserManagementItem) => void;
  onToggleActive: (user: UserManagementItem) => void;
  onResendPassword: (user: UserManagementItem) => void;
  onDelete: (user: UserManagementItem) => Promise<void> | void;
}

export const UsersTable = ({
  users,
  totalCount,
  onEdit,
  onToggleActive,
  onResendPassword,
  onDelete,
}: UsersTableProps) => {
  const [deleteUser, setDeleteUser] = useState<UserManagementItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { sortField, sortDirection, handleSort, sortedData } =
    useSortableTable<UserManagementItem, SortField>(users, (a, b, field) => {
      switch (field) {
        case "email":
          return (a.email || "").localeCompare(b.email || "");
        case "role":
          return getUserRoleLabel(a.role).localeCompare(getUserRoleLabel(b.role));
        case "active":
          return Number(b.active) - Number(a.active);
        case "creationDate":
          return (a.creationDate || "").localeCompare(b.creationDate || "");
      }
    });

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteUser);
    } finally {
      setIsDeleting(false);
      setDeleteUser(null);
    }
  };

  const total = totalCount ?? users.length;
  const isFiltered = total !== users.length;

  if (users.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {total > 0
              ? "No hay usuarios que coincidan con los filtros."
              : "No hay usuarios registrados."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TableCard
        title={
          isFiltered
            ? `Usuarios (${users.length} de ${total})`
            : `Usuarios (${users.length})`
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="email" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                Email
              </SortableHeader>
              <SortableHeader field="role" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                Rol
              </SortableHeader>
              <SortableHeader field="active" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="text-center">
                Estado
              </SortableHeader>
              <SortableHeader field="creationDate" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>
                Alta
              </SortableHeader>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((user) => (
              <TableRow
                key={user.id}
                className={`transition-colors ${!user.active ? "opacity-60" : ""}`}
              >
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getUserRoleLabel(user.role)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {user.active ? (
                    <Badge variant="default">Activo</Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.creationDate)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      title="Editar"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Reenviar cambio de contraseña"
                      onClick={() => onResendPassword(user)}
                    >
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    {user.active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Inactivar"
                        className="text-amber-600 hover:text-amber-600"
                        onClick={() => onToggleActive(user)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Activar"
                        className="text-success hover:text-success"
                        onClick={() => onToggleActive(user)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      title="Eliminar"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>

      <DeleteConfirmationModal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar usuario"
        description="Se eliminará el usuario y TODO lo relacionado con él: empresas, obras, documentos, notificaciones y demás datos asociados. Esta acción es irreversible."
        itemName={deleteUser?.email}
        isLoading={isDeleting}
      />
    </>
  );
};
