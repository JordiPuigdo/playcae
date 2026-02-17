import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { Worker, WorkerFormData } from "@/types/worker";
import { User, IdCard } from "lucide-react";
import { validatePersonId } from "@/app/utils/tax-id-validation";

interface WorkerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkerFormData) => void;
  worker?: Worker;
  mode: "create" | "edit";
  companyId?: string;
}

export const WorkerForm = ({
  isOpen,
  onClose,
  onSubmit,
  worker,
  mode,
  companyId,
}: WorkerFormProps) => {
  const [formData, setFormData] = useState<WorkerFormData>({
    firstName: "",
    lastName: "",
    cardId: "",
    position: "",
    companyId: "",
    ssn: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (worker && mode === "edit") {
      setFormData({
        firstName: worker.firstName,
        lastName: worker.lastName,
        cardId: worker.cardId,
        position: worker.position || "",
        companyId: worker.companyId,
        ssn: worker.ssn || "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        cardId: "",
        position: "",
        companyId: "",
        ssn: "",
      });
    }
    setErrors({});
  }, [worker, mode, isOpen]);

  const validateDNI = (dni: string) => validatePersonId(dni);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Los apellidos son obligatorios";
    }

    if (!formData.cardId.trim()) {
      newErrors.dni = "El DNI/NIE es obligatorio";
    } else if (!validateDNI(formData.cardId)) {
      newErrors.dni = "Formato de DNI/NIE no válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    setFormData({
      firstName: "",
      lastName: "",
      cardId: "",
      position: "",
      companyId: "",
      ssn: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === "create" ? "Nuevo Trabajador" : "Editar Trabajador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder="Juan"
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder="García López"
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni" className="flex items-center gap-2">
              <IdCard className="h-4 w-4" />
              DNI/NIE *
            </Label>
            <Input
              id="dni"
              value={formData.cardId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cardId: e.target.value.toUpperCase(),
                }))
              }
              placeholder="12345678A"
              className={errors.dni ? "border-destructive" : ""}
            />
            {errors.dni && (
              <p className="text-sm text-destructive">{errors.dni}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ssn" className="flex items-center gap-2">
              SSN *
            </Label>
            <Input
              id="ssn"
              value={formData.ssn}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ssn: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Número seguridad social"
              className={errors.ssn ? "border-destructive" : ""}
            />
            {errors.ssn && (
              <p className="text-sm text-destructive">{errors.ssn}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Puesto/Actividad</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="Operario de mantenimiento"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Crear Trabajador" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
