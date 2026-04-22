"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "./ui/Button";
import Image from "next/image";
import { BlogService } from "@/services/blog.service";
import { HttpClient } from "@/services/http-client";
import {
  formatFileSizeMb,
  MIME_IMAGE_JPEG_PNG_WEBP,
  validateFile,
} from "@/lib/upload-validation";

interface BlogImageUploadProps {
  currentImageUrl?: string;
  altText: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/jpg,image/png,image/webp";
const blogService = new BlogService(new HttpClient());

export function BlogImageUpload({
  currentImageUrl,
  altText,
  onUpload,
  onRemove,
}: BlogImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file, {
      maxSizeMb: MAX_FILE_SIZE_MB,
      allowedMimePattern: MIME_IMAGE_JPEG_PNG_WEBP,
      invalidTypeMessage: "Solo se permiten archivos JPEG, PNG o WebP.",
    });

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const response = await blogService.uploadImage(
        selectedFile,
        altText || selectedFile.name
      );
      onUpload(response.data.url);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch {
      setError("Error al subir la imagen. Intentalo de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const displayedImage = previewUrl ?? currentImageUrl ?? null;

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
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
        {displayedImage ? (
          <div className="relative">
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-50">
              <Image
                src={displayedImage}
                alt={altText || "Imagen de portada"}
                fill
                className="object-cover"
                unoptimized={displayedImage.startsWith("data:")}
              />
            </div>
            {previewUrl ? (
              <button
                type="button"
                onClick={handleRemoveSelection}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                aria-label="Cancelar seleccion"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            ) : onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors"
                aria-label="Eliminar imagen"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
            <ImageIcon className="h-10 w-10 text-playBlueLight" />
            <p className="text-sm font-medium text-brand-primary">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-playBlueLight">
              JPEG, PNG o WebP - max. {MAX_FILE_SIZE_MB} MB - se optimiza a 1280px
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-playBlueLight text-brand-primary hover:bg-playGrey"
            >
              <Upload className="h-4 w-4 mr-1" />
              Seleccionar archivo
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-sm text-brand-secondary">{error}</p>}

      {selectedFile && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-playBlueLight truncate">
            {selectedFile.name} - {formatFileSizeMb(selectedFile.size)}
          </span>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-playBlueLight text-brand-primary hover:bg-playGrey"
            >
              Cambiar
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
            >
              {isUploading ? "Subiendo..." : "Subir imagen"}
            </Button>
          </div>
        </div>
      )}

      {currentImageUrl && !selectedFile && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="border-playBlueLight text-brand-primary hover:bg-playGrey"
        >
          <Upload className="h-4 w-4 mr-1" />
          Cambiar imagen
        </Button>
      )}
    </div>
  );
}
