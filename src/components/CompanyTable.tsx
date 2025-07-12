import { Company } from '@/types/company';
import { Eye, Edit } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/Table';
import { StatusBadge } from './StatusBadge';
import { useRouter } from 'next/navigation';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
}

export const CompanyTable = ({ companies, onEdit }: CompanyTableProps) => {
  const router = useRouter();
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
                <TableRow key={company.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-mono text-sm">{company.cif}</TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={company.status} />
                  </TableCell>
                  <TableCell className="text-right">
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
