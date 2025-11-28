"use client";

import { AuthorizedPersonnelTable } from "@/components/AuthorizedPersonnelTable";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useCompanies } from "@/hooks/useCompanies";
import { useWorkers } from "@/hooks/useWorkers";
import { CompanyStatus } from "@/types/company";
import { EntityStatus } from "@/types/document";
import { WorkerStatus } from "@/types/worker";

import {
  AlertTriangle,
  ChartBarStacked,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  /*const { 
    workers, 
    userRole, 
    filteredWorkers, 
    createWorker, 
    updateWorker, 
    deleteWorker,
    uploadWorkerDocument, 
    validateWorkerDocument 
  } = useWorkers(companyId);

    const getStatusStats = () => {
    const stats = {
      total: workers.length,
      apto: workers.filter(w => w.status === 'Apto').length,
      pendiente: workers.filter(w => w.status === 'Pendiente').length,
      noApto: workers.filter(w => w.status === 'No apto').length
    };
    return stats;
  };

  const stats = getStats();*/
  const { companies } = useCompanies();
  const total = companies.length;
  const totalPending = companies.filter(
    (c) => c.status === CompanyStatus.Pending
  ).length;
  const totalApto = companies.filter(
    (c) => c.status === CompanyStatus.Approved
  ).length;
  const totalNoApto = companies.filter(
    (c) => c.status === CompanyStatus.Rejected
  ).length;
  const { workers } = useWorkers(undefined);

  const totalNoAptoWorkers = workers.filter(
    (w) => w.status === WorkerStatus.Rejected
  ).length;
  const noAptoWorkers = workers
    .filter((w) => w.status === WorkerStatus.Rejected)
    .map((w) => {
      const company = companies.find((c) => c.id === w.companyId);
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
                Panel de Control
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                Total Empresas
              </CardTitle>
              <Users className="h-4 w-4 text-playBlueLight" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-primary">
                {companies.length}
              </div>
              <p className="text-xs text-playBlueLight">Empresas registradas</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                Autorizadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-playGreen" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-playGreen">
                {totalApto}
              </div>
              <p className="text-xs text-playBlueLight">
                {total > 0 ? Math.round((totalApto / total) * 100) : 0}% del
                total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-playYellow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-playYellow">
                {totalPending}
              </div>
              <p className="text-xs text-playBlueLight">Requieren revisión</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-playBlueLight/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brand-primary">
                No Autorizadas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-secondary">
                {totalNoApto}
              </div>
              <p className="text-xs text-playBlueLight">Acceso denegado</p>
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
                Hay {totalNoAptoWorkers} trabajador
                {totalNoAptoWorkers > 1 ? "es" : ""} sin autorización para
                acceder a las instalaciones.
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
