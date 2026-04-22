"use client";

import React, { useEffect, useState, Suspense } from "react";
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
  WifiOff,
  Wifi,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { AccessService } from "@/services/access.service";
import { AccessValidationResult } from "@/types/accessHistory";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLogoCache } from "@/hooks/useLogoCache";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import { toast } from "@/hooks/use-Toast";

const accessService = new AccessService();

type ModalState = "idle" | "validated" | "offline-confirm" | "checkin" | "checkout" | "queued" | "error";

const AccessControlContent = () => {
  const searchParams = useSearchParams();
  const accessCompanyId = searchParams.get("companyId") || "";
  const { user, logoUrl, selectedSiteId, availableSites } = useAuthStore();
  const { t } = useTranslation();
  const adminUserId =
    user?.role === UserRole.PRLManager
      ? user?.parentCompanyId || user?.userId || ""
      : user?.userId || "";
  const selectedSiteName =
    availableSites.find((site) => site.id === selectedSiteId)?.name || null;

  const isOnline = useOnlineStatus();
  const cachedLogoUrl = useLogoCache(logoUrl);
  const { enqueue, syncQueue, queue } = useOfflineQueue();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dni, setDni] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<AccessValidationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | undefined>(undefined);
  const [queuedWorkerName, setQueuedWorkerName] = useState("");

  const displayLogoUrl = cachedLogoUrl ?? "/assets/playcae.png";

  // Auto-sync queue when connection is restored
  useEffect(() => {
    if (!isOnline || queue.length === 0) return;

    syncQueue().then(({ synced, failed }) => {
      if (synced > 0) {
        toast({
          title: t("accessControl.kiosk.syncSuccess"),
          description: `${synced} ${t("accessControl.kiosk.syncSuccessCount")}`,
        });
      }
      if (failed > 0) {
        toast({
          title: t("accessControl.kiosk.syncPartialFail"),
          description: `${failed} ${t("accessControl.kiosk.syncFailCount")}`,
          variant: "destructive",
        });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

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
    setErrorStatus(undefined);
    setQueuedWorkerName("");
  };

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;

    if (!isOnline) {
      setModalState("offline-confirm");
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await accessService.validateAccess({
        cardId: dni,
        adminUserId: adminUserId,
        siteId: selectedSiteId || undefined,
        accessCompanyId: accessCompanyId || undefined,
      });

      if (response.data) {
        setValidationResult(response.data);
        setModalState("validated");
        setShowModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || t("accessControl.kiosk.errorValidation"));
      setErrorStatus(error.status);
      setModalState("error");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineCheckIn = () => {
    const payload = {
      cardId: dni,
      adminUserId,
      siteId: selectedSiteId || undefined,
      accessCompanyId: accessCompanyId || undefined,
    };
    enqueue({ type: "checkin", payload, workerName: dni, queuedAt: Date.now() });
    setQueuedWorkerName(dni);
    setModalState("queued");
    setTimeout(() => {
      setShowModal(false);
      resetState();
    }, 3000);
  };

  const handleOfflineCheckOut = () => {
    const payload = {
      cardId: dni,
      adminUserId,
      siteId: selectedSiteId || undefined,
      accessCompanyId: accessCompanyId || undefined,
    };
    enqueue({ type: "checkout", payload, workerName: dni, queuedAt: Date.now() });
    setQueuedWorkerName(dni);
    setModalState("queued");
    setTimeout(() => {
      setShowModal(false);
      resetState();
    }, 3000);
  };

  const handleCheckIn = async () => {
    if (!dni.trim()) return;

    setIsLoading(true);

    const payload = {
      cardId: dni,
      adminUserId: adminUserId,
      siteId: selectedSiteId || undefined,
      accessCompanyId: accessCompanyId || undefined,
    };

    try {
      await accessService.checkIn(payload);
      setModalState("checkin");

      setTimeout(() => {
        setShowModal(false);
        resetState();
      }, 3000);
    } catch (error: any) {
      if (!isOnline) {
        const name = validationResult?.workerName ?? dni;
        enqueue({ type: "checkin", payload, workerName: name, queuedAt: Date.now() });
        setQueuedWorkerName(name);
        setModalState("queued");
        setTimeout(() => {
          setShowModal(false);
          resetState();
        }, 3000);
      } else {
        setErrorMessage(error.message || t("accessControl.kiosk.errorCheckIn"));
        setErrorStatus(error.status);
        setModalState("error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!dni.trim()) return;

    setIsLoading(true);

    const payload = {
      cardId: dni,
      adminUserId: adminUserId,
      siteId: selectedSiteId || undefined,
      accessCompanyId: accessCompanyId || undefined,
    };

    try {
      await accessService.checkOut(payload);
      setModalState("checkout");

      setTimeout(() => {
        setShowModal(false);
        resetState();
      }, 3000);
    } catch (error: any) {
      if (!isOnline) {
        const name = validationResult?.workerName ?? dni;
        enqueue({ type: "checkout", payload, workerName: name, queuedAt: Date.now() });
        setQueuedWorkerName(name);
        setModalState("queued");
        setTimeout(() => {
          setShowModal(false);
          resetState();
        }, 3000);
      } else {
        setErrorMessage(error.message || t("accessControl.kiosk.errorCheckOut"));
        setErrorStatus(error.status);
        setModalState("error");
      }
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
            {t("accessControl.kiosk.processing")}
          </DialogTitle>
        </div>
      );
    }

    switch (modalState) {
      case "offline-confirm":
        return (
          <div className="flex flex-col items-center gap-5 p-6 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100">
              <WifiOff className="h-10 w-10 text-orange-500" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {t("accessControl.kiosk.offlineTitle")}
              </DialogTitle>
              <p className="text-base text-muted-foreground max-w-xs mx-auto">
                {t("accessControl.kiosk.offlineConfirmMessage")}
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">DNI</span>
              <span className="text-lg font-bold text-gray-900 font-mono">{dni}</span>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                onClick={handleOfflineCheckIn}
                size="lg"
                className="flex-1 h-14 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-sm"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {t("accessControl.kiosk.checkIn")}
              </Button>
              <Button
                onClick={handleOfflineCheckOut}
                size="lg"
                className="flex-1 h-14 text-base font-semibold bg-orange-500 hover:bg-orange-600 shadow-sm"
              >
                <LogOut className="mr-2 h-5 w-5" />
                {t("accessControl.kiosk.checkOut")}
              </Button>
            </div>

            <Button variant="ghost" onClick={handleCloseModal} className="text-sm text-muted-foreground hover:text-gray-700 w-full">
              {t("accessControl.kiosk.close")}
            </Button>
          </div>
        );

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
                {validationResult.canAccess ? t("accessControl.kiosk.accessGranted") : t("accessControl.kiosk.accessDenied")}
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
                        {t("accessControl.kiosk.documentIssues")}
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
                    {t("accessControl.kiosk.checkOut")}
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckIn}
                    size="lg"
                    className="flex-1 h-16 text-lg bg-green-600 hover:bg-green-700"
                  >
                    <LogIn className="mr-2 h-6 w-6" />
                    {t("accessControl.kiosk.checkIn")}
                  </Button>
                )}
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="mt-2"
            >
              {t("accessControl.kiosk.close")}
            </Button>
          </div>
        );

      case "checkin":
        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            <LogIn className="h-20 w-20 text-green-500" />
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-green-600">
                {t("accessControl.kiosk.entryRegistered")}
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                {t("accessControl.kiosk.entryRegisteredMessage")}
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
                {t("accessControl.kiosk.exitRegistered")}
              </DialogTitle>
              <p className="text-lg text-muted-foreground">
                {t("accessControl.kiosk.exitRegisteredMessage")}
              </p>
            </div>
          </div>
        );

      case "queued":
        return (
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            <Clock className="h-20 w-20 text-blue-500" />
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-blue-600">
                {t("accessControl.kiosk.queued")}
              </DialogTitle>
              {queuedWorkerName && (
                <p className="text-xl font-semibold text-gray-800">
                  {queuedWorkerName}
                </p>
              )}
              <p className="text-lg text-muted-foreground">
                {t("accessControl.kiosk.queuedMessage")}
              </p>
            </div>
          </div>
        );

      case "error": {
        const isNetworkError = !errorStatus;
        const isAuthError = errorStatus === 401;
        const isServerError = errorStatus !== undefined && errorStatus >= 500;

        const errorTitle = isNetworkError
          ? t("accessControl.kiosk.errorNetworkTitle")
          : isAuthError
          ? t("accessControl.kiosk.errorAuthTitle")
          : t("accessControl.kiosk.errorTitle");

        const errorDetail = isAuthError
          ? t("accessControl.kiosk.errorAuthDetail")
          : isNetworkError
          ? t("accessControl.kiosk.errorNetworkDetail")
          : errorMessage;

        return (
          <div className="flex flex-col items-center gap-5 p-6 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                {errorTitle}
              </DialogTitle>
              <p className="text-base text-muted-foreground max-w-xs mx-auto">
                {errorDetail}
              </p>
              {isServerError && errorMessage && errorMessage !== errorDetail && (
                <p className="text-sm text-gray-500 italic">{errorMessage}</p>
              )}
            </div>

            {(errorStatus || isNetworkError) && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                <span className="text-xs text-gray-400 uppercase tracking-wide">
                  {t("accessControl.kiosk.errorCode")}
                </span>
                <span className="text-xs font-mono font-semibold text-gray-600">
                  {errorStatus ?? "NET"}
                </span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold bg-red-500 hover:bg-red-600 text-white shadow-sm"
              onClick={handleCloseModal}
            >
              {t("accessControl.kiosk.tryAgain")}
            </Button>
          </div>
        );
      }

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
      {/* Connectivity badge */}
      <div className="fixed top-4 left-4 z-50">
        {isOnline ? (
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <Wifi className="h-3 w-3" />
            {t("accessControl.kiosk.online")}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700">
            <WifiOff className="h-4 w-4" />
            {t("accessControl.kiosk.offlineWarning")}
          </div>
        )}
      </div>

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
              {t("accessControl.kiosk.title")}
            </h1>
            <div className="flex w-full items-center">
              <Image
                src={displayLogoUrl}
                alt="Logo Play CAE"
                width={400}
                height={150}
                className="flex items-center justify-center"
                priority
                unoptimized
              />
            </div>
            <p className="text-xl text-muted-foreground">
              {t("accessControl.kiosk.enterDni")}
            </p>
            {selectedSiteName && (
              <p className="text-sm text-playBlueLight">Sede activa: {selectedSiteName}</p>
            )}
          </div>

          <form onSubmit={handleValidate} className="space-y-6 w-full">
            <div className="flex space-y-2 w-full">
              <Input
                type="text"
                placeholder={t("accessControl.kiosk.dniPlaceholder")}
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
                  {t("accessControl.kiosk.verifying")}
                </>
              ) : (
                t("accessControl.kiosk.verify")
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
