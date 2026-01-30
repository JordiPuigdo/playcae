"use client";

import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";
import { CompanySimple } from "@/types/company";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Loader from "@/components/Loader";
import {
  Network,
  Search,
  Building2,
  ChevronRight,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function SubcontractorsPage() {
  const {
    companies,
    loading: companiesLoading,
    getSubcontractors,
    getCompanyById,
  } = useCompanies();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const isAdmin = user?.role === UserRole.Admin;

  const [allSubcontractors, setAllSubcontractors] = useState<
    (CompanySimple & {
      parentCompanyName?: string;
      parentCompanyId?: string;
    })[]
  >([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<
    typeof allSubcontractors
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const hasLoadedRef = useRef(false);

  // Cargar subcontratas según el rol
  useEffect(() => {
    const loadSubcontractors = async () => {
      if (hasLoadedRef.current) return;
      if (!user) return;

      // Admin: esperar a que carguen las companies
      // Company: usar directamente su companyId
      if (isAdmin && (companiesLoading || !companies?.length)) return;
      if (!isAdmin && !user.companyId) return;

      hasLoadedRef.current = true;
      setIsLoading(true);

      const allSubs: (CompanySimple & {
        parentCompanyName?: string;
        parentCompanyId?: string;
      })[] = [];

      if (isAdmin) {
        // Admin: cargar subcontratas de todas las empresas principales
        const mainCompanies = companies.filter((c) => !c.isSubcontractor);

        for (const company of mainCompanies) {
          if (!company.id) continue;
          try {
            const subs = await getSubcontractors(company.id);
            subs.forEach((sub) => {
              allSubs.push({
                ...sub,
                parentCompanyName: company.name,
                parentCompanyId: company.id,
              });
            });
          } catch (error) {
            console.error(
              `Error loading subcontractors for company ${company.id}:`,
              error
            );
          }
        }
      } else {
        // Company: cargar solo subcontratas de su empresa
        try {
          const parentCompany = await getCompanyById(user.companyId);
          const subs = await getSubcontractors(user.companyId);
          subs.forEach((sub) => {
            allSubs.push({
              ...sub,
              parentCompanyName: parentCompany?.name || t("subcontractors.myCompany"),
              parentCompanyId: user.companyId,
            });
          });
        } catch (error) {
          console.error("Error loading subcontractors:", error);
        }
      }

      setAllSubcontractors(allSubs);
      setFilteredSubcontractors(allSubs);
      setIsLoading(false);
    };

    loadSubcontractors();
  }, [companies, companiesLoading, user, isAdmin, t]);

  // Filtrar por búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubcontractors(allSubcontractors);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allSubcontractors.filter(
      (sub) =>
        sub.name.toLowerCase().includes(term) ||
        sub.cif?.toLowerCase().includes(term) ||
        sub.parentCompanyName?.toLowerCase().includes(term)
    );
    setFilteredSubcontractors(filtered);
  }, [searchTerm, allSubcontractors]);

  if (companiesLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader text={t("common.loading")} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-playBlueDark flex items-center gap-3">
            <Network className="h-8 w-8 text-playOrange" />
            {t("subcontractors.title")}
          </h1>
          <p className="text-playBlueLight mt-1">
            {t("subcontractors.description")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {allSubcontractors.length} {t("dashboard.sidebar.subcontractors").toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Buscador */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("subcontractors.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de subcontratas */}
      {filteredSubcontractors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Network className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              {searchTerm
                ? t("subcontractors.noResults")
                : t("subcontractors.noSubcontractors")}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? t("common.search")
                : t("subcontractors.noSubcontractors")}
            </p>
            {!searchTerm && (
              <Button asChild className="mt-4">
                <Link href="/dashboard/companies">{t("dashboard.sidebar.companies")}</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubcontractors.map((sub) => (
            <Card
              key={sub.id}
              className="hover:shadow-lg transition-all hover:border-playOrange/50 group"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-playOrange/10">
                      <Network className="h-5 w-5 text-playOrange" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-playOrange transition-colors">
                        {sub.name}
                      </CardTitle>
                      {sub.cif && (
                        <p className="text-sm text-muted-foreground">
                          CIF: {sub.cif}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Empresa padre */}
                <div className="flex items-center gap-2 text-sm text-playBlueLight">
                  <Building2 className="h-4 w-4" />
                  <span>{t("subcontractors.parentCompany")}:</span>
                  <Link
                    href={`/dashboard/companies/${sub.parentCompanyId}`}
                    className="font-medium hover:text-playBlueDark hover:underline"
                  >
                    {sub.parentCompanyName}
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{sub.workerCount || 0} {t("subcontractors.workers").toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{sub.documentCount || 0} {t("subcontractors.documents").toLowerCase()}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-2 border-t">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-between group"
                  >
                    <Link href={`/dashboard/companies/${sub.id}`}>
                      {t("subcontractors.viewDetails")}
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumen por empresa */}
      {allSubcontractors.length > 0 && !searchTerm && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-playBlueDark" />
              {t("subcontractors.parentCompany")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                // Agrupar por empresa padre
                const grouped = allSubcontractors.reduce((acc, sub) => {
                  const key = sub.parentCompanyId || "unknown";
                  if (!acc[key]) {
                    acc[key] = {
                      name: sub.parentCompanyName || t("common.none"),
                      id: sub.parentCompanyId,
                      count: 0,
                    };
                  }
                  acc[key].count++;
                  return acc;
                }, {} as Record<string, { name: string; id?: string; count: number }>);

                return Object.entries(grouped).map(([id, data]) => (
                  <Link
                    key={id}
                    href={`/dashboard/companies/${data.id}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-playGrey/50 hover:bg-playGrey transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-playBlueDark" />
                      <span className="font-medium">{data.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {data.count} {t("dashboard.sidebar.subcontractors").toLowerCase()}
                    </Badge>
                  </Link>
                ));
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
