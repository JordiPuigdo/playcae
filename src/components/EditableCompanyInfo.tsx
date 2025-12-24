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
} from "lucide-react";
import { Company, CompanyFormData } from "@/types/company";
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

interface EditableCompanyInfoProps {
  company: Company;
  onUpdate: (id: string, data: CompanyFormData) => void;
  onToggleActive?: (id: string, activate: boolean) => Promise<void>;
  userRole?: UserRole;
}

// Spanish NIF/CIF validation
const validateSpanishTaxId = (value: string): boolean => {
  const cleanValue = value.replace(/\s/g, "").toUpperCase();
  const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{8}[0-9A-J]$/;
  const nifRegex = /^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

  if (cifRegex.test(cleanValue)) {
    const letter = cleanValue[0];
    const numbers = cleanValue.substring(1, 9);
    const controlChar = cleanValue[9];

    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      let digit = parseInt(numbers[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
      }
      sum += digit;
    }

    const control = (10 - (sum % 10)) % 10;
    const controlLetter = "JABCDEFGHI"[control];
    const numericControlTypes = ["A", "B", "E", "H"];

    const expectedControl = numericControlTypes.includes(letter)
      ? control.toString()
      : controlLetter;

    return controlChar === expectedControl;
  } else if (nifRegex.test(cleanValue)) {
    const numbers = cleanValue.substring(0, 8);
    const controlLetter = cleanValue[8];
    const letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const expectedLetter = letters[parseInt(numbers) % 23];
    return controlLetter === expectedLetter;
  }

  return false;
};

const companySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  taxId: z.string().refine(validateSpanishTaxId, {
    message: "Formato de CIF/NIF inválido",
  }),
  contactPerson: z
    .string()
    .min(2, "El nombre de contacto debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});

export const EditableCompanyInfo = ({
  company,
  onUpdate,
  onToggleActive,
  userRole = UserRole.Admin,
}: EditableCompanyInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const { toast } = useToast();

  const canEdit = true;
  const isActive = company.active !== false; // Por defecto activo si no está definido

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
        title: isActive ? "Empresa desactivada" : "Empresa activada",
        description: isActive
          ? "La empresa ha sido desactivada correctamente."
          : "La empresa ha sido activada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo ${
          isActive ? "desactivar" : "activar"
        } la empresa.`,
        variant: "destructive",
      });
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleSave = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpdate(company.id!, data);
      setIsEditing(false);

      toast({
        title: "Empresa actualizada",
        description: "La información se ha guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la información.",
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
                Editar Información de la Empresa
              </div>

              <div className="flex items-center gap-2">
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
                      Desactivar
                    </>
                  ) : (
                    <>
                      <Power className="h-4 w-4 mr-1" />
                      Activar
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="border-brand.accent text-brand-primary hover:bg-brand.neutral"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
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
                  Guardar
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
                          Nombre de la Empresa
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nombre de la empresa"
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
                          CIF/NIF
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="B12345678"
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
                          Persona de Contacto
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nombre completo"
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
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="email@empresa.com"
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
                          Teléfono (Opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="666 123 456"
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
                      Estado
                    </Label>
                    <StatusBadge status={company.status} />
                    <p className="text-xs text-brand.accent">
                      El estado se actualiza automáticamente
                    </p>
                  </div>
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
                {isActive ? "Desactivar Empresa" : "Activar Empresa"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                {isActive
                  ? `¿Estás seguro de que deseas desactivar la empresa "${company.name}"? La empresa y sus trabajadores no podrán acceder al sistema.`
                  : `¿Deseas activar la empresa "${company.name}"? La empresa podrá volver a acceder al sistema.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isTogglingActive}>
                Cancelar
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
                    ? "Desactivando..."
                    : "Activando..."
                  : isActive
                  ? "Desactivar"
                  : "Activar"}
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
            Información de la Empresa
          </div>

          {canEdit && (
            <div className="flex items-center gap-2">
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
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-1" />
                    Activar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="border-brand.accent text-brand-primary hover:bg-brand.neutral"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
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
              Nombre
            </div>
            <div className="font-semibold text-brand-primary">
              {company.name}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <FileText className="h-4 w-4" />
              CIF
            </div>
            <div className="font-mono text-sm text-brand-primary">
              {company.taxId}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <User className="h-4 w-4" />
              Contacto
            </div>
            <div className="text-brand-primary">{company.contactPerson}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div className="text-sm text-brand-primary">{company.email}</div>
          </div>

          {company.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-brand.accent">
                <Phone className="h-4 w-4" />
                Teléfono
              </div>
              <div className="text-sm text-brand-primary">{company.phone}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-brand.accent">Estado</div>
            <StatusBadge status={company.status} />
          </div>

          {/* Indicador de Activo/Inactivo */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-brand.accent">Activo</div>
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Sí
                </>
              ) : (
                <>
                  <PowerOff className="h-4 w-4" />
                  No
                </>
              )}
            </div>
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
              {isActive ? "Desactivar Empresa" : "Activar Empresa"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {isActive
                ? `¿Estás seguro de que deseas desactivar la empresa "${company.name}"? La empresa y sus trabajadores no podrán acceder al sistema.`
                : `¿Deseas activar la empresa "${company.name}"? La empresa podrá volver a acceder al sistema.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingActive}>
              Cancelar
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
                  ? "Desactivando..."
                  : "Activando..."
                : isActive
                ? "Desactivar"
                : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
