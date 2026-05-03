"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/Button";
import { QuoteModuleTable } from "@/components/QuoteModuleTable";
import { toast } from "@/hooks/use-Toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useQuoteModules } from "@/hooks/useQuoteModules";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";

export default function QuoteModulesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { modules, isLoading, create, update, remove } = useQuoteModules();

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
      toast({ title: t("quoteModules.created") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quoteModules.createError"),
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, data: Parameters<typeof update>[1]) => {
    try {
      await update(id, data);
      toast({ title: t("quoteModules.updated") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quoteModules.updateError"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast({ title: t("quoteModules.deleted") });
    } catch {
      toast({
        title: t("errors.generic"),
        description: t("quoteModules.deleteError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="border-b bg-playGrey">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/configuration")}
              className="border-playBlueLight"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("common.back")}
            </Button>
            <div className="h-6 w-px bg-playBlueLight" />
            <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-3">
              <Package className="h-7 w-7 text-brand-primary" />
              {t("quoteModules.title")}
            </h1>
          </div>
          <p className="text-sm text-brand-accent">{t("quoteModules.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {isLoading ? (
          <Loader text={t("common.loading")} />
        ) : (
          <QuoteModuleTable
            modules={modules}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
