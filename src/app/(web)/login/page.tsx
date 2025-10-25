"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";

import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/user";
import { PasswordInput } from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, errorAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor complete todos los campos.");
      return;
    }

    setIsLoading(true);
    await login(email, password);
  };

  useEffect(() => {
    if (errorAuth) {
      setIsLoading(false);
      setError(errorAuth);
    }
  }, [errorAuth]);

  useEffect(() => {
    if (!user) return;

    if (user?.role === UserRole.Admin) {
      router.push("/dashboard");
    } else if (user?.role === UserRole.Company) {
      if (user.isNew) {
        router.push(`/onboarding?token=${user.companyId}`);
      } else {
        router.push(`/dashboard/companies/${user.companyId}`);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Iniciando sesión...
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Acceda a su cuenta para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Contraseña *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 font-normal text-sm"
                onClick={() => router.push("/forgot-password")}
              >
                ¿Olvidó su contraseña?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Entrar"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/register")}
            >
              ¿No tiene cuenta? Regístrese
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
