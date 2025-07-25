"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/Button";
import ForgotPassword from "@/components/ForgotPassword";
import Loader from "@/components/Loader";
import { UserRole } from "@/types/user";
import { useToast } from "@/hooks/use-Toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, errorAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos");
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
    if (!user) {
      return;
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <main className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {showForgotPassword ? (
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        ) : (
          <>
            {isLoading && <Loader text="Iniciando sesión..." />}
            <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900">
              Iniciar sesión
            </h1>

            {error && (
              <p className="mb-6 text-center text-red-600 bg-red-100 border border-red-300 rounded-md py-2 px-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  required
                  placeholder="********"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Olvido su contraseña?
                </Button>
              </div>
              <Button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition">
                Entrar
              </Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
