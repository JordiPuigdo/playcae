import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/dashboard", label: "Panel de control" },
  { href: "/dashboard/companies", label: "Empresas" },
  { href: "/access-control", label: "Control de Acceso" },
  { href: "/dashboard/audit", label: "Auditoría" },
  { href: "/dashboard/settings", label: "Configuración" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { hasAccess } = usePermissions();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sticky top-0 h-screen w-64 bg-brandNeutralDark text-brandNeutralLight p-6 flex flex-col">
      <Image
        src="/assets/playcae2.png"
        alt="Logo Play CAE"
        width={150}
        height={40}
        className="mb-8 select-none pt-4"
      />
      <nav className="flex flex-col space-y-3 flex-grow">
        {links.map(({ href, label }) => {
          const active = isActive(href);

          if (!hasAccess(href)) return null;

          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded-md font-medium transition-colors
        ${
          active
            ? "bg-brandPrimary text-white"
            : "hover:bg-brandNeutralLight hover:text-brandNeutralDark text-brandNeutralLight"
        }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
