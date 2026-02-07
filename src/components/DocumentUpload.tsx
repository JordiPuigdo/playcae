import { useState, useRef } from "react";
import { Upload, Calendar, FileText } from "lucide-react";
import { WorkerDocumentFormData } from "@/types/worker";

import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { InfoTooltip } from "./ui/InfoToolTip";

interface DocumentUploadProps {
  documentName: string;
  documentTypeId: string;
  onUpload: (data: WorkerDocumentFormData) => void;
  hasFile: boolean;
  canUpload: boolean;
}

const MAX_FILE_SIZE_MB = 20;

export const DocumentUpload = ({
  documentName,
  documentTypeId,
  onUpload,
  hasFile,
  canUpload,
}: DocumentUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [forceValidation, setForceValidation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const attemptedDocumentsRef = useRef<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!canUpload) return null;

  const handleFileSelect = (file: File) => {
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB`);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    attemptedDocumentsRef.current.add(documentTypeId);

    onUpload({
      file: selectedFile,
      issueDate: issueDate || undefined,
      expiryDate: expiryDate || undefined,
      forceValidation: forceValidation,
    });

    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setIssueDate("");
    setExpiryDate("");
    setIsDragging(false);
    setError(null);
    setForceValidation(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          if (attemptedDocumentsRef.current.has(documentTypeId)) {
            setForceValidation(true);
          }
        }
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
        >
          <Upload className="h-4 w-4 text-brand-primary" />
          {hasFile ? "Reemplazar" : "Subir"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-playBlueLight/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-primary">
            <FileText className="h-5 w-5 text-brand-primary" />
            {hasFile ? "Reemplazar" : "Subir"} {documentName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-brand-primary bg-brand-primary/5"
                : "border-playBlueLight/40 hover:border-playBlueLight"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-brand-primary">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-playBlueLight">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="border-playBlueLight text-brand-primary hover:bg-playGrey"
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 text-playBlueLight mx-auto" />
                <div className="text-sm font-medium text-brand-primary">
                  Arrastra el archivo aquí o haz clic para seleccionar
                </div>
                <div className="text-xs text-playBlueLight">
                  PDF, JPG, PNG hasta {MAX_FILE_SIZE_MB}MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-playBlueLight text-brand-primary hover:bg-playGrey"
                >
                  Seleccionar archivo
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          {error && <p className="text-sm text-brand-secondary">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="issueDate"
                className="flex items-center gap-2 text-brand-primary"
              >
                <Calendar className="h-4 w-4 text-brand-primary" />
                Fecha de emisión (opcional)
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expiryDate"
                className="flex items-center gap-2 text-brand-primary"
              >
                <Calendar className="h-4 w-4 text-brand-primary" />
                Fecha de caducidad (opcional)
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label
              htmlFor="forceValidation"
              className="flex items-center gap-2 text-brand-primary"
            >
              <Input
                id="forceValidation"
                checked={forceValidation}
                onChange={(e) => setForceValidation(e.target.checked)}
                type="checkbox"
                className="h-4 w-4 border-playBlueLight text-brand-primary"
              />
              Forzar Validación
            </Label>
            <InfoTooltip text="Si la validación automática no funciona, puede forzar la validación del documento." />
          </div>

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
              disabled={!selectedFile || !!error}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
            >
              {hasFile ? "Reemplazar" : "Subir"} documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
