import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Upload, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { DocumentFormData } from "@/types/document";
import { DatePicker } from "./ui/DatePicker";

interface DocumentUploadProps {
  documentName: string;
  onUpload: (data: DocumentFormData) => void;
  hasFile: boolean;
}

export const DocumentUpload = ({
  documentName,
  onUpload,
  hasFile,
}: DocumentUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    onUpload({
      file: selectedFile,
      expiryDate: expiryDate ? expiryDate.toISOString() : undefined,
    });

    setIsOpen(false);
    setSelectedFile(null);
    setExpiryDate(undefined);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setExpiryDate(undefined);
    setIsDragging(false);
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
          <Upload className="h-4 w-4" />
          {hasFile ? "Reemplazar" : "Subir"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {hasFile ? "Reemplazar" : "Subir"} {documentName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                <div className="text-sm font-medium">
                  Arrastra el archivo aquí o haz clic para seleccionar
                </div>
                <div className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX hasta 10MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar archivo
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de caducidad (opcional)
            </Label>
            <DatePicker
              id="expiryDate"
              value={expiryDate}
              onChange={(date) => setExpiryDate(date || undefined)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedFile}>
              {hasFile ? "Reemplazar" : "Subir"} documento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
