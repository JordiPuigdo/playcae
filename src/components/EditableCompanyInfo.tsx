import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-Dialog";
import {
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Edit,
  Save,
  X,
  Loader2,
  Power,
  PowerOff,
  AlertTriangle,
  CheckCircle,
  Send,
  Building,
  Briefcase,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import { Company, CompanyFormData, CompanyType } from "@/types/company";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { useToast } from "@/hooks/use-Toast";
import { useForm } from "react-hook-form";
import { UserRole } from "@/types/user";
import { useTranslation } from "@/hooks/useTranslation";

interface EditableCompanyInfoProps {
  company: Company;
  onUpdate: (id: string, data: CompanyFormData) => void;
  onToggleActive?: (id: string, activate: boolean) => Promise<void>;
  onResendWelcomeEmail?: (id: string) => Promise<void>;
  onUpdateType?: (id: string, type: CompanyType) => Promise<void>;
  onToggleInternalPrevention?: (id: string, hasInternalPrevention: boolean) => Promise<void>;
  userRole?: UserRole;
}




export const EditableCompanyInfo = ({
  company,
  onUpdate,
  onToggleActive,
  onResendWelcomeEmail,
  onUpdateType,
  onToggleInternalPrevention,
  userRole = UserRole.Admin,
}: EditableCompanyInfoProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [pendingType, setPendingType] = useState<CompanyType | null>(null);
  const [isChangingType, setIsChangingType] = useState(false);
  const [isPreventionModalOpen, setIsPreventionModalOpen] = useState(false);
  const [isChangingPrevention, setIsChangingPrevention] = useState(false);
  const { toast } = useToast();

  const canEdit = true;
  const isAdmin = userRole === UserRole.Admin || userRole === UserRole.SuperAdmin;
  const canEditCompanySettings = isAdmin || userRole === UserRole.Company;
  const isActive = company.active !== false; // Por defecto activo si no está definido

  const companySchema = z.object({
    name: z.string().min(2, t("companies.validation.nameMin")),
    taxId: z.string(),
    contactPerson: z.string(),
    email: z.string().email(t("companies.validation.invalidEmail")),
    phone: z.string().optional(),
    type: z.nativeEnum(CompanyType).optional(),
    hasInternalPreventionService: z.boolean().optional(),
  });

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      taxId: company.taxId,
      contactPerson: company.contactPerson,
      email: company.email,
      phone: company.phone || "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.reset({ ...company });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleToggleActive = async () => {
    if (!onToggleActive) return;

    setIsTogglingActive(true);
    try {
      await onToggleActive(company.id!, !isActive);
      setIsToggleModalOpen(false);
      toast({
        title: isActive ? t("companies.toast.deactivated") : t("companies.toast.activated"),
        description: isActive
          ? t("companies.toast.deactivatedDesc")
          : t("companies.toast.activatedDesc"),
      });
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("companies.toast.toggleError", { action: isActive ? t("companies.actions.deactivate").toLowerCase() : t("companies.actions.activate").toLowerCase() }),
        variant: "destructive",
      });
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleResendWelcomeEmail = async () => {
    if (!onResendWelcomeEmail) return;

    setIsSendingEmail(true);
    try {
      await onResendWelcomeEmail(company.id!);
      toast({
        title: t("companies.toast.emailSent"),
        description: t("companies.toast.emailSentDesc"),
      });
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("companies.toast.emailError"),
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleChangeType = (newType: CompanyType) => {
    if (newType === company.type) return;
    setPendingType(newType);
    setIsTypeModalOpen(true);
  };

  const handleConfirmChangeType = async () => {
    if (!onUpdateType || pendingType === null) return;

    setIsChangingType(true);
    try {
      await onUpdateType(company.id!, pendingType);
      setIsTypeModalOpen(false);
      toast({
        title: t("companies.toast.typeUpdated"),
        description: pendingType === CompanyType.Company
          ? t("companies.toast.typeUpdatedCompany")
          : t("companies.toast.typeUpdatedSelfEmployed"),
      });
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("companies.toast.typeError"),
        variant: "destructive",
      });
    } finally {
      setIsChangingType(false);
      setPendingType(null);
    }
  };

  const handleTogglePrevention = () => {
    setIsPreventionModalOpen(true);
  };

  const handleConfirmTogglePrevention = async () => {
    if (!onToggleInternalPrevention) return;

    const newValue = !company.hasInternalPreventionService;
    setIsChangingPrevention(true);
    try {
      await onToggleInternalPrevention(company.id!, newValue);
      setIsPreventionModalOpen(false);
      toast({
        title: newValue
          ? t("companies.toast.preventionEnabled")
          : t("companies.toast.preventionDisabled"),
        description: newValue
          ? t("companies.toast.preventionEnabledDesc")
          : t("companies.toast.preventionDisabledDesc"),
      });
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("companies.toast.preventionError"),
        variant: "destructive",
      });
    } finally {
      setIsChangingPrevention(false);
    }
  };

  const handleSave = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate(company.id!, data);
      setIsEditing(false);

      toast({
        title: t("companies.toast.updated"),
        description: t("companies.toast.updatedDesc"),
      });
    } catch (error) {
      toast({
        title: t("common.error") || "Error",
        description: t("companies.toast.updateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------
     MODE: EDIT
  -------------------------------------------- */
  if (isEditing) {
    return (
      <>
        <Card className="border border-brand.accent/30 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-brand-primary">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-brand-primary" />
                {t("companies.form.editTitle")}
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsToggleModalOpen(true)}
                    disabled={isLoading}
                    className={
                      isActive
                        ? "border-red-300 text-red-600 hover:bg-red-50"
                        : "border-green-300 text-green-600 hover:bg-green-50"
                    }
                  >
                    {isActive ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-1" />
                        {t("companies.actions.deactivate")}
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-1" />
                        {t("companies.actions.activate")}
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-brand.accent text-brand-primary hover:bg-brand.neutral"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t("common.cancel")}
                </Button>

                <Button
                  size="sm"
                  onClick={form.handleSubmit(handleSave)}
                  disabled={isLoading}
                  className="bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  {t("companies.actions.save")}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NOMBRE */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-brand-primary">
                          <Building2 className="h-4 w-4 text-brand-primary" />
                          {t("companies.form.companyName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("companies.form.companyNamePlaceholder")}
                            className="border-brand.accent focus-visible:ring-brand-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CIF */}
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-brand-primary">
                          <FileText className="h-4 w-4 text-brand-primary" />
                          {t("companies.form.cifNif")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("companies.form.cifPlaceholder")}
                            className="font-mono border-brand.accent focus-visible:ring-brand-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CONTACT PERSON */}
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-brand-primary">
                          <User className="h-4 w-4 text-brand-primary" />
                          {t("companies.form.contactPerson")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("companies.form.contactPlaceholder")}
                            className="border-brand.accent focus-visible:ring-brand-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-brand-primary">
                          <Mail className="h-4 w-4 text-brand-primary" />
                          {t("companies.form.email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("companies.form.emailPlaceholder")}
                            className="border-brand.accent focus-visible:ring-brand-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PHONE */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-brand-primary">
                          <Phone className="h-4 w-4 text-brand-primary" />
                          {t("companies.form.phoneOptional")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("companies.form.phonePlaceholder")}
                            className="border-brand.accent focus-visible:ring-brand-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* STATUS */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-brand.accent">
                      {t("companies.form.status")}
                    </Label>
                    <StatusBadge status={company.status} />
                    <p className="text-xs text-brand.accent">
                      {t("companies.form.statusAutoUpdate")}
                    </p>
                  </div>

                  {/* TIPO DE EMPRESA */}
                  {canEditCompanySettings && onUpdateType && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium text-brand.accent">
                        <Briefcase className="h-4 w-4" />
                        {t("companies.form.companyType")}
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={company.type === CompanyType.Company ? "default" : "outline"}
                          onClick={() => handleChangeType(CompanyType.Company)}
                          className={company.type === CompanyType.Company
                            ? "bg-brand-secondary text-white"
                            : "border-brand.accent text-brand-primary"}
                        >
                          <Building className="h-4 w-4 mr-1" />
                          {t("companies.form.company")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={company.type === CompanyType.SelfEmployed ? "default" : "outline"}
                          onClick={() => handleChangeType(CompanyType.SelfEmployed)}
                          className={company.type === CompanyType.SelfEmployed
                            ? "bg-brand-secondary text-white"
                            : "border-brand.accent text-brand-primary"}
                        >
                          <Briefcase className="h-4 w-4 mr-1" />
                          {t("companies.form.selfEmployed")}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PREVENCIÓN INTERNA */}
                  {canEditCompanySettings && onToggleInternalPrevention && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium text-brand.accent">
                        <ShieldCheck className="h-4 w-4" />
                        {t("companies.form.internalPrevention")}
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleTogglePrevention}
                        className={company.hasInternalPreventionService
                          ? "border-green-300 text-green-600 hover:bg-green-50"
                          : "border-red-300 text-red-600 hover:bg-red-50"}
                      >
                        {company.hasInternalPreventionService ? (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            {t("companies.form.yes")}
                          </>
                        ) : (
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" />
                            {t("companies.form.no")}
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-brand.accent">
                        {t("companies.form.internalPreventionDesc")}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Modal de confirmación para activar/desactivar */}
        <AlertDialog
          open={isToggleModalOpen}
          onOpenChange={setIsToggleModalOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {isActive ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {isActive ? t("companies.toggle.deactivateTitle") : t("companies.toggle.activateTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                {isActive
                  ? t("companies.toggle.deactivateConfirm", { name: company.name })
                  : t("companies.toggle.activateConfirm", { name: company.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isTogglingActive}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleActive}
                disabled={isTogglingActive}
                className={
                  isActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
              >
                {isTogglingActive ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : isActive ? (
                  <PowerOff className="h-4 w-4 mr-1" />
                ) : (
                  <Power className="h-4 w-4 mr-1" />
                )}
                {isTogglingActive
                  ? isActive
                    ? t("companies.actions.deactivating")
                    : t("companies.actions.activating")
                  : isActive
                  ? t("companies.actions.deactivate")
                  : t("companies.actions.activate")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de confirmación para cambiar tipo de empresa */}
        <AlertDialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {t("companies.toggle.changeTypeTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                {pendingType === CompanyType.SelfEmployed
                  ? t("companies.toggle.changeTypeToSelfEmployed", { name: company.name })
                  : t("companies.toggle.changeTypeToCompany", { name: company.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isChangingType}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmChangeType}
                disabled={isChangingType}
                className="bg-brand-secondary text-white hover:bg-brand-secondary/90"
              >
                {isChangingType ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                {isChangingType ? t("common.loading") || "..." : t("common.confirm") || "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de confirmación para prevención interna */}
        <AlertDialog open={isPreventionModalOpen} onOpenChange={setIsPreventionModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {company.hasInternalPreventionService
                  ? t("companies.toggle.disablePreventionTitle")
                  : t("companies.toggle.enablePreventionTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                {company.hasInternalPreventionService
                  ? t("companies.toggle.disablePreventionConfirm", { name: company.name })
                  : t("companies.toggle.enablePreventionConfirm", { name: company.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isChangingPrevention}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmTogglePrevention}
                disabled={isChangingPrevention}
                className={company.hasInternalPreventionService
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"}
              >
                {isChangingPrevention ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : company.hasInternalPreventionService ? (
                  <ShieldOff className="h-4 w-4 mr-1" />
                ) : (
                  <ShieldCheck className="h-4 w-4 mr-1" />
                )}
                {isChangingPrevention
                  ? t("common.loading") || "..."
                  : t("common.confirm") || "Confirmar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  /* -------------------------------------------
     MODE: VIEW
  -------------------------------------------- */
  return (
    <Card className="border border-brand.accent/30 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-brand-primary">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-primary" />
            {t("companies.form.viewTitle")}
          </div>

          {canEdit && (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsToggleModalOpen(true)}
                  className={
                    isActive
                      ? "border-red-300 text-red-600 hover:bg-red-50"
                      : "border-green-300 text-green-600 hover:bg-green-50"
                  }
                >
                  {isActive ? (
                    <>
                      <PowerOff className="h-4 w-4 mr-1" />
                      {t("companies.actions.deactivate")}
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-1" />
                      {t("companies.actions.activate")}
                    </>
                  )}
                </Button>
              )}
              {isAdmin && onResendWelcomeEmail && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResendWelcomeEmail}
                  disabled={isSendingEmail}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {isSendingEmail ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-1" />
                  )}
                  {isSendingEmail ? t("companies.actions.sending") : t("companies.actions.resendEmail")}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="border-brand.accent text-brand-primary hover:bg-brand.neutral"
              >
                <Edit className="h-4 w-4 mr-1" />
                {t("companies.actions.edit")}
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <Building2 className="h-4 w-4" />
              {t("companies.form.name")}
            </div>
            <div className="font-semibold text-brand-primary">
              {company.name}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <FileText className="h-4 w-4" />
              {t("companies.form.cif")}
            </div>
            <div className="font-mono text-sm text-brand-primary">
              {company.taxId}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <User className="h-4 w-4" />
              {t("companies.form.contact")}
            </div>
            <div className="text-brand-primary">{company.contactPerson}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <Mail className="h-4 w-4" />
              {t("companies.form.email")}
            </div>
            <div className="text-sm text-brand-primary">{company.email}</div>
          </div>

          {company.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
                <Phone className="h-4 w-4" />
                {t("companies.form.phone")}
              </div>
              <div className="text-sm text-brand-primary">{company.phone}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-brand.accent">{t("companies.form.status")}</div>
            <StatusBadge status={company.status} />
          </div>

          {/* Indicador de Activo/Inactivo */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-brand.accent">{t("companies.form.active")}</div>
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  {t("companies.form.yes")}
                </>
              ) : (
                <>
                  <PowerOff className="h-4 w-4" />
                  {t("companies.form.no")}
                </>
              )}
            </div>
          </div>

          {/* Tipo de empresa */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <Briefcase className="h-4 w-4" />
              {t("companies.form.companyType")}
            </div>
            {canEditCompanySettings && onUpdateType ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={company.type === CompanyType.Company ? "default" : "outline"}
                  onClick={() => handleChangeType(CompanyType.Company)}
                  className={company.type === CompanyType.Company
                    ? "bg-brand-secondary text-white"
                    : "border-brand.accent text-brand-primary"}
                >
                  <Building className="h-4 w-4 mr-1" />
                  {t("companies.form.company")}
                </Button>
                <Button
                  size="sm"
                  variant={company.type === CompanyType.SelfEmployed ? "default" : "outline"}
                  onClick={() => handleChangeType(CompanyType.SelfEmployed)}
                  className={company.type === CompanyType.SelfEmployed
                    ? "bg-brand-secondary text-white"
                    : "border-brand.accent text-brand-primary"}
                >
                  <Briefcase className="h-4 w-4 mr-1" />
                  {t("companies.form.selfEmployed")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-medium text-brand-primary">
                {company.type === CompanyType.SelfEmployed ? (
                  <>
                    <Briefcase className="h-4 w-4" />
                    {t("companies.form.selfEmployed")}
                  </>
                ) : (
                  <>
                    <Building className="h-4 w-4" />
                    {t("companies.form.company")}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Prevención interna */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <ShieldCheck className="h-4 w-4" />
              {t("companies.form.internalPrevention")}
            </div>
            {canEditCompanySettings && onToggleInternalPrevention ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleTogglePrevention}
                className={company.hasInternalPreventionService
                  ? "border-green-300 text-green-600 hover:bg-green-50"
                  : "border-red-300 text-red-600 hover:bg-red-50"}
              >
                {company.hasInternalPreventionService ? (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    {t("companies.form.yes")}
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-4 w-4 mr-1" />
                    {t("companies.form.no")}
                  </>
                )}
              </Button>
            ) : (
              <div className={`flex items-center gap-2 text-sm font-medium ${
                company.hasInternalPreventionService ? "text-green-600" : "text-red-600"
              }`}>
                {company.hasInternalPreventionService ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    {t("companies.form.yes")}
                  </>
                ) : (
                  <>
                    <ShieldOff className="h-4 w-4" />
                    {t("companies.form.no")}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Modal de confirmación para activar/desactivar */}
      <AlertDialog open={isToggleModalOpen} onOpenChange={setIsToggleModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {isActive ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isActive ? t("companies.toggle.deactivateTitle") : t("companies.toggle.activateTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {isActive
                ? t("companies.toggle.deactivateConfirm", { name: company.name })
                : t("companies.toggle.activateConfirm", { name: company.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingActive}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleActive}
              disabled={isTogglingActive}
              className={
                isActive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {isTogglingActive ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : isActive ? (
                <PowerOff className="h-4 w-4 mr-1" />
              ) : (
                <Power className="h-4 w-4 mr-1" />
              )}
              {isTogglingActive
                ? isActive
                  ? t("companies.actions.deactivating")
                  : t("companies.actions.activating")
                : isActive
                ? t("companies.actions.deactivate")
                : t("companies.actions.activate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación para cambiar tipo de empresa */}
      <AlertDialog open={isTypeModalOpen} onOpenChange={setIsTypeModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t("companies.toggle.changeTypeTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {pendingType === CompanyType.SelfEmployed
                ? t("companies.toggle.changeTypeToSelfEmployed", { name: company.name })
                : t("companies.toggle.changeTypeToCompany", { name: company.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChangingType}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmChangeType}
              disabled={isChangingType}
              className="bg-brand-secondary text-white hover:bg-brand-secondary/90"
            >
              {isChangingType ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-1" />
              )}
              {isChangingType ? t("common.loading") || "..." : t("common.confirm") || "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación para prevención interna */}
      <AlertDialog open={isPreventionModalOpen} onOpenChange={setIsPreventionModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {company.hasInternalPreventionService
                ? t("companies.toggle.disablePreventionTitle")
                : t("companies.toggle.enablePreventionTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {company.hasInternalPreventionService
                ? t("companies.toggle.disablePreventionConfirm", { name: company.name })
                : t("companies.toggle.enablePreventionConfirm", { name: company.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChangingPrevention}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmTogglePrevention}
              disabled={isChangingPrevention}
              className={company.hasInternalPreventionService
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"}
            >
              {isChangingPrevention ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : company.hasInternalPreventionService ? (
                <ShieldOff className="h-4 w-4 mr-1" />
              ) : (
                <ShieldCheck className="h-4 w-4 mr-1" />
              )}
              {isChangingPrevention
                ? t("common.loading") || "..."
                : t("common.confirm") || "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
