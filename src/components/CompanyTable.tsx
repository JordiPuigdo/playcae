import { Company } from "@/types/company";
import { Eye, Edit, Trash2, Check } from "lucide-react";
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
import { useState } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "@/hooks/use-Toast";
import { Badge } from "./ui/Badge";

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

  const handleActivateClick = (company: Company) => {
    if (!company.active) {
      onActivateCompany(company.id!);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Empresas Registradas ({companies.length})</CardTitle>
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
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow
                  key={company.id}
                  className={`hover:bg-muted/50 ${
                    !company.active ? "opacity-60" : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    {company.name}
                    {!company.active && (
                      <Badge variant="secondary" className="text-xs">
                        Inactiva
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {company.taxId}
                  </TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={company.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {company.active ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push(`/dashboard/companies/${company.id}`);
                          }}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(company)}
                          className="gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(company)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleActivateClick(company)}
                          className="gap-1 text-success hover:text-success"
                        >
                          <Check className="h-3 w-3" />
                          Activar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
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
