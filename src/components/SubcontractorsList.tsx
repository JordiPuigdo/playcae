"use client";

import { CompanySimple } from "@/types/company";
import { Network, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { StatusBadge } from "./StatusBadge";
import { WorkerStatusBadge } from "./WorkerStatusBadge";

interface SubcontractorsListProps {
  subcontractors: CompanySimple[];
  parentCompanyName: string;
  onAddSubcontractor: () => void;
}

export const SubcontractorsList = ({
  subcontractors,
  parentCompanyName,
  onAddSubcontractor,
}: SubcontractorsListProps) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header con botón añadir */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-playBlueDark">
            Subcontratas de {parentCompanyName}
          </h3>
          <p className="text-sm text-playBlueLight">
            Empresas que trabajan como subcontratas de este proveedor
          </p>
        </div>
        <Button
          onClick={onAddSubcontractor}
          className="flex items-center gap-2 bg-playOrange hover:bg-playOrange/90 text-white"
        >
          <Plus className="h-4 w-4" />
          Añadir subcontrata
        </Button>
      </div>

      {/* Lista de subcontratas */}
      {subcontractors.length === 0 ? (
        <Card className="bg-white border-dashed border-2 border-playBlueLight/30">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-playOrange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Network className="h-8 w-8 text-playOrange" />
            </div>
            <h3 className="text-lg font-semibold text-playBlueDark mb-2">
              Sin subcontratas
            </h3>
            <p className="text-playBlueLight mb-6 max-w-md mx-auto">
              Esta empresa no tiene subcontratas registradas. Añade una
              subcontrata para gestionar su documentación CAE.
            </p>
            <Button
              onClick={onAddSubcontractor}
              className="bg-playOrange hover:bg-playOrange/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir primera subcontrata
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {subcontractors.map((sub) => (
            <div
              key={sub.id}
              className={`flex items-center justify-between p-4 bg-white rounded-xl border border-playBlueLight/20 hover:shadow-md transition-all cursor-pointer ${
                !sub.active ? "opacity-50 bg-gray-50" : ""
              }`}
              onClick={() => router.push(`/dashboard/companies/${sub.id}`)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    sub.active ? "bg-playOrange/10" : "bg-gray-200"
                  }`}
                >
                  <Network
                    className={`h-5 w-5 ${
                      sub.active ? "text-playOrange" : "text-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-semibold ${
                        sub.active ? "text-playBlueDark" : "text-gray-500"
                      }`}
                    >
                      {sub.name}
                    </h4>
                    {!sub.active && (
                      <Badge variant="secondary" className="text-xs">
                        Inactiva
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      sub.active ? "text-playBlueLight" : "text-gray-400"
                    }`}
                  >
                    {sub.taxId} • {sub.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Badge subcontrata */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    sub.active
                      ? "bg-playOrange/10 text-playOrange"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  Subcontrata
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className={sub.active ? "" : "text-gray-400"}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/companies/${sub.id}`);
                  }}
                >
                  Ver detalle →
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
