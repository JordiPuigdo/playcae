import { AccessHistoryEntry } from "@/types/accessHistory";
import { Separator } from "@radix-ui/react-select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  User,
  Building2,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  History,
  Download,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
} from "./ui/Sheet";

interface AccessHistoryDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entry: AccessHistoryEntry | null;
}

export const AccessHistoryDetailPanel = ({
  isOpen,
  onClose,
  entry,
}: AccessHistoryDetailPanelProps) => {
  if (!entry) return null;

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const calculateDuration = () => {
    if (!entry.exitTime) return "En instalación";

    const entryTime = new Date(entry.entryTime);
    const exitTime = new Date(entry.exitTime);
    const diff = exitTime.getTime() - entryTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const documents = [
    { name: "DNI", status: "Válido", expiry: "2025-12-31" },
    {
      name: "Seguro de Responsabilidad Civil",
      status: "Válido",
      expiry: "2025-06-30",
    },
    {
      name: "Certificado Formación PRL",
      status: "Válido",
      expiry: "2025-03-15",
    },
    { name: "Reconocimiento Médico", status: "Válido", expiry: "2025-08-20" },
  ];

  const workerHistory = [
    { date: "2024-01-14", duration: "8h 30m", status: "Apto" },
    { date: "2024-01-13", duration: "9h 15m", status: "Apto" },
    { date: "2024-01-10", duration: "7h 45m", status: "Apto" },
  ];

  const handleDownloadPDF = () => {
    console.log("Descargando PDF para:", entry.technicianName);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto border-l border-playBlueLight/30">
        <SheetHeader>
          <SheetTitle className="text-2xl text-brand-primary">
            Detalle de Acceso
          </SheetTitle>
          <SheetDescription className="text-playBlueLight">
            Información completa del registro seleccionado
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Información Principal */}
          <Card className="border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-primary">
                <User className="h-5 w-5 text-brand-primary" />
                Información del Técnico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-playBlueLight">Nombre:</span>
                <span className="font-medium text-brand-primary">
                  {entry.technicianName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-playBlueLight">DNI:</span>
                <span className="font-medium text-brand-primary">
                  {entry.dni}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-playBlueLight">Estado:</span>
                <span
                  className={`inline-block w-3 h-3 rounded-full border ${
                    entry.status === "Apto"
                      ? "bg-playGreen border-playGreen/60"
                      : "bg-brand-secondary border-brand-secondary/60"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Empresa y Horario */}
          <Card className="border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-primary">
                <Building2 className="h-5 w-5 text-brand-primary" />
                Empresa y Horario
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-playBlueLight">Empresa:</span>
                <span className="font-medium text-brand-primary">
                  {entry.company}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-playBlueLight">Entrada:</span>
                <span className="font-medium flex items-center gap-2 text-brand-primary">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(entry.entryTime)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-playBlueLight">Salida:</span>
                <span className="font-medium flex items-center gap-2">
                  {entry.exitTime ? (
                    <>
                      <Calendar className="h-4 w-4 text-brand-primary" />
                      <span className="text-brand-primary">
                        {formatDateTime(entry.exitTime)}
                      </span>
                    </>
                  ) : (
                    <span className="bg-playYellow text-black border border-playYellow/40 px-2 py-1 rounded-full text-xs">
                      En instalación
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-playBlueLight">Duración:</span>
                <span className="font-medium flex items-center gap-2 text-brand-primary">
                  <Clock className="h-4 w-4" />
                  {calculateDuration()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card className="border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-primary">
                <FileText className="h-5 w-5 text-brand-primary" />
                Documentos del Trabajador
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-playGrey rounded-lg border border-playBlueLight/30"
                  >
                    <div>
                      <p className="font-medium text-sm text-brand-primary">
                        {doc.name}
                      </p>
                      <p className="text-xs text-playBlueLight">
                        Vence:{" "}
                        {format(new Date(doc.expiry), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>

                    <span className="inline-block w-3 h-3 rounded-full bg-playGreen border border-playGreen/60" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card className="border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-primary">
                <AlertTriangle className="h-5 w-5 text-brand-primary" />
                Alertas Asociadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-playBlueLight">
                No hay alertas activas para este trabajador
              </p>
            </CardContent>
          </Card>

          {/* Histórico */}
          <Card className="border border-playBlueLight/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-primary">
                <History className="h-5 w-5 text-brand-primary" />
                Histórico de Accesos
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {workerHistory.map((record, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-playGrey rounded-lg border border-playBlueLight/30"
                  >
                    <div>
                      <p className="font-medium text-sm text-brand-primary">
                        {format(new Date(record.date), "dd/MM/yyyy", {
                          locale: es,
                        })}
                      </p>
                      <p className="text-xs text-playBlueLight">
                        Duración: {record.duration}
                      </p>
                    </div>

                    <span className="inline-block w-3 h-3 rounded-full bg-playGreen border border-playGreen/60" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Descargar PDF */}
          <Button
            className="w-full border border-playBlueLight text-brand-primary hover:bg-playGrey"
            variant="outline"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar Informe PDF
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
