"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  FileCheck2,
  Loader2,
  Search,
  X,
} from "lucide-react";
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

type SortField = "company" | "owner" | "documentType" | "uploadedDate" | "expirationDate";
type SortDirection = "asc" | "desc" | null;

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
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  const sortedItems = useMemo(() => {
    if (!sortField || !sortDirection) return filteredItems;
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "company":
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case "owner":
          comparison = (a.workerFullName || a.companyName).localeCompare(
            b.workerFullName || b.companyName
          );
          break;
        case "documentType":
          comparison = a.documentTypeName.localeCompare(b.documentTypeName);
          break;
        case "uploadedDate":
          comparison = (a.uploadedDate || "").localeCompare(b.uploadedDate || "");
          break;
        case "expirationDate":
          comparison = (a.expirationDate || "").localeCompare(b.expirationDate || "");
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredItems, sortField, sortDirection]);

  const hasActiveFilters =
    searchTerm !== "" || companyFilter !== "all" || ownerFilter !== "all";

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4 ml-1" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4 ml-1" />;
    return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCompanyFilter("all");
    setOwnerFilter("all");
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) return "-";
    return date.toLocaleDateString("es-ES", {
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
    <div>
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-playBlueLight" />
            <div>
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <FileCheck2 className="h-7 w-7 text-brand-primary" />
                {t("pendingValidation.title")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 ml-10">
                {t("pendingValidation.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card className="border border-playBlueLight/30 bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-brand-primary">
                  {t("pendingValidation.filters.searchLabel")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("pendingValidation.filters.searchPlaceholder")}
                    className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-2 min-w-[240px]">
                <label className="text-sm font-medium text-brand-primary">
                  {t("pendingValidation.filters.company")}
                </label>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                    <SelectValue placeholder={t("pendingValidation.filters.allCompanies")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30">
                    <SelectItem
                      value="all"
                      className="hover:bg-playGrey hover:text-brand-primary"
                    >
                      {t("pendingValidation.filters.allCompanies")}
                    </SelectItem>
                    {companyOptions.map(([companyId, companyName]) => (
                      <SelectItem
                        key={companyId}
                        value={companyId}
                        className="hover:bg-playGrey hover:text-brand-primary"
                      >
                        {companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[220px]">
                <label className="text-sm font-medium text-brand-primary">
                  {t("pendingValidation.filters.ownerType")}
                </label>
                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                    <SelectValue placeholder={t("pendingValidation.filters.allOwnerTypes")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-playBlueLight/30">
                    <SelectItem
                      value="all"
                      className="hover:bg-playGrey hover:text-brand-primary"
                    >
                      {t("pendingValidation.filters.allOwnerTypes")}
                    </SelectItem>
                    <SelectItem
                      value={PendingValidationOwnerType.Company}
                      className="hover:bg-playGrey hover:text-brand-primary"
                    >
                      {t("pendingValidation.owner.company")}
                    </SelectItem>
                    <SelectItem
                      value={PendingValidationOwnerType.Worker}
                      className="hover:bg-playGrey hover:text-brand-primary"
                    >
                      {t("pendingValidation.owner.worker")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className={`gap-2 border-playBlueLight transition-all ${
                  hasActiveFilters
                    ? "text-brand-primary hover:bg-playGrey"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <X className="h-4 w-4" />
                {t("pendingValidation.filters.clearFilters")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-playBlueLight/30">
          <CardHeader>
            <CardTitle className="text-brand-primary">
              {t("pendingValidation.tableTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
              </div>
            ) : sortedItems.length === 0 ? (
              <div className="text-center py-12 text-playBlueLight">
                {t("pendingValidation.empty")}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-playGrey">
                    <TableHead
                      className="text-brand-primary cursor-pointer select-none"
                      onClick={() => handleSort("company")}
                    >
                      <span className="flex items-center">
                        {t("pendingValidation.columns.company")}
                        {getSortIcon("company")}
                      </span>
                    </TableHead>
                    <TableHead
                      className="text-brand-primary cursor-pointer select-none"
                      onClick={() => handleSort("owner")}
                    >
                      <span className="flex items-center">
                        {t("pendingValidation.columns.owner")}
                        {getSortIcon("owner")}
                      </span>
                    </TableHead>
                    <TableHead
                      className="text-brand-primary cursor-pointer select-none"
                      onClick={() => handleSort("documentType")}
                    >
                      <span className="flex items-center">
                        {t("pendingValidation.columns.documentType")}
                        {getSortIcon("documentType")}
                      </span>
                    </TableHead>
                    <TableHead className="text-brand-primary">
                      {t("pendingValidation.columns.status")}
                    </TableHead>
                    <TableHead
                      className="text-brand-primary cursor-pointer select-none"
                      onClick={() => handleSort("uploadedDate")}
                    >
                      <span className="flex items-center">
                        {t("pendingValidation.columns.uploadedDate")}
                        {getSortIcon("uploadedDate")}
                      </span>
                    </TableHead>
                    <TableHead
                      className="text-brand-primary cursor-pointer select-none"
                      onClick={() => handleSort("expirationDate")}
                    >
                      <span className="flex items-center">
                        {t("pendingValidation.columns.expirationDate")}
                        {getSortIcon("expirationDate")}
                      </span>
                    </TableHead>
                    <TableHead className="text-brand-primary">
                      {t("pendingValidation.columns.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedItems.map((item) => (
                    <TableRow key={item.documentId} className="hover:bg-playGrey/30">
                      <TableCell className="text-brand-primary font-medium">
                        {item.companyName}
                      </TableCell>
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
    </div>
  );
}
