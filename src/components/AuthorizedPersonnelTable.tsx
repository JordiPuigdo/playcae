import { Users, Eye, AlertTriangle } from 'lucide-react';
import { Worker } from '@/types/worker';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/Table';
import { WorkerStatusBadge } from './WorkerStatusBadge';

interface AuthorizedPersonnelTableProps {
  workers: Array<
    Worker & {
      companyName: string;
      nextExpiryDate: string;
    }
  >;
  onViewWorker: (workerId: string) => void;
}

export const AuthorizedPersonnelTable = ({
  workers,
  onViewWorker,
}: AuthorizedPersonnelTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const isExpiringSoon = (expiryDateString: string) => {
    if (expiryDateString === '-') return false;

    const expiryDate = new Date(expiryDateString.split('/').reverse().join('-'));
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDateString: string) => {
    if (expiryDateString === '-') return false;

    const expiryDate = new Date(expiryDateString.split('/').reverse().join('-'));
    const today = new Date();

    return expiryDate < today;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personal No Autorizado ({workers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trabajador</TableHead>
                <TableHead>DNI/NIE</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Fecha Alta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próximo Vencimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No se encontraron trabajadores con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">
                      {worker.firstName} {worker.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{worker.dni}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={worker.companyName}>
                        {worker.companyName}
                      </div>
                    </TableCell>
                    <TableCell>{worker.position || '-'}</TableCell>
                    <TableCell>{formatDate(worker.registrationDate)}</TableCell>
                    <TableCell>
                      <WorkerStatusBadge status={worker.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{worker.nextExpiryDate}</span>
                        {isExpired(worker.nextExpiryDate) && (
                          <span title="Documento caducado">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </span>
                        )}
                        {isExpiringSoon(worker.nextExpiryDate) &&
                          !isExpired(worker.nextExpiryDate) && (
                            <span title="Caduca pronto (menos de 30 días)">
                              <AlertTriangle className="h-4 w-4 text-pending" />
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewWorker(worker.id)}
                        className="gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        Ver Ficha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
