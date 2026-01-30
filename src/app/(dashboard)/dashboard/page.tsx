"use client";

import { AuthorizedPersonnelTable } from "@/components/AuthorizedPersonnelTable";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useCompanies } from "@/hooks/useCompanies";
import { useWorkers } from "@/hooks/useWorkers";
import { useTranslation } from "@/hooks/useTranslation";
import { Company, CompanySimple, CompanyStatus } from "@/types/company";
import { WorkerStatus } from "@/types/worker";

import {
  AlertTriangle,
  ChartBarStacked,
  CheckCircle,
  Clock,
  Users,
  Building2,
  Network,
} from "lucide-react";
import { useMemo } from "react";

export default function DashboardPage() {
  const { companies } = useCompanies();
  const { workers } = useWorkers(undefined);
  const { t } = useTranslation();

  // Aplanar empresas + subcontratas en una sola lista (solo activas)
  const allCompanies = useMemo(() => {
    const all: (Company | CompanySimple)[] = [];
    companies
      .filter((company) => company.active)
      .forEach((company) => {
        all.push(company);
        if (company.subcontractors) {
          all.push(...company.subcontractors.filter((sub) => sub.active));
        }
      });
    return all;
  }, [companies]);

  // Estadísticas
  const stats = useMemo(() => {
    const mainCompanies = companies.length;
    const subcontractors = allCompanies.length - mainCompanies;
    const total = allCompanies.length;

    const pending = allCompanies.filter(
      (c) => c.status === CompanyStatus.Pending
    ).length;

    const approved = allCompanies.filter(
      (c) =>
        c.status === CompanyStatus.Approved &&
        c.workerStatus === WorkerStatus.Approved
    ).length;

    const rejected = allCompanies.filter(
      (c) =>
        c.status === CompanyStatus.Rejected ||
        (c.status === CompanyStatus.Approved &&
          c.workerStatus !== WorkerStatus.Approved)
    ).length;

    return {
      total,
      mainCompanies,
      subcontractors,
      pending,
      approved,
      rejected,
    };
  }, [companies, allCompanies]);

  const totalNoAptoWorkers = workers.filter(
    (w) => w.status === WorkerStatus.Rejected
  ).length;

  const noAptoWorkers = workers
    .filter((w) => w.status === WorkerStatus.Rejected)
    .map((w) => {
      const company = allCompanies.find((c) => c.id === w.companyId);
      return {
        ...w,
        companyName: company?.name || "",
        nextExpiryDate: "-",
      };
    });

  return (
    <div className="">
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div className="flex w-full justify-between">
              <h1 className="text-2xl h-10 font-bold text-brand-primary flex items-center gap-3">
                <ChartBarStacked className="h-7 w-7 text-brand-primary" />
                {t("dashboard.title")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* KPIs principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                {t("dashboard.stats.totalCompanies")}
              </CardTitle>
              <Users className="h-4 w-4 text-playBlueLight" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">
                {stats.total}
              </div>
              <div className="flex items-center gap-3 text-xs text-playBlueLight">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {stats.mainCompanies} {t("dashboard.stats.mainCompanies")}
                </span>
                {stats.subcontractors > 0 && (
                  <span className="flex items-center gap-1">
                    <Network className="h-3 w-3 text-playOrange" />
                    {stats.subcontractors} {t("dashboard.stats.subcontractors")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                {t("dashboard.stats.authorized")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-playGreen" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-playGreen">
                {stats.approved}
              </div>
              <p className="text-xs text-playBlueLight">
                {stats.total > 0
                  ? Math.round((stats.approved / stats.total) * 100)
                  : 0}
                {t("dashboard.stats.ofTotal")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                {t("dashboard.stats.pending")}
              </CardTitle>
              <Clock className="h-4 w-4 text-playYellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-playYellow">
                {stats.pending}
              </div>
              <p className="text-xs text-playBlueLight">{t("dashboard.stats.requireReview")}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                {t("dashboard.stats.notAuthorized")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-secondary">
                {stats.rejected}
              </div>
              <p className="text-xs text-playBlueLight">{t("dashboard.stats.accessDenied")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {totalNoAptoWorkers > 0 && (
        <>
          <div className="container mx-auto px-4">
            <Alert className="bg-brand-secondary/20 border border-brand-secondary/40 text-brand-primary">
              <AlertTriangle className="h-4 w-4 text-brand-secondary" />
              <AlertDescription>
                {t("dashboard.alerts.workersNoAccess", { 
                  count: totalNoAptoWorkers.toString(), 
                  plural: totalNoAptoWorkers > 1 ? "es" : "" 
                })}
              </AlertDescription>
            </Alert>
          </div>

          <div className="container mx-auto px-4 py-8 space-y-8">
            <AuthorizedPersonnelTable
              workers={noAptoWorkers}
              onViewWorker={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
}
