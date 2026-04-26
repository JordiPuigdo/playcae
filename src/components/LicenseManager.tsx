"use client";

import { useEffect, useState } from "react";
import { Lock, Pencil, Plus, Search } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginService } from "@/services/login.service";
import { LicenseService } from "@/services/license.service";
import { UserService } from "@/services/user.services";
import { TenantLicenseAdmin, UpdateTenantLicenseDto } from "@/types/license";
import { UserRole } from "@/types/user";
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
import { Switch } from "@/components/ui/Switch";
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
  const [enableInternalWorkers, setEnableInternalWorkers] = useState(tenant.enableInternalWorkers);
  const [maxInternalWorkers, setMaxInternalWorkers] = useState(toField(tenant.maxInternalWorkers));
  const [workersPerContractor, setWorkersPerContractor] = useState(toField(tenant.workersPerContractor));
  const [maxPrlUsers, setMaxPrlUsers] = useState(toField(tenant.maxPrlUsers));
  const [maxSites, setMaxSites] = useState(toField(tenant.maxSites));
  const [alertThreshold, setAlertThreshold] = useState(String(tenant.alertThreshold));
  const [enableProjects, setEnableProjects] = useState(tenant.enableProjects);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dto: UpdateTenantLicenseDto = {
        maxContractors: fromField(maxContractors),
        enableInternalWorkers,
        maxInternalWorkers: fromField(maxInternalWorkers),
        workersPerContractor: fromField(workersPerContractor),
        maxPrlUsers: fromField(maxPrlUsers),
        maxSites: fromField(maxSites),
        alertThreshold: Number(alertThreshold) || 5,
        enableProjects,
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
            <Label>{t("license.edit.workersPerContractor")}</Label>
            <Input
              type="number"
              uppercase={false}
              min={0}
              value={workersPerContractor}
              onChange={(e) => setWorkersPerContractor(e.target.value)}
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
          <div className="col-span-2 flex items-center justify-between rounded-lg border border-playBlueLight/20 p-3">
            <div>
              <Label className="text-sm font-medium">{t("license.edit.enableInternalWorkers")}</Label>
              <p className="text-xs text-muted-foreground">{t("license.edit.enableInternalWorkersDesc")}</p>
            </div>
            <Switch
              checked={enableInternalWorkers}
              onCheckedChange={setEnableInternalWorkers}
            />
          </div>
          {enableInternalWorkers && (
            <div className="col-span-2 space-y-1">
              <Label>{t("license.edit.maxInternalWorkers")}</Label>
              <Input
                type="number"
                uppercase={false}
                min={0}
                value={maxInternalWorkers}
                onChange={(e) => setMaxInternalWorkers(e.target.value)}
                placeholder="∞"
              />
            </div>
          )}
          <div className="col-span-2 flex items-center justify-between rounded-lg border border-playBlueLight/20 p-3">
            <div>
              <Label className="text-sm font-medium">{t("license.edit.enableProjects")}</Label>
              <p className="text-xs text-muted-foreground">{t("license.edit.enableProjectsDesc")}</p>
            </div>
            <Switch
              checked={enableProjects}
              onCheckedChange={setEnableProjects}
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

// ─── Create modal ─────────────────────────────────────────────────────────────

function CreateLicenseModal({
  onClose,
  onCreated,
  tenants,
}: {
  onClose: () => void;
  onCreated: (tenant: TenantLicenseAdmin) => void;
  tenants: TenantLicenseAdmin[];
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [admins, setAdmins] = useState<{ email: string }[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [maxContractors, setMaxContractors] = useState("");
  const [enableInternalWorkers, setEnableInternalWorkers] = useState(false);
  const [maxInternalWorkers, setMaxInternalWorkers] = useState("");
  const [workersPerContractor, setWorkersPerContractor] = useState("");
  const [maxPrlUsers, setMaxPrlUsers] = useState("");
  const [maxSites, setMaxSites] = useState("");
  const [alertThreshold, setAlertThreshold] = useState("5");
  const [enableProjects, setEnableProjects] = useState(false);

  const fromField = (val: string): number | null =>
    val.trim() === "" ? null : Number(val);

  useEffect(() => {
    const load = async () => {
      try {
        const userService = new UserService();
        const res = await userService.getAll();
        const tenantEmails = new Set(tenants.map((t) => t.adminEmail.toLowerCase()));
        const unlicensed = (res.data ?? []).filter(
          (u) => u.role === UserRole.Admin && !tenantEmails.has(u.email.toLowerCase())
        );
        setAdmins(unlicensed);
      } finally {
        setIsLoadingAdmins(false);
      }
    };
    load();
  }, [tenants]);

  const filteredAdmins = admins.filter((a) =>
    a.email.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (email: string) => {
    setSelectedEmail(email);
    setQuery(email);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    if (!selectedEmail) return;
    setIsSaving(true);
    try {
      const res = await LicenseService.initTenantLicense(selectedEmail);
      if (res.data) {
        const dto: UpdateTenantLicenseDto = {
          maxContractors: fromField(maxContractors),
          enableInternalWorkers,
          maxInternalWorkers: fromField(maxInternalWorkers),
          workersPerContractor: fromField(workersPerContractor),
          maxPrlUsers: fromField(maxPrlUsers),
          maxSites: fromField(maxSites),
          alertThreshold: Number(alertThreshold) || 5,
          enableProjects,
        };
        await LicenseService.updateTenantLicense(res.data.adminUserId, dto);
        toast({ title: t("license.create.success") });
        onCreated({ ...res.data, ...dto });
        onClose();
      }
    } catch {
      toast({ title: t("license.create.error"), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("license.create.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {step === 1 ? t("license.create.subtitle") : t("license.edit.subtitle")}
          </p>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>{t("license.create.emailLabel")}</Label>
              {isLoadingAdmins ? (
                <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
              ) : admins.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("license.create.noAdmins")}</p>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-8"
                      placeholder={t("license.create.selectPlaceholder")}
                      value={query}
                      disabled={isSaving}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedEmail("");
                        setIsOpen(true);
                      }}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setTimeout(() => setIsOpen(false), 150)}
                    />
                  </div>
                  {isOpen && filteredAdmins.length > 0 && (
                    <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover py-1 shadow-md">
                      {filteredAdmins.map((admin) => (
                        <li
                          key={admin.email}
                          className="cursor-pointer px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                          onMouseDown={() => handleSelect(admin.email)}
                        >
                          {admin.email}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isOpen && query.length > 0 && filteredAdmins.length === 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover px-3 py-2 text-sm text-muted-foreground shadow-md">
                      {t("common.noResults")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
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
              <Label>{t("license.edit.workersPerContractor")}</Label>
              <Input
                type="number"
                uppercase={false}
                min={0}
                value={workersPerContractor}
                onChange={(e) => setWorkersPerContractor(e.target.value)}
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
            <div className="col-span-2 flex items-center justify-between rounded-lg border border-playBlueLight/20 p-3">
              <div>
                <Label className="text-sm font-medium">{t("license.edit.enableInternalWorkers")}</Label>
                <p className="text-xs text-muted-foreground">{t("license.edit.enableInternalWorkersDesc")}</p>
              </div>
              <Switch
                checked={enableInternalWorkers}
                onCheckedChange={setEnableInternalWorkers}
              />
            </div>
            {enableInternalWorkers && (
              <div className="col-span-2 space-y-1">
                <Label>{t("license.edit.maxInternalWorkers")}</Label>
                <Input
                  type="number"
                  uppercase={false}
                  min={0}
                  value={maxInternalWorkers}
                  onChange={(e) => setMaxInternalWorkers(e.target.value)}
                  placeholder="∞"
                />
              </div>
            )}
            <div className="col-span-2 flex items-center justify-between rounded-lg border border-playBlueLight/20 p-3">
              <div>
                <Label className="text-sm font-medium">{t("license.edit.enableProjects")}</Label>
                <p className="text-xs text-muted-foreground">{t("license.edit.enableProjectsDesc")}</p>
              </div>
              <Switch
                checked={enableProjects}
                onCheckedChange={setEnableProjects}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {t("license.edit.cancel")}
              </Button>
              <Button
                className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                onClick={() => setStep(2)}
                disabled={!selectedEmail}
              >
                {t("license.create.next")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)} disabled={isSaving}>
                {t("license.create.back")}
              </Button>
              <Button
                className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                onClick={handleCreate}
                disabled={isSaving}
              >
                {isSaving ? "..." : t("license.create.confirm")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
  onCreateClick,
}: {
  tenants: TenantLicenseAdmin[];
  onEdit: (tenant: TenantLicenseAdmin) => void;
  onCreateClick: () => void;
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
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            uppercase={false}
            className="pl-9"
            placeholder={t("license.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1" />
          {t("license.create.button")}
        </Button>
      </div>

      <div className="rounded-lg border border-playBlueLight/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-playGrey">
              <TableHead>{t("license.table.admin")}</TableHead>
              <TableHead className="text-center">{t("license.table.contractors")}</TableHead>
              <TableHead className="text-center">{t("license.table.workersPerContractor")}</TableHead>
              <TableHead className="text-center">{t("license.table.internalWorkers")}</TableHead>
              <TableHead className="text-center">{t("license.table.prlUsers")}</TableHead>
              <TableHead className="text-center">{t("license.table.sites")}</TableHead>
              <TableHead className="text-center">{t("license.table.threshold")}</TableHead>
              <TableHead className="text-center">{t("license.table.projects")}</TableHead>
              <TableHead className="text-right">{t("license.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
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
                  <TableCell className="text-center text-sm">
                    {tenant.workersPerContractor ?? "∞"}
                  </TableCell>
                  <TableCell>
                    {tenant.enableInternalWorkers ? (
                      <LimitCell current={tenant.currentInternalWorkers} max={tenant.maxInternalWorkers} />
                    ) : (
                      <span className="block text-center text-xs text-muted-foreground">
                        {t("license.table.moduleOff")}
                      </span>
                    )}
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
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tenant.enableProjects ? "bg-playGreen/10 text-playGreen" : "bg-playGrey text-muted-foreground"}`}>
                      {tenant.enableProjects ? t("license.table.projectsOn") : t("license.table.projectsOff")}
                    </span>
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
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const handleCreated = (newTenant: TenantLicenseAdmin) => {
    setTenants((prev) => {
      const exists = prev.some((t) => t.adminUserId === newTenant.adminUserId);
      return exists ? prev : [...prev, newTenant];
    });
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
          <TenantTable
            tenants={tenants}
            onEdit={setEditTarget}
            onCreateClick={() => setShowCreateModal(true)}
          />
        )}
      </div>

      {editTarget && (
        <EditLicenseModal
          tenant={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {showCreateModal && (
        <CreateLicenseModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
          tenants={tenants}
        />
      )}
    </div>
  );
}
