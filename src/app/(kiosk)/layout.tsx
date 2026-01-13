import { ReactNode } from "react";

// Layout mínimo para páginas de kiosko/tablet (sin header, footer, sidebar)
export default function KioskLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
