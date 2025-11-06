import { FileText } from "lucide-react";
import type { Document } from "@/types/document";

type Props = {
  document: Document;
  onOpen: (documentId: string) => void;
};

export function FileCell({ document, onOpen }: Props) {
  const hasFile = Boolean(document?.storagePath);
  const id = document?.id;

  if (!hasFile || !id) {
    return <span className="text-sm text-muted-foreground">Sin archivo</span>;
  }

  const handleOpen = () => onOpen(id);

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label={`Abrir ${document.documentType?.name ?? "documento"}`}
      title="Abrir documento"
      className="flex items-center gap-2 text-left hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md px-1"
    >
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">
        {document.documentType?.name ?? "Documento"}
      </span>
    </button>
  );
}
