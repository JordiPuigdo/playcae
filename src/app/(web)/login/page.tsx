"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";

import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/user";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuthSession } from "@/hooks/useAuthSession";
import { ParentCompanySelector } from "@/components/ParentCompanySelector";
import { CompanySelector } from "@/components/CompanySelector";
import { useResolveCompanyContext } from "@/hooks/useResolveCompanyContext";
import { useSelectParentCompany } from "@/hooks/useSelectParentCompany";
import { UserService } from "@/services/user.services";
import dayjs from "dayjs";
import { Site } from "@/types/site";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [prlSites, setPrlSites] = useState<Site[]>([]);

  const {
    login,
    user,
    errorAuth,
    pendingCompanySelection,
    availableCompanies,
    selectedCompanyId,
    setSelectedCompany,
    pendingParentCompanySelection,
    availableParentCompanies,
    selectedParentCompanyId,
    pendingSiteSelection,
    setSelectedSite,
    setAvailableSites,
  } = useAuthStore();

  const { resolveCompanyContext } = useResolveCompanyContext();
  const selectParentCompany = useSelectParentCompany();
  const resolvingRef = useRef<string | null>(null);

  useAuthSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError(t("validation.required"));
      return;
    }

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  useEffect(() => {
    if (errorAuth) {
      setIsLoading(false);
      setError(errorAuth);
    }
  }, [errorAuth]);

  useEffect(() => {
    if (!user || user.role !== UserRole.Company) return;
    if (pendingCompanySelection) return;
    if (!selectedCompanyId) return;
    if (selectedParentCompanyId) return;
    if (pendingParentCompanySelection) return;
    if (resolvingRef.current === selectedCompanyId) return;

    resolvingRef.current = selectedCompanyId;
    setIsLoading(false);
    setIsLoadingCompanies(true);
    resolveCompanyContext(selectedCompanyId)
      .catch((err) => {
        console.error("Error al resolver el contexto de la empresa:", err);
        setError("Error al cargar las empresas disponibles");
      })
      .finally(() => setIsLoadingCompanies(false));
  }, [
    user,
    pendingCompanySelection,
    selectedCompanyId,
    selectedParentCompanyId,
    pendingParentCompanySelection,
    resolveCompanyContext,
  ]);

  const handleCompanySelect = (companyId: string) => {
    setIsLoading(true);
    setSelectedCompany(companyId);
  };

  useEffect(() => {
    const loadPrlSites = async () => {
      if (!user || !pendingSiteSelection || user.role !== UserRole.PRLManager) {
        return;
      }

      setIsLoading(false);
      setIsLoadingCompanies(true);
      try {
        const userService = new UserService();
        const response = await userService.getSitesByUserId(user.userId);
        const sites = response.data || [];
        setPrlSites(sites);
        setAvailableSites(
          sites
            .filter((s) => !!s.id)
            .map((s) => ({
              id: s.id as string,
              name: s.name,
            }))
        );

        if (sites.length === 0) {
          setError("Tu usuario PRL no tiene sedes asignadas. Contacta con un administrador.");
          return;
        }

        if (sites.length === 1 && sites[0].id) {
          setSelectedSite(sites[0].id);
        }
      } catch (err) {
        console.error("Error loading PRL sites:", err);
        setError("Error al cargar las sedes disponibles");
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    loadPrlSites();
  }, [user, pendingSiteSelection, setSelectedSite, setAvailableSites]);

  const handleParentCompanySelect = async (companyId: string) => {
    setIsLoading(true);
    await selectParentCompany(companyId);
  };

  const handleSiteSelect = (siteId: string) => {
    setSelectedSite(siteId);
  };

  useEffect(() => {
    if (!user) return;
    if (dayjs().isAfter(dayjs(user.refreshTokenExpiryTime))) return;
    if (pendingCompanySelection) return;
    if (pendingParentCompanySelection) return;
    if (pendingSiteSelection) return;

    if (
      user?.role === UserRole.Company &&
      !selectedParentCompanyId &&
      !pendingParentCompanySelection
    ) {
      return;
    }

    if (user?.role === UserRole.SuperAdmin) {
      router.push("/dashboard/settings/licenses");
    } else if (user?.role === UserRole.Marketing) {
      router.push("/dashboard/blog");
    } else if (user?.role === UserRole.Admin) {
      router.push("/dashboard");
    } else if (user?.role === UserRole.PRLManager) {
      router.push("/dashboard");
    } else if (user?.role === UserRole.Company) {
      const companyId = selectedCompanyId ?? user.companyId;
      const activeCompany = availableCompanies.find((c) => c.id === companyId);
      const isNew = activeCompany ? activeCompany.isNew : user.isNew;
      if (isNew) {
        router.push(`/onboarding?token=${companyId}`);
      } else {
        router.push(`/dashboard/companies/${companyId}`);
      }
    }
  }, [
    user,
    pendingCompanySelection,
    pendingParentCompanySelection,
    pendingSiteSelection,
    selectedCompanyId,
    selectedParentCompanyId,
    availableCompanies,
    router,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-playGrey p-4">
      {(isLoading || isLoadingCompanies) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-playGrey/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-sm text-playBlueLight" aria-live="polite">
              {t("common.loading")}
            </p>
          </div>
        </div>
      )}

      {pendingCompanySelection && user && availableCompanies.length > 1 ? (
        <CompanySelector
          companies={availableCompanies}
          isLoading={isLoadingCompanies}
          onSelect={handleCompanySelect}
        />
      ) : pendingParentCompanySelection && user && availableParentCompanies.length > 1 ? (
        <ParentCompanySelector
          companies={availableParentCompanies}
          isLoading={isLoadingCompanies}
          onSelect={handleParentCompanySelect}
        />
      ) : pendingSiteSelection && user && prlSites.length > 1 ? (
        <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-brand-primary">
              Selecciona sede
            </CardTitle>
            <CardDescription className="text-center text-playBlueLight">
              Tu usuario PRL tiene acceso a varias sedes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {prlSites.map((site) => (
              <Button
                key={site.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSiteSelect(site.id || "")}
              >
                {site.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-brand-primary">
              {t("auth.login.title")}
            </CardTitle>
            <CardDescription className="text-center text-playBlueLight">
              {t("auth.login.noAccount")} {t("auth.login.register")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-l-4 border-brand-secondary bg-brand-secondary/10">
                  <AlertDescription className="text-brand-secondary">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-primary">
                  {t("auth.login.email")} *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="border-playBlueLight focus-visible:ring-brand-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>

              <PasswordInput
                id="password"
                name="password"
                label={`${t("auth.login.password")} *`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.login.password")}
                autoComplete="current-password"
                required
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal text-sm text-playBlueLight hover:text-brand-primary"
                  onClick={() => router.push("/forgot-password")}
                >
                  {t("auth.login.forgotPassword")}
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
              >
                {isLoading ? t("common.loading") : t("auth.login.submit")}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-brand-primary hover:bg-playGrey"
                onClick={() => router.push("/register")}
              >
                {t("auth.login.noAccount")} {t("auth.login.register")}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


