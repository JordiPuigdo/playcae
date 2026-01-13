import { usePermissions } from "@/hooks/usePermissions";
import { useAuthStore } from "@/hooks/useAuthStore";
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
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { hasAccess, role } = usePermissions();
  const { user } = useAuthStore();

  // Links para Admin
  const adminLinks = [
    { href: "/dashboard", label: "Panel de control", icon: LayoutDashboard },
    { href: "/dashboard/companies", label: "Empresas", icon: Building2 },
    { href: "/dashboard/subcontractors", label: "Subcontratas", icon: Network },
    {
      href: "/dashboard/access-history",
      label: "Histórico de Accesos",
      icon: History,
    },
    {
      href: "/access-control",
      label: "Control de Acceso",
      icon: ScanLine,
    },
  ];

  // Links para Company
  const companyLinks = [
    {
      href: `/dashboard/companies/${user?.companyId}`,
      label: "Empresa",
      icon: Building,
    },
    { href: "/dashboard/subcontractors", label: "Subcontratas", icon: Network },
    {
      href: "/access-control",
      label: "Control de Acceso",
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
