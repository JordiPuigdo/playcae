"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { useTranslation } from "@/hooks/useTranslation";
import { CreateRoleRequest, Permission, Role } from "@/types/role";

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleRequest) => Promise<void> | void;
  permissions: Permission[];
  role?: Role;
}

export const RoleForm = ({ isOpen, onClose, onSubmit, permissions, role }: RoleFormProps) => {
  const { t } = useTranslation();
  const isEdit = Boolean(role);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(role?.name ?? "");
      setDescription(role?.description ?? "");
      setSelected(new Set(role?.permissionCodes ?? []));
    }
  }, [isOpen, role]);

  const groups = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const permission of permissions) {
      const key = permission.category ?? "General";
      const list = map.get(key) ?? [];
      list.push(permission);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [permissions]);

  const toggle = (code: string, value: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (value) next.add(code);
      else next.delete(code);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        permissionCodes: Array.from(selected),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("rolesPermissions.form.editTitle") : t("rolesPermissions.form.createTitle")}
          </DialogTitle>
          <DialogDescription>{t("rolesPermissions.form.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="role-name">{t("rolesPermissions.form.name")}</Label>
            <Input
              id="role-name"
              value={name}
              uppercase={false}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("rolesPermissions.form.namePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">{t("rolesPermissions.form.description")}</Label>
            <Input
              id="role-description"
              value={description}
              uppercase={false}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("rolesPermissions.form.descriptionPlaceholder")}
            />
          </div>

          <div className="space-y-3">
            <Label>{t("rolesPermissions.form.permissions")}</Label>
            {groups.map(([category, items]) => (
              <div key={category} className="space-y-2 rounded-md border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">{category}</p>
                {items.map((permission) => (
                  <div key={permission.code} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{permission.description}</span>
                    <Switch
                      checked={selected.has(permission.code)}
                      onCheckedChange={(value) => toggle(permission.code, value)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("rolesPermissions.form.cancel")}
            </Button>
            <Button type="submit" disabled={submitting || !name.trim()}>
              {t("rolesPermissions.form.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
