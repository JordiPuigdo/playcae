"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordService } from "@/services/password.service";
import { CheckCircle2 } from "lucide-react";

const MIN_PASSWORD_LENGTH = 8;

export const ResetPasswordClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("El enlace no es válido. Solicita uno nuevo.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    try {
      const service = new PasswordService();
      await service.reset({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(
        (err as { message?: string })?.message ??
          "El enlace no es válido o ha caducado. Solicita uno nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-playGrey p-4">
      <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-brand-primary">
            Nueva contraseña
          </CardTitle>
          <CardDescription className="text-center text-playBlueLight">
            Escribe tu nueva contraseña para acceder a PlayCAE.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-playGreen" />
              </div>
              <p className="text-sm text-muted-foreground">
                Tu contraseña se ha actualizado correctamente.
              </p>
              <Button
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
                onClick={() => router.push("/login")}
              >
                Ir a iniciar sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-l-4 border-brand-secondary bg-brand-secondary/10">
                  <AlertDescription className="text-brand-secondary">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <PasswordInput
                id="new-password"
                name="new-password"
                label="Nueva contraseña *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                required
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />

              <PasswordInput
                id="confirm-password"
                name="confirm-password"
                label="Repite la contraseña *"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                required
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
              >
                {isLoading ? "Guardando…" : "Guardar contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
