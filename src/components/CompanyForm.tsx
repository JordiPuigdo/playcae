import { useState } from "react";

import { CompanyFormData, Company } from "@/types/company";
import { validateCompanyTaxId } from "@/app/utils/tax-id-validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  company?: Company;
  mode: "create" | "edit";
}

export const CompanyForm = ({
  isOpen,
  onClose,
  onSubmit,
  company,
  mode,
}: CompanyFormProps) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || "",
    taxId: company?.taxId || "",
    contactPerson: company?.contactPerson || "",
    email: company?.email || "",
    phone: company?.phone || "",
  });

  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre de la empresa es obligatorio";
    }

    if (formData.taxId && formData.taxId.trim() && !validateCompanyTaxId(formData.taxId)) {
      newErrors.taxId = "CIF no válido. Formato: Letra + 7 dígitos + control (ej: B12345678)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email debe tener un formato válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        taxId: formData.taxId.toUpperCase(),
      });

      onClose();
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-brand-accent/30 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            {mode === "create" ? "Añadir Nueva Empresa" : "Editar Empresa"}
          </DialogTitle>
          <DialogDescription className="text-brand-accent">
            {mode === "create"
              ? "Completa los datos para registrar una nueva empresa externa."
              : "Modifica los datos de la empresa seleccionada."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-brand-primary">
              Nombre de la empresa *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ej: Constructora ABC S.L."
              className={
                errors.name ? "border-destructive" : "border-brand-accent"
              }
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cif" className="text-brand-primary">
              CIF
            </Label>
            <Input
              id="cif"
              value={formData.taxId}
              onChange={(e) => handleInputChange("taxId", e.target.value)}
              placeholder="A12345678"
              className={
                errors.taxId ? "border-destructive" : "border-brand-accent"
              }
            />
            {errors.taxId && (
              <p className="text-sm text-destructive">{errors.taxId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson" className="text-brand-primary">
              Persona de contacto
            </Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) =>
                handleInputChange("contactPerson", e.target.value)
              }
              placeholder="Nombre y apellidos"
              className={
                errors.contactPerson
                  ? "border-destructive"
                  : "border-brand-accent"
              }
            />
            {errors.contactPerson && (
              <p className="text-sm text-destructive">{errors.contactPerson}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-brand-primary">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="contacto@empresa.com"
              className={
                errors.email ? "border-destructive" : "border-brand-accent"
              }
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-brand-primary">
              Teléfono
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="123 456 789"
              className="border-brand-accent"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-brand-accent text-brand-primary hover:bg-brand-neutral"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-brand-secondary hover:bg-brand-secondary/90 text-white shadow-md"
            >
              {mode === "create" ? "Crear Empresa" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
