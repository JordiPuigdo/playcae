"use client";

import { useEffect, useState } from "react";
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
import { ParentCompany, UserRole } from "@/types/user";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuthSession } from "@/hooks/useAuthSession";
import { ParentCompanySelector } from "@/components/ParentCompanySelector";
import { CompanyService } from "@/services/companies.service";
import { HttpClient } from "@/services/http-client";
import { UserService } from "@/services/user.services";
import dayjs from "dayjs";
import { useUserConfiguration } from "@/hooks/useUserConfiguration";
import { Site } from "@/types/site";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [parentCompanies, setParentCompanies] = useState<ParentCompany[]>([]);
  const [prlSites, setPrlSites] = useState<Site[]>([]);

  const {
    login,
    user,
    errorAuth,
    pendingParentCompanySelection,
    pendingSiteSelection,
    setSelectedParentCompany,
    setSelectedSite,
    setAvailableSites,
    setLogoUrl,
  } = useAuthStore();

  const { getLogoUrl } = useUserConfiguration();

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

  // Cargar empresas padre cuando sea necesario
  useEffect(() => {
    const loadParentCompanies = async () => {
      if (
        user &&
        pendingParentCompanySelection &&
        user.role === UserRole.Company
      ) {

        // Ocultar el overlay de "Iniciando sesión" para mostrar el selector
        setIsLoading(false);
        setIsLoadingCompanies(true);
        try {
          const companyService = new CompanyService(new HttpClient());
          const response = await companyService.getParentCompanies(
            user.companyId,
          );
          if (response?.data) {
            
            // Mapear a ParentCompany (backend devuelve userId)
            const companies: ParentCompany[] = response.data.map((c) => ({
              id: c.userId,
              name: c.name,
            }));
            setParentCompanies(companies);

            // Si no hay empresas padre, usar la propia empresa del usuario
            if (companies.length === 0) {
              setSelectedParentCompany(user.companyId);
            }
            // Si solo hay una empresa, seleccionarla automáticamente
            else if (companies.length === 1) {
              setSelectedParentCompany(companies[0].id);
            }
          }
        } catch (err) {
          console.error("Error loading parent companies:", err);
          setError("Error al cargar las empresas disponibles");
        } finally {
          setIsLoadingCompanies(false);
        }
      }
    };

    loadParentCompanies();
  }, [user, pendingParentCompanySelection, setSelectedParentCompany]);

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

  // Manejar selección de empresa padre
  const handleParentCompanySelect = async (companyId: string) => {
    try {
      const url = await getLogoUrl(companyId);
      console.log("Logo URL seleccionada:", url);
      if (url) {
        setLogoUrl(url);
      }
      setIsLoading(true);
      setSelectedParentCompany(companyId);
    } catch (err) {
      console.error("Error al obtener logo:", err);
      setSelectedParentCompany(companyId);
    }
  };

  const handleSiteSelect = (siteId: string) => {
    setSelectedSite(siteId);
  };

      // company que es UserId!
  

 
  useEffect(() => {
    if (!user) return;
    if (dayjs().isAfter(dayjs(user.refreshTokenExpiryTime))) return;
    // No redirigir si está pendiente de seleccionar empresa
    if (pendingParentCompanySelection) return;
    if (pendingSiteSelection) return;

    if (user?.role === UserRole.SuperAdmin) {
      router.push("/dashboard/settings/licenses");
    } else if (user?.role === UserRole.Marketing) {
      router.push("/dashboard/blog");
    } else if (user?.role === UserRole.Admin) {
      router.push("/dashboard");
    } else if (user?.role === UserRole.PRLManager) {
      router.push("/dashboard");
    } else if (user?.role === UserRole.Company) {
      if (user.isNew) {
        router.push(`/onboarding?token=${user.companyId}`);
      } else {
        router.push(`/dashboard/companies/${user.companyId}`);
      }
    }
  }, [user, pendingParentCompanySelection, pendingSiteSelection, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-playGrey p-4">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-playGrey/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <p className="text-sm text-playBlueLight" aria-live="polite">
              {t("common.loading")}
            </p>
          </div>
        </div>
      )}

      {/* Selector de empresa padre */}
      {pendingParentCompanySelection && user && parentCompanies.length > 1 ? (
        <ParentCompanySelector
          companies={parentCompanies}
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

              {/* Botón principal: azul oficial */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
              >
                {isLoading ? t("common.loading") : t("auth.login.submit")}
              </Button>

              {/* Botón secundario: estilo gris neutro */}
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


