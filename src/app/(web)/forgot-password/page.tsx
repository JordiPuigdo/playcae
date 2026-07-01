"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PasswordService } from "@/services/password.service";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Escribe tu email.");
      return;
    }

    setIsLoading(true);
    try {
      const service = new PasswordService();
      await service.forgot({ email: email.trim() });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-playGrey p-4">
      <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-brand-primary">
            Recuperar contraseña
          </CardTitle>
          <CardDescription className="text-center text-playBlueLight">
            Te enviaremos un enlace para crear una nueva contraseña.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 text-playGreen" />
              </div>
              <p className="text-sm text-muted-foreground">
                Si el email está registrado, recibirás un enlace para cambiar tu
                contraseña. Revisa tu bandeja de entrada.
              </p>
              <Button
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
                onClick={() => router.push("/login")}
              >
                Volver a iniciar sesión
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

              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-primary">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  uppercase={false}
                  placeholder="ejemplo@correo.com"
                  className="border-playBlueLight focus-visible:ring-brand-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
              >
                {isLoading ? "Enviando…" : "Enviar enlace"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-brand-primary hover:bg-playGrey"
                onClick={() => router.push("/login")}
              >
                Volver
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
