import { ReactNode } from "react";

// Layout mínimo para páginas de kiosko/tablet (sin header, footer, sidebar)
export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function KioskLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
