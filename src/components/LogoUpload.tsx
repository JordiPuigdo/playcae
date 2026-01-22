import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Label } from "./ui/Label";
import { InfoTooltip } from "./ui/InfoToolTip";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  disabled?: boolean;
}

const MAX_FILE_SIZE_MB = 2;
const RECOMMENDED_WIDTH = 400;
const RECOMMENDED_HEIGHT = 150;

export const LogoUpload = ({
  currentLogoUrl,
  onUpload,
  onDelete,
  disabled = false,
}: LogoUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validar tipo de archivo
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setError("Solo se permiten archivos PNG o JPG");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validar tamaño
    if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
      setError(`El archivo supera el límite de ${MAX_FILE_SIZE_MB}MB`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileSelect(files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFile);
      setIsOpen(false);
      resetForm();
    } catch (err) {
      // El error ya se maneja en el hook
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setIsUploading(true);
      await onDelete();
      setIsOpen(false);
    } catch (err) {
      // El error ya se maneja en el hook
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDragging(false);
    setError(null);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isUploading) {
          setIsOpen(open);
          if (!open) resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey"
          disabled={disabled}
        >
          <Upload className="h-4 w-4 text-brand-primary" />
          {currentLogoUrl ? "Cambiar logo" : "Subir logo"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-playBlueLight/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-primary">
            <ImageIcon className="h-5 w-5 text-brand-primary" />
            {currentLogoUrl ? "Cambiar" : "Subir"} logo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preview del logo actual */}
          {currentLogoUrl && !selectedFile && (
            <div className="space-y-2">
              <Label className="text-brand-primary">Logo actual</Label>
              <div className="border border-playBlueLight/30 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                <Image
                  src={currentLogoUrl}
                  alt="Logo actual"
                  width={200}
                  height={75}
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Zona de carga */}
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
            {previewUrl ? (
              <div className="space-y-2">
                <div className="border border-playBlueLight/30 rounded p-2 bg-white">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={75}
                    className="mx-auto object-contain"
                  />
                </div>
                <div className="text-sm font-medium text-brand-primary">
                  {selectedFile?.name}
                </div>
                <div className="text-xs text-playBlueLight">
                  {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="border-playBlueLight text-brand-primary hover:bg-playGrey"
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-10 w-10 text-playBlueLight mx-auto" />
                <div className="text-sm font-medium text-brand-primary">
                  Arrastra el logo aquí o haz clic para seleccionar
                </div>
                <div className="text-xs text-playBlueLight">
                  PNG o JPG hasta {MAX_FILE_SIZE_MB}MB
                </div>
                <div className="text-xs text-muted-foreground">
                  Dimensiones recomendadas: {RECOMMENDED_WIDTH}x
                  {RECOMMENDED_HEIGHT}px
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
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          {error && <p className="text-sm text-brand-secondary">{error}</p>}

          {/* Información adicional */}
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-900 space-y-1">
            <div className="flex items-start gap-2">
              <InfoTooltip text="El logo se mostrará en el header del dashboard y en el control de acceso" />
              <div>
                <p className="font-medium">Recomendaciones:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Formato: PNG (transparente) o JPG</li>
                  <li>
                    Dimensiones: {RECOMMENDED_WIDTH}x{RECOMMENDED_HEIGHT}{" "}
                    píxeles
                  </li>
                  <li>Tamaño máximo: {MAX_FILE_SIZE_MB}MB</li>
                  <li>Fondo transparente recomendado (PNG)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-between space-x-2">
            <div>
              {currentLogoUrl && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isUploading}
                  className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar logo
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
                className="border-playBlueLight text-brand-primary hover:bg-playGrey"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={!selectedFile || !!error || isUploading}
                className="bg-playOrange hover:bg-playOrange/90 text-white"
              >
                {isUploading
                  ? "Subiendo..."
                  : currentLogoUrl
                    ? "Actualizar logo"
                    : "Subir logo"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
