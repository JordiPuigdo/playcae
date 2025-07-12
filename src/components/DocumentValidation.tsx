import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/TextArea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { CheckCircle, XCircle } from 'lucide-react';

interface DocumentValidationProps {
  documentName: string;
  onValidate: (isValid: boolean, comment?: string) => void;
  canValidate: boolean;
}

export const DocumentValidation = ({
  documentName,
  onValidate,
  canValidate,
}: DocumentValidationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  if (!canValidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidating === null) return;

    onValidate(isValidating, comment || undefined);

    setIsOpen(false);
    setIsValidating(null);
    setComment('');
  };

  const resetForm = () => {
    setIsValidating(null);
    setComment('');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CheckCircle className="h-4 w-4" />
          Validar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Validar {documentName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">Resultado de la validación:</div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant={isValidating === true ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setIsValidating(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Validar
              </Button>
              <Button
                type="button"
                variant={isValidating === false ? 'destructive' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setIsValidating(false)}
              >
                <XCircle className="h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>

          {isValidating !== null && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isValidating ? 'Comentario (opcional)' : 'Motivo del rechazo'}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isValidating
                    ? 'Agregar comentarios sobre la validación...'
                    : 'Especificar por qué se rechaza el documento...'
                }
                required={!isValidating}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isValidating === null}
              variant={isValidating === false ? 'destructive' : 'default'}
            >
              {isValidating ? 'Validar documento' : 'Rechazar documento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
