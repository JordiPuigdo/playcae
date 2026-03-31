"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Building2, FileCheck2, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useAuthStore } from "@/hooks/useAuthStore";
import { usePendingValidation } from "@/hooks/usePendingValidation";
import { useTranslation } from "@/hooks/useTranslation";
import { Document, EntityStatus } from "@/types/document";
import { PendingValidationOwnerType } from "@/types/pendingValidation";
import { UserRole } from "@/types/user";
import { DocumentStatusBadge } from "@/components/DocumentStatusBadge";
import { DocumentValidation } from "@/components/DocumentValidation";
import { DocumentService } from "@/services/document.service";

export default function DocumentsManagementPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const isAdmin = user?.role === UserRole.Admin;
  const documentService = useMemo(() => new DocumentService(), []);

  const { items, isLoading, refresh } = usePendingValidation(user?.userId, {
    includeActionRequired: false,
    includeSubcontractors: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const companyOptions = useMemo(() => {
    const unique = Array.from(
      new Map(
        items
          .filter((item) => item.status === EntityStatus.PendingManualy)
          .map((item) => [item.companyId, item.companyName])
      ).entries()
    );
    return unique.sort((a, b) => a[1].localeCompare(b[1]));
  }, [items]);

  const manualPendingItems = useMemo(
    () => items.filter((item) => item.status === EntityStatus.PendingManualy),
    [items]
  );

  const filteredItems = useMemo(() => {
    return manualPendingItems.filter((item) => {
      const ownerType = item.isCompanyDocument
        ? PendingValidationOwnerType.Company
        : PendingValidationOwnerType.Worker;

      const matchesSearch =
        !searchTerm ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.workerFullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.documentTypeName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCompany = companyFilter === "all" || item.companyId === companyFilter;
      const matchesOwner = ownerFilter === "all" || ownerType === ownerFilter;

      return matchesSearch && matchesCompany && matchesOwner;
    });
  }, [manualPendingItems, searchTerm, companyFilter, ownerFilter]);

  const formatDate = (value?: string | null) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const mapItemToDocument = (item: (typeof filteredItems)[number]): Document => ({
    id: item.documentId,
    active: true,
    status: item.status as EntityStatus,
    originalName: item.documentTypeName,
    storagePath: "",
    uploadedDate: item.uploadedDate ?? "",
    expirationDate: item.expirationDate ?? undefined,
    documentType: {
      id: "",
      code: "",
      name: item.documentTypeName,
    },
  });

  const handleValidateDocument = async (
    documentId: string,
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => {
    const status = isValid ? EntityStatus.Approved : EntityStatus.Rejected;
    await documentService.manualValidation(documentId, {
      status,
      expirationDate: expiryDate || new Date().toISOString(),
      comment,
    });
    await refresh();
  };

  const handleOpenDocument = async (documentId: string) => {
    try {
      const response = await documentService.open(documentId);
      if (response.status === 200 && response.data) {
        window.open(response.data, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error al abrir documento", error);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t("pendingValidation.noPermission")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-3">
        <FileCheck2 className="h-8 w-8 text-brand-primary mt-1" />
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">{t("pendingValidation.title")}</h1>
          <p className="text-muted-foreground">{t("pendingValidation.subtitle")}</p>
        </div>
      </div>

      <Card className="bg-white border border-playBlueLight/30">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("pendingValidation.filters.searchPlaceholder")}
                className="pl-10 border-playBlueLight/50"
              />
            </div>

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-[240px] border-playBlueLight/50">
                <SelectValue placeholder={t("pendingValidation.filters.company")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pendingValidation.filters.allCompanies")}</SelectItem>
                {companyOptions.map(([companyId, companyName]) => (
                  <SelectItem key={companyId} value={companyId}>
                    {companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[220px] border-playBlueLight/50">
                <SelectValue placeholder={t("pendingValidation.filters.ownerType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("pendingValidation.filters.allOwnerTypes")}</SelectItem>
                <SelectItem value={PendingValidationOwnerType.Company}>
                  {t("pendingValidation.owner.company")}
                </SelectItem>
                <SelectItem value={PendingValidationOwnerType.Worker}>
                  {t("pendingValidation.owner.worker")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <CardTitle className="text-brand-primary">{t("pendingValidation.tableTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-playBlueLight">{t("pendingValidation.empty")}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-playGrey">
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.company")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.owner")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.documentType")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.status")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.uploadedDate")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.expirationDate")}
                  </TableHead>
                  <TableHead className="text-brand-primary">
                    {t("pendingValidation.columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.documentId} className="hover:bg-playGrey/30">
                    <TableCell className="text-brand-primary font-medium">{item.companyName}</TableCell>
                    <TableCell className="text-brand-primary">
                      {item.isCompanyDocument
                        ? t("pendingValidation.owner.company")
                        : item.workerFullName || "-"}
                    </TableCell>
                    <TableCell className="text-brand-primary">
                      <button
                        type="button"
                        onClick={() => handleOpenDocument(item.documentId)}
                        title={item.documentTypeName}
                        className="text-left hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
                      >
                        {item.documentTypeName}
                      </button>
                    </TableCell>
                    <TableCell>
                      <DocumentStatusBadge status={item.status as EntityStatus} />
                    </TableCell>
                    <TableCell className="text-brand-primary">
                      {formatDate(item.uploadedDate)}
                    </TableCell>
                    <TableCell className="text-brand-primary">
                      {formatDate(item.expirationDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <DocumentValidation
                          documentName={item.documentTypeName}
                          canValidate={isAdmin}
                          document={mapItemToDocument(item)}
                          onValidate={(isValid, comment, expiryDate) =>
                            handleValidateDocument(
                              item.documentId,
                              isValid,
                              comment,
                              expiryDate
                            )
                          }
                          onSuccess={refresh}
                        />
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/companies/${item.companyId}`}>
                            <Building2 className="h-4 w-4 mr-1" />
                            {t("pendingValidation.actions.goToCompany")}
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
