import React, { useState } from "react";
import { Company, CompanySimple } from "@/types/company";
import { Edit, Trash2, Check, Network } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/Table";
import { StatusBadge } from "./StatusBadge";
import { useRouter } from "next/navigation";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "@/hooks/use-Toast";
import { Badge } from "./ui/Badge";
import { WorkerStatusBadge } from "./WorkerStatusBadge";

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onActivateCompany: (companyId: string) => void;
}

export const CompanyTable = ({
  companies,
  onEdit,
  onDeleteCompany,
  onActivateCompany,
}: CompanyTableProps) => {
  const router = useRouter();
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (company: Company) => {
    setDeleteCompany(company);
  };

  const handleDeleteCompany = async () => {
    if (!deleteCompany) return;

    setIsDeleting(true);
    try {
      onDeleteCompany(deleteCompany.id!);
      toast({
        title: "Empresa Eliminada",
        description: `${deleteCompany.name} ha sido eliminada correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la empresa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteCompany(null);
    }
  };

  const handleActivateClick = (company: Company) => {
    if (!company.active) {
      onActivateCompany(company.id!);
    }
  };

  // Contar total incluyendo subcontratas
  const totalCount = companies.reduce((acc, company) => {
    return acc + 1 + (company.subcontractors?.length || 0);
  }, 0);

  if (companies.length === 0) {
    return (
      <Card className="bg-white">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No se encontraron empresas con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Renderizar una fila (empresa o subcontrata)
  const renderRow = (
    company: Company | CompanySimple,
    isSubcontractor: boolean = false,
    parentName?: string
  ) => (
    <TableRow
      key={company.id}
      className={`hover:bg-playOrange/5 cursor-pointer transition-colors group ${
        !company.active ? "opacity-60" : ""
      }`}
      onClick={() => router.push(`/dashboard/companies/${company.id}`)}
    >
      <TableCell className="font-medium">
        <div
          className={`flex flex-col gap-0.5 ${isSubcontractor ? "pl-8" : ""}`}
        >
          <div className="flex items-center gap-2">
            {isSubcontractor && (
              <Network className="h-4 w-4 text-playOrange flex-shrink-0" />
            )}
            <span className="group-hover:text-playOrange transition-colors">
              {company.name}
            </span>
            {!company.active && (
              <Badge variant="secondary" className="text-xs">
                Inactiva
              </Badge>
            )}
            {isSubcontractor && (
              <Badge
                variant="outline"
                className="text-xs border-playOrange/50 text-playOrange bg-playOrange/5"
              >
                Subcontrata
              </Badge>
            )}
          </div>
          {isSubcontractor && parentName && (
            <span className="text-xs text-muted-foreground pl-6">
              → {parentName}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="font-mono text-sm">{company.taxId}</TableCell>
      <TableCell>{company.contactPerson}</TableCell>
      <TableCell>{company.email}</TableCell>
      <TableCell className="text-center">
        <StatusBadge status={company.status} />
      </TableCell>
      <TableCell className="text-center bg-playBlueLight/20 min-w-[140px]">
        <WorkerStatusBadge status={company.workerStatus} />
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        {company.active ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(company as Company)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(company as Company)}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActivateClick(company as Company)}
              className="gap-1 text-success hover:text-success"
            >
              <Check className="h-3 w-3" />
              Activar
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Empresas Registradas ({totalCount})
          {companies.some((c) => c.subcontractors?.length) && (
            <span className="text-sm font-normal text-muted-foreground">
              · {companies.filter((c) => !c.isSubcontractor).length} principales
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>CIF</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="min-w-[140px] text-center">
                  Empresa
                </TableHead>
                <TableHead className="bg-playBlueLight/20 min-w-[140px]">
                  Trabajadores
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <React.Fragment key={company.id}>
                  {/* Empresa principal */}
                  {renderRow(company, false)}

                  {/* Subcontratas (siempre visibles, con indentación) */}
                  {company.subcontractors?.map((sub) =>
                    renderRow(sub, true, company.name)
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <DeleteConfirmationModal
        isOpen={!!deleteCompany}
        onClose={() => setDeleteCompany(null)}
        onConfirm={handleDeleteCompany}
        title="Eliminar Empresa"
        description="¿Estás seguro de que deseas eliminar esta empresa?"
        itemName={deleteCompany ? `${deleteCompany.name} ` : undefined}
        isLoading={isDeleting}
      />
    </Card>
  );
};
