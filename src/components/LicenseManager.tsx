"use client";

import { useState } from "react";
import { Lock, Pencil, Search } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginService } from "@/services/login.service";
import { LicenseService } from "@/services/license.service";
import { TenantLicenseAdmin, UpdateTenantLicenseDto } from "@/types/license";
import { toast } from "@/hooks/use-Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

// ─── Re-auth gate ─────────────────────────────────────────────────────────────

function ReAuthGate({ onVerified }: { onVerified: () => void }) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!user?.userName || !password) return;
    setIsVerifying(true);
    setError(null);
    try {
      const loginService = new LoginService();
      await loginService.login(user.userName, password);
      onVerified();
    } catch {
      setError(t("license.auth.error"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm border border-playBlueLight/20">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <Lock className="h-6 w-6 text-brand-primary" />
          </div>
          <CardTitle className="text-brand-primary">
            {t("license.auth.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("license.auth.description")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="reauth-password">{t("license.auth.passwordLabel")}</Label>
            <Input
              id="reauth-password"
              type="password"
              uppercase={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              disabled={isVerifying}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
            onClick={handleVerify}
            disabled={isVerifying || !password}
          >
            {isVerifying ? t("license.auth.verifying") : t("license.auth.confirm")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditLicenseModal({
  tenant,
  onClose,
  onSaved,
}: {
  tenant: TenantLicenseAdmin;
  onClose: () => void;
  onSaved: (updated: TenantLicenseAdmin) => void;
}) {
  const { t } = useTranslation();

  const toField = (val: number | null) => (val === null ? "" : String(val));
  const fromField = (val: string): number | null =>
    val.trim() === "" ? null : Number(val);

  const [maxContractors, setMaxContractors] = useState(toField(tenant.maxContractors));
  const [maxWorkers, setMaxWorkers] = useState(toField(tenant.maxWorkers));
  const [maxPrlUsers, setMaxPrlUsers] = useState(toField(tenant.maxPrlUsers));
  const [maxSites, setMaxSites] = useState(toField(tenant.maxSites));
  const [alertThreshold, setAlertThreshold] = useState(String(tenant.alertThreshold));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dto: UpdateTenantLicenseDto = {
        maxContractors: fromField(maxContractors),
        maxWorkers: fromField(maxWorkers),
        maxPrlUsers: fromField(maxPrlUsers),
        maxSites: fromField(maxSites),
        alertThreshold: Number(alertThreshold) || 5,
      };
      await LicenseService.updateTenantLicense(tenant.adminUserId, dto);
      toast({ title: t("license.edit.success"), variant: "default" });
      onSaved({ ...tenant, ...dto });
      onClose();
    } catch {
      toast({ title: t("license.edit.error"), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("license.edit.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{tenant.adminName}</p>
          <p className="text-xs text-muted-foreground">{t("license.edit.subtitle")}</p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1">
            <Label>{t("license.edit.contractors")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={0}
              value={maxContractors}
              onChange={(e) => setMaxContractors(e.target.value)}
              placeholder="∞"
            />
          </div>
          <div className="space-y-1">
            <Label>{t("license.edit.workers")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={0}
              value={maxWorkers}
              onChange={(e) => setMaxWorkers(e.target.value)}
              placeholder="∞"
            />
          </div>
          <div className="space-y-1">
            <Label>{t("license.edit.prlUsers")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={0}
              value={maxPrlUsers}
              onChange={(e) => setMaxPrlUsers(e.target.value)}
              placeholder="∞"
            />
          </div>
          <div className="space-y-1">
            <Label>{t("license.edit.sites")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={0}
              value={maxSites}
              onChange={(e) => setMaxSites(e.target.value)}
              placeholder="∞"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>{t("license.edit.threshold")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={1}
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t("license.edit.cancel")}
          </Button>
          <Button
            className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {t("license.edit.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tenant table ─────────────────────────────────────────────────────────────

function LimitCell({ current, max }: { current: number; max: number | null }) {
  const { t } = useTranslation();
  const label = max === null ? t("license.table.noLimit") : String(max);
  const pct = max !== null && max > 0 ? (current / max) * 100 : 0;
  const isWarning = max !== null && pct >= 80;

  return (
    <div className="text-center">
      <span className={isWarning ? "font-semibold text-destructive" : ""}>
        {current}
      </span>
      <span className="text-muted-foreground text-xs"> / {label}</span>
    </div>
  );
}

function TenantTable({
  tenants,
  onEdit,
}: {
  tenants: TenantLicenseAdmin[];
  onEdit: (tenant: TenantLicenseAdmin) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = tenants.filter(
    (t) =>
      t.adminName.toLowerCase().includes(search.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          uppercase={false}
          className="pl-9"
          placeholder={t("license.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-playBlueLight/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-primary/5">
              <TableHead>{t("license.table.admin")}</TableHead>
              <TableHead className="text-center">{t("license.table.contractors")}</TableHead>
              <TableHead className="text-center">{t("license.table.workers")}</TableHead>
              <TableHead className="text-center">{t("license.table.prlUsers")}</TableHead>
              <TableHead className="text-center">{t("license.table.sites")}</TableHead>
              <TableHead className="text-center">{t("license.table.threshold")}</TableHead>
              <TableHead className="text-right">{t("license.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  {t("license.noTenants")}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tenant) => (
                <TableRow key={tenant.adminUserId}>
                  <TableCell>
                    <div className="font-medium text-brand-primary">{tenant.adminName}</div>
                    <div className="text-xs text-muted-foreground">{tenant.adminEmail}</div>
                  </TableCell>
                  <TableCell>
                    <LimitCell current={tenant.currentContractors} max={tenant.maxContractors} />
                  </TableCell>
                  <TableCell>
                    <LimitCell current={tenant.currentWorkers} max={tenant.maxWorkers} />
                  </TableCell>
                  <TableCell>
                    <LimitCell current={tenant.currentPrlUsers} max={tenant.maxPrlUsers} />
                  </TableCell>
                  <TableCell>
                    <LimitCell current={tenant.currentSites} max={tenant.maxSites} />
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {tenant.alertThreshold}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tenant)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="ml-1">{t("license.table.edit")}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function LicenseManager() {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [tenants, setTenants] = useState<TenantLicenseAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<TenantLicenseAdmin | null>(null);

  const handleVerified = async () => {
    setIsVerified(true);
    setIsLoading(true);
    try {
      const res = await LicenseService.getAllTenants();
      setTenants(res.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaved = (updated: TenantLicenseAdmin) => {
    setTenants((prev) =>
      prev.map((t) => (t.adminUserId === updated.adminUserId ? updated : t))
    );
  };

  if (!isVerified) {
    return <ReAuthGate onVerified={handleVerified} />;
  }

  return (
    <div className="">
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div>
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <Lock className="h-6 w-6 text-brand-primary" />
                {t("license.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("license.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p className="text-muted-foreground">{t("license.loading")}</p>
        ) : (
          <TenantTable tenants={tenants} onEdit={setEditTarget} />
        )}
      </div>

      {editTarget && (
        <EditLicenseModal
          tenant={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
