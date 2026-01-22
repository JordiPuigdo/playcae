"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserConfiguration } from "@/hooks/useUserConfiguration";
import { LogoUpload } from "@/components/LogoUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Loader from "@/components/Loader";
import { Settings, Image as ImageIcon, AlertCircle } from "lucide-react";
import { UserRole } from "@/types/user";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/Alert";

const ConfigurationPage = () => {
  const { user } = useAuthStore();
  const {
    configuration,
    isLoading,
    loadConfiguration,
    uploadLogo,
    updateLogo,
    deleteLogo,
  } = useUserConfiguration();

  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Verificar que el usuario sea ADMIN
  const isAdmin = user?.role === UserRole.Admin;

  useEffect(() => {
    setMounted(true);
    if (user?.userId && isAdmin) {
      loadConfiguration(user.userId);
    }
  }, [user?.userId, isAdmin]);

  useEffect(() => {
    // Resetear el error cuando cambie la configuración
    setImageError(false);
  }, [configuration?.logoUrl]);

  if (!mounted) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo usuarios con rol
            ADMIN pueden gestionar la configuración.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleUpload = async (file: File) => {
    if (!user?.userId) return;

    if (configuration?.logoUrl) {
      // Si ya existe un logo, actualizar
      await updateLogo(user.userId, file);
    } else {
      // Si no existe, subir por primera vez
      await uploadLogo(user.userId, file);
    }

    // Recargar configuración después de subir/actualizar
    await loadConfiguration(user.userId);
  };

  const handleDelete = async () => {
    if (!user?.userId) return;
    await deleteLogo(user.userId);
    await loadConfiguration(user.userId);
  };

  if (isLoading && !configuration) {
    return <Loader text="Cargando configuración..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-brand-primary" />
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Personaliza la apariencia de tu sistema
          </p>
        </div>
      </div>

      {/* Card de Logo */}
      <Card className="bg-white border border-playBlueLight/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-primary">
            <ImageIcon className="h-5 w-5" />
            Logo personalizado
          </CardTitle>
          <CardDescription>
            El logo se mostrará en el header del dashboard y en la pantalla de
            control de acceso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview del logo actual */}
          {configuration?.logoUrl && !imageError ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-brand-primary">
                  Logo actual
                </h3>
                <span className="text-xs text-muted-foreground">
                  Actualizado:{" "}
                  {new Date(configuration.updatedAt).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>
              <div className="border border-playBlueLight/30 rounded-lg p-6 bg-gray-50 flex items-center justify-center">
                <Image
                  src={`${configuration.logoUrl}?t=${new Date(configuration.updatedAt).getTime()}`}
                  alt="Logo actual"
                  width={400}
                  height={150}
                  className="object-contain max-h-[150px]"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              </div>
            </div>
          ) : imageError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error al cargar la imagen. El archivo podría no existir o estar
                corrupto.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <ImageIcon className="h-4 w-4" />
              <AlertDescription>
                No tienes un logo personalizado. Se está mostrando el logo por
                defecto de Play CAE.
              </AlertDescription>
            </Alert>
          )}

          {/* Vista previa del logo por defecto */}
          {(!configuration?.logoUrl || imageError) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-brand-primary">
                Logo por defecto
              </h3>
              <div className="border border-playBlueLight/30 rounded-lg p-6 bg-gray-50 flex items-center justify-center">
                <Image
                  src="/assets/playcae.png"
                  alt="Logo por defecto"
                  width={400}
                  height={150}
                  className="object-contain"
                  onError={(e) => {
                    console.error("Error loading default logo:", e);
                  }}
                />
              </div>
            </div>
          )}

          {/* Botón de carga */}
          <div className="pt-4 border-t border-playBlueLight/30">
            <LogoUpload
              currentLogoUrl={configuration?.logoUrl || null}
              onUpload={handleUpload}
              onDelete={configuration?.logoUrl ? handleDelete : undefined}
              disabled={isLoading}
            />
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 space-y-2">
            <p className="font-medium">Información sobre el logo:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                El logo se mostrará en el header del dashboard (esquina superior
                izquierda)
              </li>
              <li>
                También aparecerá en la pantalla de control de acceso para
                visitantes/trabajadores
              </li>
              <li>
                Si eliminas el logo, se mostrará automáticamente el logo por
                defecto de Play CAE
              </li>
              <li>
                Los cambios se aplicarán inmediatamente en todas las sesiones
                activas
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Sección de futuras configuraciones */}
      <Card className="bg-white border border-playBlueLight/30 opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-primary">
            <Settings className="h-5 w-5" />
            Más configuraciones (Próximamente)
          </CardTitle>
          <CardDescription>
            En el futuro podrás personalizar colores, temas y otras opciones
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ConfigurationPage;
