import React, { useState } from "react";
import { Company, CompanySimple } from "@/types/company";
import { Edit, Trash2, Check, Network } from "lucide-react";
import { useSortableTable } from "@/hooks/useSortableTable";
import { SortableHeader } from "./SortableHeader";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { TableCard } from "./TableCard";
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
import { WorkerCountBadge } from "./WorkerCountBadge";
import { useTranslation } from "@/hooks/useTranslation";

type SortField = "name" | "taxId" | "contactPerson" | "email" | "status" | "workerStatus";

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
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteCompany, setDeleteCompany] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { sortField, sortDirection, handleSort, sortedData: sortedCompanies } =
    useSortableTable<Company, SortField>(companies, (a, b, field) => {
      switch (field) {
        case "name":          return a.name.localeCompare(b.name);
        case "taxId":         return (a.taxId || "").localeCompare(b.taxId || "");
        case "contactPerson": return (a.contactPerson || "").localeCompare(b.contactPerson || "");
        case "email":         return (a.email || "").localeCompare(b.email || "");
        case "status":        return String(a.status || "").localeCompare(String(b.status || ""));
        case "workerStatus":  return String(a.workerStatus || "").localeCompare(String(b.workerStatus || ""));
      }
    });

  const handleDeleteClick = (company: Company) => {
    setDeleteCompany(company);
  };

  const handleDeleteCompany = async () => {
    if (!deleteCompany) return;

    setIsDeleting(true);
    try {
      onDeleteCompany(deleteCompany.id!);
      toast({
        title: t("companies.deleted"),
        description: t("companies.deletedDesc", { name: deleteCompany.name }),
      });
    } catch (error) {
      toast({
        title: t("errors.generic"),
        description: t("companies.deleteError"),
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
            {t("companies.noResults")}
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
                {t("companies.inactive")}
              </Badge>
            )}
            {isSubcontractor && (
              <Badge
                variant="outline"
                className="text-xs border-playOrange/50 text-playOrange bg-playOrange/5"
              >
                {t("companies.subcontractor")}
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
      <TableCell className="text-center min-w-[140px]">
        <WorkerCountBadge approvedWorkers={company.approvedWorkers} totalWorkers={company.totalWorkers} />
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
              {t("common.activate")}
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  const subtitle = companies.some((c) => c.subcontractors?.length)
    ? `· ${companies.filter((c) => !c.isSubcontractor).length} ${t("companies.main")}`
    : undefined;

  return (
    <>
      <TableCard title={t("companies.registered", { count: totalCount })} subtitle={subtitle}>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("companies.companyName")}</SortableHeader>
              <SortableHeader field="taxId" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("companies.cif")}</SortableHeader>
              <SortableHeader field="contactPerson" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("companies.contact")}</SortableHeader>
              <SortableHeader field="email" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("common.email")}</SortableHeader>
              <SortableHeader field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="min-w-[140px] text-center">
                {t("dashboard.company")}
              </SortableHeader>
              <SortableHeader field="workerStatus" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="min-w-[140px]">
                {t("dashboard.workers")}
              </SortableHeader>
              <TableHead className="text-right">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.map((company) => (
              <React.Fragment key={company.id}>
                {renderRow(company, false)}
                {company.subcontractors?.map((sub) =>
                  renderRow(sub, true, company.name)
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableCard>
      <DeleteConfirmationModal
        isOpen={!!deleteCompany}
        onClose={() => setDeleteCompany(null)}
        onConfirm={handleDeleteCompany}
        title={t("companies.deleteCompany")}
        description={t("companies.confirmDelete")}
        itemName={deleteCompany ? `${deleteCompany.name} ` : undefined}
        isLoading={isDeleting}
      />
    </>
  );
};
