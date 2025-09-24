"use client";

import { AuthorizedPersonnelTable } from "@/components/AuthorizedPersonnelTable";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useCompanies } from "@/hooks/useCompanies";
import { useWorkers } from "@/hooks/useWorkers";
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
    (c) => c.status === EntityStatus.Pending
  ).length;
  const totalApto = companies.filter(
    (c) => c.status === EntityStatus.Approved
  ).length;
  const totalNoApto = companies.filter(
    (c) => c.status === EntityStatus.Rejected
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
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 w-px bg-border" />
            <div className="flex w-full justify-between">
              <h1 className="text-2xl h-10 font-bold text-foreground flex items-center gap-3">
                <ChartBarStacked className="h-7 w-7 text-primary" />
                Panel de Control
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Empresas
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground">
                Empresas registradas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{totalApto}</div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((totalApto / total) * 100) : 0}% del
                total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pending">
                {totalPending}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren revisión
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                No Autorizadas
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {totalNoApto}
              </div>
              <p className="text-xs text-muted-foreground">Acceso denegado</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {totalNoAptoWorkers > 0 && (
        <>
          <div className="container mx-auto px-4 ">
            <Alert className="bg-red-200/50">
              <AlertTriangle className="h-4 w-4" />
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
