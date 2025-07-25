import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/types/user";

interface CompanyDetailHeaderProps {
  companyName: string;
}

export const CompanyDetailHeader = ({
  companyName,
}: CompanyDetailHeaderProps) => {
  const router = useRouter();
  const { role } = usePermissions();
  const isAdmin = role === UserRole.Admin;
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              router.back();
            }}
            className="gap-2"
            visible={isAdmin}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            {companyName}
          </h1>
        </div>
      </div>
    </div>
  );
};
