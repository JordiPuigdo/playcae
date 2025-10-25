import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../styles/global.css";
import { Toaster } from "@/components/ui/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://playcae.com"),
  title: {
    default: "Gestión de Documentación CAE con IA | PlayCAE",
    template: "%s | PlayCAE",
  },
  description:
    "Automatiza la validación documental PRL con IA. Control de accesos y registro presencial en fábrica. Cumple la Ley de PRL. Agenda una demo o crea tu cuenta gratis.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://playcae.com",
    title: "Gestión de Documentación CAE con IA | PlayCAE",
    description:
      "Validación automática PRL, control de accesos y registro en planta para pymes manufactureras.",
    siteName: "PlayCAE",
    images: ["/og-image.jpg"], // añade tu imagen 1200x630
  },
  twitter: {
    card: "summary_large_image",
    title: "Gestión de Documentación CAE con IA | PlayCAE",
    description:
      "Automatiza PRL y CAE. Registro y control de accesos en fábrica.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${geistSans.className} ${geistMono.className}`}>
      <meta
        name="google-site-verification"
        content="SnZ03ugbapbdmUzwIwTZVQEnkdSpDKx44Uqse-C7sVA"
      />
      <body suppressHydrationWarning className="min-h-screen bg-gray-100">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
