"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/hooks/use-Toast";
import { useTranslation } from "@/hooks/useTranslation";
import { WorkerService } from "@/services/worker.service";
import { RoleService } from "@/services/role.service";
import { Role } from "@/types/role";
import { Worker } from "@/types/worker";

interface WorkerRoleAssignmentProps {
  roles: Role[];
}

export const WorkerRoleAssignment = ({ roles }: WorkerRoleAssignmentProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const workerService = useMemo(() => new WorkerService(), []);
  const roleService = useMemo(() => new RoleService(), []);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    workerService
      .getInternalByUserId(user.userId)
      .then((res) => setWorkers(res.data.workers ?? []))
      .catch(() => setWorkers([]));
  }, [user?.userId, workerService]);

  const openWorker = async (worker: Worker) => {
    setActiveWorker(worker);
    setLoadingRoles(true);
    try {
      const res = await roleService.getWorkerRoles(worker.id as string);
      setAssigned(new Set((res.data.roles ?? []).map((r) => r.id as string)));
    } catch {
      setAssigned(new Set());
    } finally {
      setLoadingRoles(false);
    }
  };

  const toggleRole = async (roleId: string, value: boolean) => {
    if (!activeWorker?.id) return;
    const workerId = activeWorker.id;
    try {
      if (value) await roleService.assign(workerId, roleId);
      else await roleService.unassign(workerId, roleId);

      setAssigned((prev) => {
        const next = new Set(prev);
        if (value) next.add(roleId);
        else next.delete(roleId);
        return next;
      });
    } catch {
      toast({ title: t("rolesPermissions.assign.error"), variant: "destructive" });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("rolesPermissions.assign.worker")}</TableHead>
            <TableHead>{t("rolesPermissions.assign.cardId")}</TableHead>
            <TableHead className="text-right">{t("rolesPermissions.assign.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {t("rolesPermissions.assign.noWorkers")}
              </TableCell>
            </TableRow>
          ) : (
            workers.map((worker) => (
              <TableRow key={worker.id}>
                <TableCell>
                  {worker.firstName} {worker.lastName}
                </TableCell>
                <TableCell>{worker.cardId}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => openWorker(worker)}>
                    {t("rolesPermissions.assign.manage")}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={Boolean(activeWorker)} onOpenChange={(open) => !open && setActiveWorker(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {activeWorker ? `${activeWorker.firstName} ${activeWorker.lastName}` : ""}
            </DialogTitle>
            <DialogDescription>{t("rolesPermissions.assign.dialogSubtitle")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {loadingRoles ? (
              <p className="text-sm text-muted-foreground">{t("rolesPermissions.assign.loading")}</p>
            ) : (
              roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div>
                    <p className="text-sm font-medium">{role.name}</p>
                    {role.description ? (
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    ) : null}
                  </div>
                  <Switch
                    checked={assigned.has(role.id as string)}
                    onCheckedChange={(value) => toggleRole(role.id as string, value)}
                  />
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
