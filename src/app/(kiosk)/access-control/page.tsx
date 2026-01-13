"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import {
  Maximize,
  Minimize,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { AccessService } from "@/services/access.service";
import { AccessValidationResult } from "@/types/accessHistory";
import { useAuthStore } from "@/hooks/useAuthStore";

const accessService = new AccessService();

type ModalState = "idle" | "validated" | "checkin" | "checkout" | "error";

const AccessControlContent = () => {
  const searchParams = useSearchParams();
  const accessCompanyId = searchParams.get("companyId") || "";
  const { user } = useAuthStore();
  const adminUserId = user?.userId || "";

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dni, setDni] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<AccessValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  const resetState = () => {
    setDni("");
    setValidationResult(null);
    setModalState("idle");
    setErrorMessage("");
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await accessService.validateAccess({
        cardId: dni,
        adminUserId: adminUserId,
        accessCompanyId: accessCompanyId || undefined,
      });

      if (response.data) {
        setValidationResult(response.data);
        setModalState("validated");
        setShowModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Error al validar el acceso");
      setModalState("error");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!dni.trim()) return;

    setIsLoading(true);

    try {
      await accessService.checkIn({
        cardId: dni,
        adminUserId: adminUserId,
        accessCompanyId: accessCompanyId || undefined,
      });
      setModalState("checkin");

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        resetState();
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al registrar entrada");
      setModalState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!dni.trim()) return;

    setIsLoading(true);

    try {
      await accessService.checkOut({
        cardId: dni,
        adminUserId: adminUserId,
        accessCompanyId: accessCompanyId || undefined,
      });
      setModalState("checkout");

      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        resetState();
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al registrar salida");
      setModalState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetState();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidate(e as any);
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center space-y-6 p-6 text-center">
          <Loader2 className="h-20 w-20 text-blue-500 animate-spin" />
          <DialogTitle className="text-2xl font-bold text-gray-700">
            Procesando...
          </DialogTitle>
        </div>
      );
    }

    switch (modalState) {
      case "validated":
        if (!validationResult) return null;

        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            {validationResult.canAccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}

            <div className="space-y-2">
              <DialogTitle
                className={`text-2xl font-bold ${
                  validationResult.canAccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {validationResult.canAccess ? "Apto para acceso" : "No apto"}
              </DialogTitle>
              <p className="text-xl font-semibold text-gray-800">
                {validationResult.workerName}
              </p>
              <p className="text-md text-gray-600">
                {validationResult.companyName}
              </p>

              {validationResult.message && (
                <p className="text-sm text-gray-500 mt-2">
                  {validationResult.message}
                </p>
              )}

              {validationResult.documentIssues &&
                validationResult.documentIssues.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Problemas documentación
                      </span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {validationResult.documentIssues.map((issue, idx) => (
                        <li key={idx}>
                          • {issue.documentName}: {issue.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {validationResult.canAccess && (
              <div className="flex gap-4 w-full mt-4">
                {validationResult.hasActiveCheckIn ? (
                  <Button
                    onClick={handleCheckOut}
                    size="lg"
                    className="flex-1 h-16 text-lg bg-orange-500 hover:bg-orange-600"
                  >
                    <LogOut className="mr-2 h-6 w-6" />
                    Fichar Salida
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckIn}
                    size="lg"
                    className="flex-1 h-16 text-lg bg-green-600 hover:bg-green-700"
                  >
                    <LogIn className="mr-2 h-6 w-6" />
                    Fichar Entrada
                  </Button>
                )}
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="mt-2"
            >
              Cerrar
            </Button>
          </div>
        );

      case "checkin":
        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            <LogIn className="h-20 w-20 text-green-500" />
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-green-600">
                Entrada Registrada
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                ¡Bienvenido! Tu entrada ha sido registrada correctamente.
              </p>
            </div>
          </div>
        );

      case "checkout":
        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            <LogOut className="h-20 w-20 text-orange-500" />
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-orange-600">
                Salida Registrada
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                ¡Hasta pronto! Tu salida ha sido registrada correctamente.
              </p>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            <XCircle className="h-20 w-20 text-red-500" />
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-red-600">
                Error
              </DialogTitle>
              <p className="text-lg text-muted-foreground">{errorMessage}</p>
            </div>
            <Button variant="outline" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-background min-h-screen relative flex flex-col ${
        isFullscreen ? "z-0" : ""
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFullscreen}
        className="fixed top-24 right-12 z-50 h-12 w-12 touch-manipulation"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize className="h-6 w-6" />
        ) : (
          <Maximize className="h-6 w-6" />
        )}
      </Button>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col w-full max-w-md space-y-8 text-center items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Control de Acceso
            </h1>
            <div className="flex w-full items-center">
              <Image
                src="/assets/girbau.png"
                alt="Logo Play CAE"
                width={400}
                height={150}
                className="flex items-center justify-center"
              />
            </div>
            <p className="text-xl text-muted-foreground">
              Introduce tu DNI para acceder
            </p>
          </div>

          <form onSubmit={handleValidate} className="space-y-6 w-full">
            <div className="flex space-y-2 w-full">
              <Input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                className="h-16 text-2xl text-center touch-manipulation uppercase"
                maxLength={9}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!dni.trim() || isLoading}
              className="h-16 w-full text-xl touch-manipulation"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Access Result Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md mx-auto">
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrapper con Suspense para useSearchParams
const AccessControl = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      }
    >
      <AccessControlContent />
    </Suspense>
  );
};

export default AccessControl;
