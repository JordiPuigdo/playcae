"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

export const useAuthSession = () => {
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!expiresAt) return;

    const now = Date.now();

    // si ya está caducado al hidratar, salir inmediatamente
    if (now >= expiresAt) {
      logout();
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, expiresAt - now);

    return () => clearTimeout(timeoutId);
  }, [expiresAt, logout]);
};
