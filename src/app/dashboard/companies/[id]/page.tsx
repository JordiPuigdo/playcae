"use client";

import { CompanyDetailHeader } from "@/components/CompanyDetailHeader";
import { CompanyObservations } from "@/components/CompanyObservations";
import { DocumentsTable } from "@/components/DocumentTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { WorkersTable } from "@/components/WorkersTable";
import { useCompanies } from "@/hooks/useCompanies";
import { useDocuments } from "@/hooks/useDocuments";
import { useWorkers } from "@/hooks/useWorkers";
import {
  Building2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  User,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { companies } = useCompanies();

  const { documents, observations } = useDocuments(id || "");

  const company = companies.find((c) => c.id === id);
  const { workers } = useWorkers(company?.id);

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Empresa no encontrada
            </h2>
            <p className="text-muted-foreground mb-4">
              La empresa que buscas no existe o no tienes permisos para verla.
            </p>
            <Button onClick={() => {}}>Volver al listado</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <CompanyDetailHeader companyName={company?.name || ""} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Company Info */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Nombre
                </div>
                <div className="font-semibold">{company.name}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  CIF
                </div>
                <div className="font-mono text-sm">{company.cif}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Contacto
                </div>
                <div>{company.contactPerson}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <div className="text-sm">{company.email}</div>
              </div>

              {company.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </div>
                  <div className="text-sm">{company.phone}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Estado
                </div>
                <StatusBadge status={company.status} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Tabs defaultValue="workers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-200">
            <TabsTrigger value="workers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Documentos Trabajadores ({workers.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos Empresa
            </TabsTrigger>
            <TabsTrigger
              value="observations"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Observaciones
            </TabsTrigger>
          </TabsList>
          <TabsContent value="workers" className="space-y-6">
            <WorkersTable
              onCreateWorker={() => {}}
              onUpdateWorker={() => {}}
              onDeleteWorker={() => {}}
              userRole="administrador"
              onUploadDocument={() => {}}
              onValidateDocument={() => {}}
              workers={workers}
            />
          </TabsContent>
          <TabsContent value="documents" className="space-y-6">
            <DocumentsTable
              documents={documents}
              userRole="administrador"
              onUpload={() => {}}
              onValidate={() => {}}
            />
          </TabsContent>

          <TabsContent value="observations" className="space-y-6">
            <CompanyObservations
              observations={observations}
              userRole="administrador"
              onAddObservation={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
