"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { DocumentValidation } from "./DocumentValidation";
import { DocumentService } from "@/services/document.service";
import { Document, EntityStatus } from "@/types/document";
import { formatDate } from "@/app/utils/date";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  documentId: string | null;
  onClose: () => void;
  canValidate?: boolean;
  onValidated?: () => void;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-brand-primary">{value}</p>
    </div>
  );
}

export function DocumentDetailDrawer({ documentId, onClose, canValidate, onValidated }: Props) {
  const { t } = useTranslation();
  const documentService = useMemo(() => new DocumentService(), []);

  const [document, setDocument] = useState<Document | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpeningExternal, setIsOpeningExternal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setDocumentUrl(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setDocument(null);
    setDocumentUrl(null);

    Promise.all([
      documentService.getById(documentId),
      documentService.open(documentId),
    ])
      .then(([docRes, urlRes]) => {
        if (cancelled) return;
        const nextDocument =
          docRes.status === 200 && docRes.data ? docRes.data : null;
        const nextDocumentUrl =
          urlRes.status === 200 && urlRes.data ? urlRes.data : null;

        setDocument(nextDocument);
        setDocumentUrl(nextDocumentUrl);
        if (!nextDocument) setError(t("common.error"));
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error"));
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [documentId, documentService, t, reloadKey]);

  const handleValidate = useCallback(
    async (isValid: boolean, comment?: string, expiryDate?: string) => {
      if (!documentId) return;
      const status = isValid ? EntityStatus.Approved : EntityStatus.Rejected;
      await documentService.manualValidation(documentId, {
        status,
        expirationDate: expiryDate ?? "",
        comment,
      });
    },
    [documentId, documentService]
  );

  const handleValidateSuccess = useCallback(() => {
    setReloadKey((k) => k + 1);
    onValidated?.();
  }, [onValidated]);

  const isRejected = document?.status === EntityStatus.Rejected;
  const hasComment = Boolean(document?.comment);

  const statusLabel: Record<EntityStatus, string> = {
    [EntityStatus.Pending]: t("documents.detail.status.Pending"),
    [EntityStatus.Approved]: t("documents.detail.status.Approved"),
    [EntityStatus.Rejected]: t("documents.detail.status.Rejected"),
    [EntityStatus.Expired]: t("documents.detail.status.Expired"),
    [EntityStatus.ValidatedByAI]: t("documents.detail.status.ValidatedByAI"),
    [EntityStatus.ExpiredByAI]: t("documents.detail.status.ExpiredByAI"),
    [EntityStatus.PendingManualy]: t("documents.detail.status.PendingManualy"),
  };

  return (
    <Sheet
      open={Boolean(documentId)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b bg-playGrey shrink-0">
          <SheetTitle className="flex items-center gap-3 text-brand-primary">
            <FileText className="h-5 w-5 shrink-0" />
            <span className="truncate">
              {document?.documentType?.name ?? t("documents.document")}
            </span>
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-playOrange" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-brand-secondary text-sm px-6">
            {error}
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Panel izquierdo — detalles */}
            <div className="w-full lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r overflow-y-auto p-6 space-y-5 bg-white">
              {/* Estado */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("common.status")}
                </p>
                <div className="flex items-center gap-2">
                  {document && (
                    <>
                      <DocumentStatusBadge status={document.status} />
                      <span className="text-sm text-brand-primary">
                        {statusLabel[document.status]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Motivo de rechazo o comentario */}
              {hasComment && (
                <div
                  className={`rounded-md p-3 space-y-1 ${
                    isRejected
                      ? "bg-red-50 border border-red-200"
                      : "bg-playGrey"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                      isRejected ? "text-brand-secondary" : "text-muted-foreground"
                    }`}
                  >
                    {isRejected
                      ? t("documents.detail.rejectionReason")
                      : t("documents.detail.comment")}
                  </p>
                  <p className="text-sm text-brand-primary whitespace-pre-wrap">
                    {document?.comment}
                  </p>
                </div>
              )}

              {/* Fechas */}
              <div className="space-y-4">
                <DetailRow
                  label={t("documents.uploadDate")}
                  value={formatDate(document?.uploadedDate)}
                />
                <DetailRow
                  label={t("documents.expirationDate")}
                  value={formatDate(document?.expirationDate)}
                />
                <DetailRow
                  label={t("documents.detail.validationDate")}
                  value={formatDate(document?.validationDate)}
                />
              </div>

              {/* Validación */}
              {canValidate && document && (
                <DocumentValidation
                  documentName={document.documentType?.name ?? t("documents.document")}
                  canValidate={canValidate}
                  document={document}
                  onValidate={handleValidate}
                  onSuccess={handleValidateSuccess}
                />
              )}

              {/* Botón abrir en nueva pestaña como fallback */}
              {documentId && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isOpeningExternal}
                  className="w-full gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
                  onClick={async () => {
                    setIsOpeningExternal(true);
                    try {
                      const res = await documentService.open(documentId);
                      const url = res.status === 200 && res.data ? res.data : documentUrl;
                      if (url) window.open(url, "_blank", "noopener,noreferrer");
                    } catch {
                      if (documentUrl) window.open(documentUrl, "_blank", "noopener,noreferrer");
                    } finally {
                      setIsOpeningExternal(false);
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("documents.detail.openExternal")}
                </Button>
              )}
            </div>

            {/* Panel derecho — previsualización */}
            <div className="flex-1 bg-gray-100 flex flex-col min-h-0">
              {documentUrl ? (
                <iframe
                  src={documentUrl}
                  className="w-full h-full min-h-[500px]"
                  title={document?.documentType?.name ?? t("documents.document")}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  {t("documents.detail.noFile")}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
