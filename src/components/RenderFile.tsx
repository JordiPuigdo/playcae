import Link from "next/link";
import { FileText } from "lucide-react";
import { Document } from "@/types/document";

export const renderFile = (document: Document) => {
  if (document.storagePath) {
    return (
      <Link href={document.storagePath} target="_blank">
        <div className="flex items-center gap-2 hover:text-blue-500">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{document.documentType.name}</span>
        </div>
      </Link>
    );
  }

  return <span className="text-sm text-muted-foreground">Sin archivo</span>;
};
