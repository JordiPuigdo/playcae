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
import { Textarea } from "@/components/ui/TextArea";
import { PasswordInput } from "@/components/PasswordInput";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-Toast";
import { useLead, LeadOrigin } from "@/hooks/useLead";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState({
    companyName: "",
    cif: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const { createLead } = useLead();

  const [error, setError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCIF = (cif: string) =>
    /^[ABCDEFGHJNPQRSUVW]\d{8}$/.test(cif.toUpperCase());

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateRegisterForm = () => {
    const {
      companyName,
      cif,
      contactPerson,
      email,
      phone,
      password,
      confirmPassword,
    } = registerData;

    if (
      !companyName ||
      !cif ||
      !contactPerson ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      setError("Por favor complete todos los campos obligatorios.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Por favor ingrese un correo electrónico válido.");
      return false;
    }
    if (!validateCIF(cif)) {
      setError("Por favor ingrese un CIF válido (letra + 8 dígitos).");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setError("");

    try {
      await createLead({
        companyName: registerData.companyName,
        taxId: registerData.cif,
        contactPerson: registerData.contactPerson,
        email: registerData.email,
        phone: registerData.phone,
        address: registerData.address,
        password: registerData.password,
        origin: LeadOrigin.Web,
      });

      toast({
        title: "Registro exitoso",
        description:
          "Su empresa ha sido registrada. Espere la aprobación para acceder.",
      });

      setRegisterData({
        companyName: "",
        cif: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      router.push("/login");
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        setError("Ya existe una empresa registrada con este email o CIF.");
      } else {
        setError("El registro ha fallado. Intente nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Registrando empresa...
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Registre su empresa para comenzar a usar la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="companyName">Nombre Empresa *</Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Escriba el nombre de la empresa"
                value={registerData.companyName}
                onChange={handleRegisterInputChange}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cif">CIF *</Label>
              <Input
                id="cif"
                name="cif"
                type="text"
                placeholder="A12345678"
                value={registerData.cif}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Persona de Contacto *</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                type="text"
                placeholder="Nombre de la persona de contacto"
                value={registerData.contactPerson}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerEmail">Correo electrónico *</Label>
              <Input
                id="registerEmail"
                name="email"
                type="email"
                placeholder="empresa@correo.com"
                value={registerData.email}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+34 600 000 000"
                value={registerData.phone}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Escriba la dirección de la empresa"
                value={registerData.address}
                onChange={handleRegisterInputChange}
                rows={2}
              />
            </div>

            <PasswordInput
              id="registerPassword"
              name="password"
              label="Contraseña *"
              value={registerData.password}
              onChange={handleRegisterInputChange}
              placeholder="Escriba la contraseña"
              required
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar Contraseña *"
              value={registerData.confirmPassword}
              onChange={handleRegisterInputChange}
              placeholder="Repita la contraseña"
              required
            />

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Registrando..."
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Crear Cuenta
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Volver al Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
