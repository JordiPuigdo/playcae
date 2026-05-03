"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileType, Plus } from "lucide-react";
import Loader from "@/components/Loader";
import { DocumentTypeTable, DocumentTypeTableRef } from "@/components/DocumentTypeTable";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";

export default function DocumentTypesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const tableRef = useRef<DocumentTypeTableRef>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { documentTypes, isLoading, create, update, deactivate } = useDocumentTypes();

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!user) return <Loader text="" />;
  if (user.role !== UserRole.SuperAdmin) return null;

  const handleCreate = async (data: Parameters<typeof create>[0]) => {
    try {
      await create(data);
      toast({ title: t("documentTypes.created") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("documentTypes.createError"),
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, data: Parameters<typeof update>[1]) => {
    try {
      await update(id, data);
      toast({ title: t("documentTypes.updated") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("documentTypes.updateError"),
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivate(id);
      toast({ title: t("documentTypes.deactivated") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("documentTypes.deactivateError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-playBlueLight" />
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
                <FileType className="h-7 w-7 text-brand-primary" />
                {t("documentTypes.title")}
              </h1>
            </div>
            <Button
              onClick={() => tableRef.current?.openCreate()}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
              variant="submit"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("documentTypes.add")}
            </Button>
          </div>
          <p className="text-sm text-brand-accent">{t("documentTypes.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {isLoading ? (
          <Loader text={t("common.loading")} />
        ) : (
          <DocumentTypeTable
            ref={tableRef}
            documentTypes={documentTypes}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDeactivate={handleDeactivate}
          />
        )}
      </div>
    </div>
  );
}
