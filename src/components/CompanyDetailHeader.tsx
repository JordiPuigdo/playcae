import { ArrowLeft, Building2, ChevronRight, Network } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/types/user";
import Link from "next/link";

interface CompanyDetailHeaderProps {
  companyName: string;
  isSubcontractor?: boolean;
  parentCompanyId?: string | null;
  parentCompanyName?: string | null;
}

export const CompanyDetailHeader = ({
  companyName,
  isSubcontractor = false,
  parentCompanyId,
  parentCompanyName,
}: CompanyDetailHeaderProps) => {
  const router = useRouter();
  const { role } = usePermissions();
  const isAdmin = role === UserRole.Admin;

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-playBlueLight mb-4">
          <Link
            href="/dashboard/companies"
            className="hover:text-playBlueDark transition-colors"
          >
            Empresas
          </Link>

          {isSubcontractor && parentCompanyId && (
            <>
              <ChevronRight className="h-4 w-4" />
              <Link
                href={`/dashboard/companies/${parentCompanyId}`}
                className="hover:text-playBlueDark transition-colors flex items-center gap-1"
              >
                <Building2 className="h-3 w-3" />
                {parentCompanyName || "Empresa padre"}
              </Link>
            </>
          )}

          <ChevronRight className="h-4 w-4" />
          <span className="text-playBlueDark font-medium flex items-center gap-1">
            {isSubcontractor && <Network className="h-3 w-3 text-playOrange" />}
            {companyName}
          </span>
        </nav>

        {/* Header principal */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
            visible={isAdmin}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            {isSubcontractor ? (
              <Network className="h-7 w-7 text-playOrange" />
            ) : (
              <Building2 className="h-7 w-7 text-playBlueDark" />
            )}
            {companyName}
            {isSubcontractor && (
              <span className="text-sm font-normal px-2 py-1 bg-playOrange/10 text-playOrange rounded-full">
                Subcontrata
              </span>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
};
