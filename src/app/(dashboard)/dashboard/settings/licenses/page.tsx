"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { UserRole } from "@/types/user";
import { LicenseManager } from "@/components/LicenseManager";
import Loader from "@/components/Loader";

export default function LicensesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user && user.role !== UserRole.SuperAdmin) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!user) return <Loader text="" />;
  if (user.role !== UserRole.SuperAdmin) return null;

  return <LicenseManager />;
}
