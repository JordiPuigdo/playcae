import { Users, Eye, AlertTriangle } from "lucide-react";
import { Worker } from "@/types/worker";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/Table";
import { WorkerStatusBadge } from "./WorkerStatusBadge";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const isExpiringSoon = (expiryDateString: string) => {
    if (expiryDateString === "-") return false;

    const expiryDate = new Date(
      expiryDateString.split("/").reverse().join("-")
    );
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDateString: string) => {
    if (expiryDateString === "-") return false;

    const expiryDate = new Date(
      expiryDateString.split("/").reverse().join("-")
    );
    const today = new Date();

    return expiryDate < today;
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t("workers.unauthorizedPersonnel")} ({workers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("workers.firstName")}</TableHead>
                <TableHead>{t("workers.dni")}</TableHead>
                <TableHead>{t("workers.company")}</TableHead>
                <TableHead>{t("workers.position")}</TableHead>
                <TableHead>{t("workers.registrationDate")}</TableHead>
                <TableHead>{t("common.status")}</TableHead>
                <TableHead>{t("workers.nextExpiry")}</TableHead>
                <TableHead>{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {t("workers.noWorkersFiltered")}
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">
                      {worker.firstName} {worker.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {worker.cardId}
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-32 truncate"
                        title={worker.companyName}
                      >
                        {worker.companyName}
                      </div>
                    </TableCell>
                    <TableCell>{worker.position || "-"}</TableCell>
                    <TableCell>{formatDate(worker.creationDate!)}</TableCell>
                    <TableCell>
                      <WorkerStatusBadge status={worker.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{worker.nextExpiryDate}</span>
                        {isExpired(worker.nextExpiryDate) && (
                          <span title={t("workers.documentExpired")}>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          </span>
                        )}
                        {isExpiringSoon(worker.nextExpiryDate) &&
                          !isExpired(worker.nextExpiryDate) && (
                            <span title={t("workers.expiringSoon")}>
                              <AlertTriangle className="h-4 w-4 text-pending" />
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewWorker(worker.id!)}
                        className="gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        {t("workers.viewCard")}
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
