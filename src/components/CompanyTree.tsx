"use client";

import { useState } from "react";
import { Company, CompanyFormData, CompanySimple } from "@/types/company";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  FileText,
  MoreHorizontal,
  Network,
} from "lucide-react";
import { Button } from "./ui/Button";
import { StatusBadge } from "./StatusBadge";
import { WorkerStatusBadge } from "./WorkerStatusBadge";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/Badge";

interface CompanyNodeProps {
  company: Company | CompanySimple;
  level: number;
  onEdit: (company: Company | CompanySimple) => void;
  onDelete: (company: Company | CompanySimple) => void;
  onAddSubcontractor: (parentCompany: Company | CompanySimple) => void;
  onView: (company: Company | CompanySimple) => void;
  isExpanded: boolean;
  onToggle: () => void;
  subcontractors?: CompanySimple[];
  loadingSubcontractors?: boolean;
}

// Componente de nodo individual del árbol
const CompanyNode = ({
  company,
  level,
  onEdit,
  onDelete,
  onAddSubcontractor,
  onView,
  isExpanded,
  onToggle,
  subcontractors = [],
  loadingSubcontractors = false,
}: CompanyNodeProps) => {
  const [showActions, setShowActions] = useState(false);
  const hasSubcontractors =
    subcontractors.length > 0 || (company as Company).subcontractors?.length;

  return (
    <div className="relative">
      {/* Línea vertical de conexión (estilo comentarios) */}
      {level > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-playBlueLight/30"
          style={{ marginLeft: `${(level - 1) * 32 + 16}px` }}
        />
      )}

      {/* Card de empresa */}
      <div
        className={`
          relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
          ${
            level === 0
              ? "bg-white border-playBlueLight/20 shadow-sm hover:shadow-md"
              : "bg-playGrey/50 border-playBlueLight/10 hover:bg-playGrey"
          }
          ${showActions ? "ring-2 ring-playOrange/30" : ""}
        `}
        style={{ marginLeft: `${level * 32}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Línea horizontal de conexión */}
        {level > 0 && (
          <div
            className="absolute left-0 top-1/2 h-0.5 w-4 bg-playBlueLight/30"
            style={{ marginLeft: `-16px` }}
          />
        )}

        {/* Botón expandir/colapsar */}
        <button
          onClick={onToggle}
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all
            ${
              hasSubcontractors
                ? "bg-playBlueDark/10 hover:bg-playBlueDark/20 cursor-pointer"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          {hasSubcontractors &&
            (isExpanded ? (
              <ChevronDown className="h-4 w-4 text-playBlueDark" />
            ) : (
              <ChevronRight className="h-4 w-4 text-playBlueDark" />
            ))}
        </button>

        {/* Icono empresa */}
        <div
          className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
          ${level === 0 ? "bg-playBlueDark" : "bg-playBlueLight"}
        `}
        >
          {level === 0 ? (
            <Building2 className="h-5 w-5 text-white" />
          ) : (
            <Network className="h-5 w-5 text-white" />
          )}
        </div>

        {/* Info principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-playBlueDark truncate">
              {company.name}
            </h3>
            {company.isSubcontractor && (
              <Badge
                variant="outline"
                className="text-xs bg-playOrange/10 text-playOrange border-playOrange/20"
              >
                Subcontrata
              </Badge>
            )}
            {!company.active && (
              <Badge variant="secondary" className="text-xs">
                Inactiva
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-playBlueLight">
            <span className="font-mono">{company.taxId}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline truncate">{company.email}</span>
          </div>
        </div>

        {/* Estados */}
        <div className="hidden md:flex items-center gap-2">
          <StatusBadge status={company.status} />
          <WorkerStatusBadge status={company.workerStatus} />
        </div>

        {/* Contador subcontratas */}
        {hasSubcontractors && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-playBlueLight/10 text-playBlueLight text-xs">
            <Network className="h-3 w-3" />
            <span>
              {subcontractors.length ||
                (company as Company).subcontractors?.length ||
                0}
            </span>
          </div>
        )}

        {/* Acciones (aparecen en hover) */}
        <div
          className={`
          flex items-center gap-1 transition-opacity duration-200
          ${showActions ? "opacity-100" : "opacity-0 sm:opacity-0"}
        `}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSubcontractor(company)}
            className="h-8 w-8 p-0 text-playOrange hover:bg-playOrange/10"
            title="Añadir subcontrata"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(company)}
            className="h-8 w-8 p-0 text-playBlueDark hover:bg-playBlueDark/10"
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(company)}
            className="h-8 w-8 p-0 text-playBlueLight hover:bg-playBlueLight/10"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(company)}
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Botón más en móvil */}
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden h-8 w-8 p-0"
          onClick={() => setShowActions(!showActions)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Subcontratas (recursivo) */}
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {loadingSubcontractors ? (
            <div
              className="flex items-center gap-2 p-3 text-sm text-playBlueLight"
              style={{ marginLeft: `${(level + 1) * 32}px` }}
            >
              <div className="h-4 w-4 border-2 border-playBlueLight/30 border-t-playBlueLight rounded-full animate-spin" />
              Cargando subcontratas...
            </div>
          ) : (
            subcontractors.map((sub) => (
              <CompanyTreeNode
                key={sub.id}
                company={sub}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddSubcontractor={onAddSubcontractor}
                onView={onView}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Wrapper que maneja el estado de expansión y carga de subcontratas
interface CompanyTreeNodeProps {
  company: Company | CompanySimple;
  level: number;
  onEdit: (company: Company | CompanySimple) => void;
  onDelete: (company: Company | CompanySimple) => void;
  onAddSubcontractor: (parentCompany: Company | CompanySimple) => void;
  onView: (company: Company | CompanySimple) => void;
  getSubcontractors?: (companyId: string) => Promise<CompanySimple[]>;
}

const CompanyTreeNode = ({
  company,
  level,
  onEdit,
  onDelete,
  onAddSubcontractor,
  onView,
  getSubcontractors,
}: CompanyTreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0); // Nivel 0 expandido por defecto
  const [subcontractors, setSubcontractors] = useState<CompanySimple[]>(
    (company as Company).subcontractors || []
  );
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(
    !!(company as Company).subcontractors?.length
  );

  const handleToggle = async () => {
    if (!isExpanded && !loaded && getSubcontractors && company.id) {
      setLoading(true);
      try {
        const subs = await getSubcontractors(company.id);
        setSubcontractors(subs);
        setLoaded(true);
      } finally {
        setLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <CompanyNode
      company={company}
      level={level}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddSubcontractor={onAddSubcontractor}
      onView={onView}
      isExpanded={isExpanded}
      onToggle={handleToggle}
      subcontractors={subcontractors}
      loadingSubcontractors={loading}
    />
  );
};

// Componente principal del árbol
interface CompanyTreeProps {
  companies: Company[];
  onEdit: (company: Company | CompanySimple) => void;
  onDelete: (company: Company | CompanySimple) => void;
  onAddSubcontractor: (parentCompany: Company | CompanySimple) => void;
  getSubcontractors?: (companyId: string) => Promise<CompanySimple[]>;
}

export const CompanyTree = ({
  companies,
  onEdit,
  onDelete,
  onAddSubcontractor,
  getSubcontractors,
}: CompanyTreeProps) => {
  const router = useRouter();

  // Filtramos solo empresas de nivel 0 (no subcontratas)
  const rootCompanies = companies.filter((c) => !c.isSubcontractor);

  const handleView = (company: Company | CompanySimple) => {
    router.push(`/dashboard/companies/${company.id}`);
  };

  if (rootCompanies.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-playBlueLight/20 p-12 text-center">
        <div className="w-16 h-16 bg-playGrey rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="h-8 w-8 text-playBlueLight" />
        </div>
        <h3 className="text-lg font-semibold text-playBlueDark mb-2">
          No hay empresas registradas
        </h3>
        <p className="text-playBlueLight mb-6">
          Añade tu primera empresa proveedora para empezar a gestionar CAE
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rootCompanies.map((company) => (
        <CompanyTreeNode
          key={company.id}
          company={company}
          level={0}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubcontractor={onAddSubcontractor}
          onView={handleView}
          getSubcontractors={getSubcontractors}
        />
      ))}
    </div>
  );
};
