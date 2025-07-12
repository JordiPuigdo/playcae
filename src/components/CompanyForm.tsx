import { useState } from 'react';

import { CompanyFormData, Company } from '@/types/company';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/Dialog';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { useToast } from '@/hooks/use-Toast';

interface CompanyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  company?: Company;
  mode: 'create' | 'edit';
}

export const CompanyForm = ({ isOpen, onClose, onSubmit, company, mode }: CompanyFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CompanyFormData>({
    name: company?.name || '',
    cif: company?.cif || '',
    contactPerson: company?.contactPerson || '',
    email: company?.email || '',
    phone: company?.phone || '',
  });

  const [errors, setErrors] = useState<Partial<CompanyFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CompanyFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la empresa es obligatorio';
    }

    if (!formData.cif.trim()) {
      newErrors.cif = 'El CIF es obligatorio';
    } else if (!/^[A-Z]\d{8}$/.test(formData.cif.toUpperCase())) {
      newErrors.cif = 'El CIF debe tener el formato correcto (ej: A12345678)';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'La persona de contacto es obligatoria';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email debe tener un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        cif: formData.cif.toUpperCase(),
      });

      toast({
        title: mode === 'create' ? 'Empresa creada' : 'Empresa actualizada',
        description: `La empresa ${formData.name} ha sido ${mode === 'create' ? 'creada' : 'actualizada'} correctamente.`,
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
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Añadir Nueva Empresa' : 'Editar Empresa'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para registrar una nueva empresa externa.'
              : 'Modifica los datos de la empresa seleccionada.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Constructora ABC S.L."
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cif">CIF *</Label>
            <Input
              id="cif"
              value={formData.cif}
              onChange={(e) => handleInputChange('cif', e.target.value)}
              placeholder="A12345678"
              className={errors.cif ? 'border-destructive' : ''}
            />
            {errors.cif && <p className="text-sm text-destructive">{errors.cif}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Persona de contacto *</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              placeholder="Nombre y apellidos"
              className={errors.contactPerson ? 'border-destructive' : ''}
            />
            {errors.contactPerson && (
              <p className="text-sm text-destructive">{errors.contactPerson}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contacto@empresa.com"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="123 456 789"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant={'submit'} type="submit">
              {mode === 'create' ? 'Crear Empresa' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
