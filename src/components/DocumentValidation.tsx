import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { Document, EntityStatus } from "@/types/document";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

interface DocumentValidationProps {
  documentName: string;
  onValidate: (isValid: boolean, comment?: string, expiryDate?: string) => void;
  canValidate: boolean;
  document: Document;
}

export const DocumentValidation = ({
  documentName,
  onValidate,
  canValidate,
  document,
}: DocumentValidationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState<boolean | null>(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [comment, setComment] = useState("");

  if (!canValidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidating === null) return;

    onValidate(isValidating, comment || undefined, expiryDate);

    setIsOpen(false);
    setIsValidating(null);
    setComment("");
  };

  const resetForm = () => {
    setIsValidating(null);
    setComment("");
  };

  const isValidStatusForValidation =
    document.status === EntityStatus.Rejected ||
    document.status === EntityStatus.Expired ||
    document.status === EntityStatus.PendingManualy;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isValidStatusForValidation) return;
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey ${
            isValidStatusForValidation ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isValidStatusForValidation}
        >
          <CheckCircle className="h-4 w-4 text-brand-primary" />
          Validar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-playBlueLight/30">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            Validar {documentName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="expiryDate"
                className="flex items-center gap-2 text-brand-primary"
              >
                <Calendar className="h-4 w-4 text-brand-primary" />
                Fecha de caducidad
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>

            <div className="text-sm font-medium text-brand-primary">
              Resultado de la validación:
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant={isValidating === true ? "default" : "outline"}
                className={`flex-1 gap-2 ${
                  isValidating === true
                    ? "bg-playGreen hover:bg-playGreen/90 text-white"
                    : "border-playBlueLight text-brand-primary hover:bg-playGrey"
                }`}
                onClick={() => setIsValidating(true)}
              >
                <CheckCircle className="h-4 w-4" />
                Validar
              </Button>

              <Button
                type="button"
                variant={isValidating === false ? "destructive" : "outline"}
                className={`flex-1 gap-2 ${
                  isValidating === false
                    ? "bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                    : "border-playBlueLight text-brand-primary hover:bg-playGrey"
                }`}
                onClick={() => setIsValidating(false)}
              >
                <XCircle className="h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>

          {isValidating !== null && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-primary">
                {isValidating ? "Comentario (opcional)" : "Motivo del rechazo"}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isValidating
                    ? "Agregar comentarios sobre la validación..."
                    : "Especificar por qué se rechaza el documento..."
                }
                required={!isValidating}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-playBlueLight text-brand-primary hover:bg-playGrey"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isValidating === null}
              className={`${
                isValidating === false
                  ? "bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                  : "bg-playGreen hover:bg-playGreen/90 text-white"
              }`}
            >
              {isValidating ? "Validar documento" : "Rechazar documento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
