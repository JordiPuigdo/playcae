"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users2 } from "lucide-react";
import Loader from "@/components/Loader";
import { ProfileTable, ProfileTableRef } from "@/components/ProfileTable";
import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import { useProfiles } from "@/hooks/useProfiles";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";

export default function ProfilesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const tableRef = useRef<ProfileTableRef>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { profiles, isLoading, create, update, remove, addDocumentType, removeDocumentType, batchUpdateDocTypes } =
    useProfiles();
  const { documentTypes } = useDocumentTypes();

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
      toast({ title: t("profiles.created") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.createError"),
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, data: Parameters<typeof update>[1]) => {
    try {
      await update(id, data);
      toast({ title: t("profiles.updated") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.updateError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast({ title: t("profiles.deleted") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.deleteError"),
        variant: "destructive",
      });
    }
  };

  const handleAddDocType = async (profileId: string, documentTypeId: string) => {
    try {
      await addDocumentType(profileId, documentTypeId);
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.docTypes.addError"),
        variant: "destructive",
      });
    }
  };

  const handleRemoveDocType = async (profileId: string, documentTypeId: string) => {
    try {
      await removeDocumentType(profileId, documentTypeId);
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.docTypes.removeError"),
        variant: "destructive",
      });
    }
  };

  const handleBatchDocTypes = async (profileId: string, toAdd: string[], toRemove: string[]) => {
    try {
      await batchUpdateDocTypes(profileId, toAdd, toRemove);
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("profiles.updateError"),
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
                <Users2 className="h-7 w-7 text-brand-primary" />
                {t("profiles.title")}
              </h1>
            </div>
            <Button
              onClick={() => tableRef.current?.openCreate()}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
              variant="submit"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("profiles.add")}
            </Button>
          </div>
          <p className="text-sm text-brand-accent">{t("profiles.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {isLoading ? (
          <Loader text={t("common.loading")} />
        ) : (
          <ProfileTable
            ref={tableRef}
            profiles={profiles}
            documentTypes={documentTypes}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddDocumentType={handleAddDocType}
            onRemoveDocumentType={handleRemoveDocType}
            onBatchDocumentTypes={handleBatchDocTypes}
          />
        )}
      </div>
    </div>
  );
}
