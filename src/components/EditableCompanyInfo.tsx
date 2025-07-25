import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { StatusBadge } from "@/components/StatusBadge";
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
  userRole?: UserRole;
}

// Spanish NIF/CIF validation
const validateSpanishTaxId = (value: string): boolean => {
  // Remove spaces and convert to uppercase
  const cleanValue = value.replace(/\s/g, "").toUpperCase();

  // CIF format: Letter + 8 digits + control character
  const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{8}[0-9A-J]$/;

  // NIF format: 8 digits + control letter
  const nifRegex = /^\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

  if (cifRegex.test(cleanValue)) {
    // Validate CIF control character
    const letter = cleanValue[0];
    const numbers = cleanValue.substring(1, 9);
    const controlChar = cleanValue[9];

    // Calculate control character
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
      let digit = parseInt(numbers[i]);
      if (i % 2 === 1) {
        // odd positions (1, 3, 5, 7)
        digit *= 2;
        if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
      }
      sum += digit;
    }

    const control = (10 - (sum % 10)) % 10;
    const controlLetter = "JABCDEFGHI"[control];

    // Some CIF types use numbers, others letters
    const numericControlTypes = ["A", "B", "E", "H"];
    const expectedControl = numericControlTypes.includes(letter)
      ? control.toString()
      : controlLetter;

    return controlChar === expectedControl;
  } else if (nifRegex.test(cleanValue)) {
    // Validate NIF control letter
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
  userRole = UserRole.Admin,
}: EditableCompanyInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const canEdit = true;

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
    form.reset({
      name: company.name,
      taxId: company.taxId,
      contactPerson: company.contactPerson,
      email: company.email,
      phone: company.phone || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleSave = async (data: CompanyFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(company.id!, data);
      setIsEditing(false);

      toast({
        title: "Empresa actualizada",
        description:
          "La información de la empresa se ha guardado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la información. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Editar Información de la Empresa
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={form.handleSubmit(handleSave)}
                disabled={isLoading}
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Nombre de la Empresa
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre de la empresa" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CIF/NIF
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="B12345678"
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Persona de Contacto
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nombre completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@empresa.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="666 123 456" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Estado
                  </Label>
                  <StatusBadge status={company.status} />
                  <p className="text-xs text-muted-foreground">
                    El estado se actualiza mediante otros procesos
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información de la Empresa
          </div>
          {canEdit && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Nombre
            </div>
            <div className="font-semibold">{company.name}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="h-4 w-4" />
              CIF
            </div>
            <div className="font-mono text-sm">{company.taxId}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Contacto
            </div>
            <div>{company.contactPerson}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <div className="text-sm">{company.email}</div>
          </div>

          {company.phone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="h-4 w-4" />
                Teléfono
              </div>
              <div className="text-sm">{company.phone}</div>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Estado
            </div>
            <StatusBadge status={company.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
