"use client";

import { useCompanies } from "@/hooks/useCompanies";
import { useAuthStore } from "@/hooks/useAuthStore";
import { UserRole } from "@/types/user";
import { CompanySimple } from "@/types/company";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import Loader from "@/components/Loader";
import { StatusBadge } from "@/components/StatusBadge";
import { WorkerStatusBadge } from "@/components/WorkerStatusBadge";
import { Network, Search, Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";

type SubcontractorWithParent = CompanySimple & {
  parentCompanyName?: string;
  parentCompanyId?: string;
};

export default function SubcontractorsPage() {
  const router = useRouter();
  const {
    companies,
    loading: companiesLoading,
    getSubcontractors,
    getCompanyById,
  } = useCompanies();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.Admin;

  const [allSubcontractors, setAllSubcontractors] = useState<
    SubcontractorWithParent[]
  >([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<
    SubcontractorWithParent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const hasLoadedRef = useRef(false);

  // Ref para el contenedor de scroll (virtualización)
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizador para renderizar solo items visibles
  const virtualizer = useVirtualizer({
    count: filteredSubcontractors.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  // Cargar subcontratas según el rol
  useEffect(() => {
    const loadSubcontractors = async () => {
      if (hasLoadedRef.current) return;
      if (!user) return;

      if (isAdmin && (companiesLoading || !companies?.length)) return;
      if (!isAdmin && !user.companyId) return;

      hasLoadedRef.current = true;
      setIsLoading(true);

      const allSubs: SubcontractorWithParent[] = [];

      if (isAdmin) {
        const mainCompanies = companies.filter((c) => !c.isSubcontractor);

        for (const company of mainCompanies) {
          if (!company.id) continue;
          try {
            const subs = await getSubcontractors(company.id);
            subs.forEach((sub) => {
              allSubs.push({
                ...sub,
                parentCompanyName: company.name,
                parentCompanyId: company.id,
              });
            });
          } catch (error) {
            console.error(
              `Error loading subcontractors for company ${company.id}:`,
              error
            );
          }
        }
      } else {
        try {
          const parentCompany = await getCompanyById(user.companyId);
          const subs = await getSubcontractors(user.companyId);
          subs.forEach((sub) => {
            allSubs.push({
              ...sub,
              parentCompanyName: parentCompany?.name || "Mi empresa",
              parentCompanyId: user.companyId,
            });
          });
        } catch (error) {
          console.error("Error loading subcontractors:", error);
        }
      }

      setAllSubcontractors(allSubs);
      setFilteredSubcontractors(allSubs);
      setIsLoading(false);
    };

    loadSubcontractors();
  }, [companies, companiesLoading, user, isAdmin]);

  // Filtrar por búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSubcontractors(allSubcontractors);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = allSubcontractors.filter(
      (sub) =>
        sub.name.toLowerCase().includes(term) ||
        sub.taxId?.toLowerCase().includes(term) ||
        sub.parentCompanyName?.toLowerCase().includes(term)
    );
    setFilteredSubcontractors(filtered);
  }, [searchTerm, allSubcontractors]);

  // Navegar al detalle
  const handleRowClick = (id: string) => {
    router.push(`/dashboard/companies/${id}`);
  };

  if (companiesLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader text="Cargando subcontratas..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header fijo */}
      <div className="bg-white border-b px-4 py-4 flex-shrink-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-playOrange/10 rounded-xl flex items-center justify-center">
                <Network className="h-5 w-5 text-playOrange" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-playBlueDark">
                  Subcontratas
                </h1>
                <p className="text-sm text-playBlueLight">
                  {filteredSubcontractors.length} de {allSubcontractors.length}
                </p>
              </div>
            </div>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-playBlueLight" />
            <Input
              placeholder="Buscar por nombre, CIF o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-playGrey/50 border-playBlueLight/30"
            />
          </div>
        </div>
      </div>

      {/* Lista virtualizada */}
      {filteredSubcontractors.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Network className="h-16 w-16 mx-auto text-playBlueLight/50 mb-4" />
            <h3 className="text-lg font-semibold text-playBlueDark mb-1">
              {searchTerm ? "Sin resultados" : "Sin subcontratas"}
            </h3>
            <p className="text-sm text-playBlueLight">
              {searchTerm
                ? "Prueba con otros términos"
                : "Añade subcontratas desde el detalle de una empresa"}
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={parentRef}
          className="flex-1 overflow-auto bg-white"
          style={{ contain: "strict" }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const sub = filteredSubcontractors[virtualRow.index];
              return (
                <div
                  key={sub.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div
                    onClick={() => handleRowClick(sub.id!)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-playGrey/50 hover:bg-playOrange/5 cursor-pointer transition-colors active:bg-playOrange/10 ${
                      !sub.active ? "opacity-50" : ""
                    }`}
                  >
                    {/* Avatar/Icono */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        sub.active ? "bg-playOrange/10" : "bg-gray-200"
                      }`}
                    >
                      <Network
                        className={`h-5 w-5 ${
                          sub.active ? "text-playOrange" : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold truncate ${
                            sub.active ? "text-playBlueDark" : "text-gray-500"
                          }`}
                        >
                          {sub.name}
                        </h3>
                        {!sub.active && (
                          <Badge
                            variant="secondary"
                            className="text-xs flex-shrink-0"
                          >
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-playBlueLight truncate">
                        <span className="font-mono">{sub.taxId}</span>
                        <span className="text-playBlueLight/50">•</span>
                        <div className="flex items-center gap-1 truncate">
                          <Building2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {sub.parentCompanyName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Estados */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={sub.status} />
                      <WorkerStatusBadge status={sub.workerStatus} />
                      <ChevronRight className="h-4 w-4 text-playBlueLight" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
