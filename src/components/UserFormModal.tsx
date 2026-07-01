"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { UpdateUserRequest, USER_ROLE_LABELS, UserRole } from "@/types/user";
import { UserManagementItem } from "@/types/userSitePermission";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserRequest) => Promise<void> | void;
  user?: UserManagementItem;
}

const ROLE_OPTIONS = Object.values(UserRole).filter(
  (value): value is UserRole => typeof value === "number"
);

export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: UserFormModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.Admin);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setEmail(user.email ?? "");
      setRole(user.role);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ email: email.trim(), role });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Cambia el email o el rol del usuario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              uppercase={false}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-role">Rol</Label>
            <Select
              value={String(role)}
              onValueChange={(value) => setRole(Number(value) as UserRole)}
            >
              <SelectTrigger id="user-role">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {USER_ROLE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || !email.trim()}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
