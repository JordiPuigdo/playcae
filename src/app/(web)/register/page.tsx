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
import { useTranslation } from "@/hooks/useTranslation";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
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
      setError(t("auth.register.errors.requiredFields"));
      return false;
    }
    if (!validateEmail(email)) {
      setError(t("auth.register.errors.invalidEmail"));
      return false;
    }
    if (!validateCIF(cif)) {
      setError(t("auth.register.errors.invalidCif"));
      return false;
    }
    if (password.length < 6) {
      setError(t("auth.register.errors.passwordLength"));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t("auth.register.errors.passwordMismatch"));
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
        title: t("auth.register.success"),
        description: t("auth.register.successDescription"),
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
        setError(t("auth.register.errors.duplicateEntry"));
      } else {
        setError(t("auth.register.errors.generic"));
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
              {t("auth.register.loadingMessage")}
            </p>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.register.title")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.register.description")}
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
              <Label htmlFor="companyName">{t("auth.register.companyName")} *</Label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder={t("auth.register.companyNamePlaceholder")}
                value={registerData.companyName}
                onChange={handleRegisterInputChange}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cif">{t("auth.register.cif")} *</Label>
              <Input
                id="cif"
                name="cif"
                type="text"
                placeholder={t("auth.register.cifPlaceholder")}
                value={registerData.cif}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">{t("auth.register.contactPerson")} *</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                type="text"
                placeholder={t("auth.register.contactPersonPlaceholder")}
                value={registerData.contactPerson}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registerEmail">{t("auth.register.email")} *</Label>
              <Input
                id="registerEmail"
                name="email"
                type="email"
                placeholder={t("auth.register.emailPlaceholder")}
                value={registerData.email}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("auth.register.phone")} *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={t("auth.register.phonePlaceholder")}
                value={registerData.phone}
                onChange={handleRegisterInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("auth.register.address")}</Label>
              <Textarea
                id="address"
                name="address"
                placeholder={t("auth.register.addressPlaceholder")}
                value={registerData.address}
                onChange={handleRegisterInputChange}
                rows={2}
              />
            </div>

            <PasswordInput
              id="registerPassword"
              name="password"
              label={`${t("auth.register.password")} *`}
              value={registerData.password}
              onChange={handleRegisterInputChange}
              placeholder={t("auth.register.passwordPlaceholder")}
              required
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label={`${t("auth.register.confirmPassword")} *`}
              value={registerData.confirmPassword}
              onChange={handleRegisterInputChange}
              placeholder={t("auth.register.confirmPasswordPlaceholder")}
              required
            />

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  t("auth.register.submitting")
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    {t("auth.register.submit")}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                {t("auth.register.backToLogin")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
