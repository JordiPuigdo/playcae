export interface FileValidationConfig {
  maxSizeMb: number;
  allowedMimePattern?: RegExp;
  invalidTypeMessage?: string;
}

export function validateFile(
  file: File,
  config: FileValidationConfig
): string | null {
  if (config.allowedMimePattern && !config.allowedMimePattern.test(file.type)) {
    return config.invalidTypeMessage ?? "Tipo de archivo no permitido.";
  }

  const maxSizeBytes = config.maxSizeMb * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `El archivo supera el limite de ${config.maxSizeMb} MB.`;
  }

  return null;
}

export function formatFileSizeMb(sizeInBytes: number): string {
  return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;
}

export const MIME_IMAGE_JPEG_PNG_WEBP = /^image\/(jpeg|jpg|png|webp)$/;
export const MIME_IMAGE_PNG_JPEG = /^image\/(png|jpeg|jpg)$/;
