"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Maximize, Minimize, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const AccessControl = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dni, setDni] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setIsLoading(true);

    // Simulate API call for access validation
    setTimeout(() => {
      // Simple validation logic - you can replace with real API call
      const isValid = dni.length >= 8 && dni.length <= 9;
      setAccessGranted(isValid);
      setShowModal(true);
      setIsLoading(false);

      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowModal(false);
        setDni("");
      }, 3000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
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

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div className="flex space-y-2 w-full">
              <Input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-16 text-2xl text-center touch-manipulation"
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
              {isLoading ? "Verificando..." : "Acceder"}
            </Button>
          </form>
        </div>
      </div>

      {/* Access Result Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-6 p-6 text-center">
            {accessGranted ? (
              <>
                <CheckCircle className="h-20 w-20 text-green-500" />
                <div className="space-y-2">
                  <DialogTitle className="text-3xl font-bold text-green-600">
                    Acceso Permitido
                  </DialogTitle>
                  <p className="text-lg text-muted-foreground">
                    Bienvenido al sistema
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 text-red-500" />
                <div className="space-y-2">
                  <DialogTitle className="text-3xl font-bold text-red-600">
                    Acceso Denegado
                  </DialogTitle>
                  <p className="text-lg text-muted-foreground">
                    DNI no válido o no autorizado
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessControl;
