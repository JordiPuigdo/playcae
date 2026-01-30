"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { UserRole } from "@/types/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  Network,
  Building,
  History,
  ScanLine,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { hasAccess, role } = usePermissions();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // Links para Admin
  const adminLinks = [
    { href: "/dashboard", label: t("dashboard.sidebar.home"), icon: LayoutDashboard },
    { href: "/dashboard/companies", label: t("dashboard.sidebar.companies"), icon: Building2 },
    { href: "/dashboard/subcontractors", label: t("dashboard.sidebar.subcontractors"), icon: Network },
    {
      href: "/dashboard/access-history",
      label: t("dashboard.sidebar.accessHistory"),
      icon: History,
    },
    {
      href: "/access-control",
      label: t("dashboard.sidebar.accessControl"),
      icon: ScanLine,
    },
    {
      href: "/dashboard/configuration",
      label: t("dashboard.sidebar.configuration"),
      icon: Settings,
    },
  ];

  // Links para Company
  const companyLinks = [
    {
      href: `/dashboard/companies/${user?.companyId}`,
      label: t("dashboard.sidebar.company"),
      icon: Building,
    },
    { href: "/dashboard/subcontractors", label: t("dashboard.sidebar.subcontractors"), icon: Network },
    {
      href: "/access-control",
      label: t("dashboard.sidebar.accessControl"),
      icon: ScanLine,
    },
  ];

  const links = role === UserRole.Admin ? adminLinks : companyLinks;

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-brand-primary text-playGrey p-6 flex flex-col overflow-y-auto">
      <Image
        src="/assets/playcaeDashboard.png"
        alt="Logo Play CAE"
        width={150}
        height={40}
        className="mb-8 select-none pt-4"
      />

      <nav className="flex flex-col space-y-2 flex-grow">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          if (!hasAccess(href)) return null;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
            ${
              active
                ? "bg-playOrange text-white shadow-lg"
                : "hover:bg-playBlueLight hover:text-white text-playGrey"
            }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
