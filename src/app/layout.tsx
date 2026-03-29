import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../styles/global.css";
import { Toaster } from "@/components/ui/Toaster";
import Script from "next/script";
import ConsentAwareGoogleAnalytics from "@/components/ConsentAwareGoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.playcae.com"),
  title: {
    default: "Gestión de Documentación CAE con IA | PlayCAE",
    template: "%s | PlayCAE",
  },
  description:
    "Automatiza la validación documental PRL con IA. Control de accesos y registro presencial en fábrica. Cumple la Ley de PRL. Agenda una demo o crea tu cuenta gratis.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.playcae.com",
    title: "Gestión de Documentación CAE con IA | PlayCAE",
    description:
      "Validación automática PRL, control de accesos y registro en planta para pymes manufactureras.",
    siteName: "PlayCAE",
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title: "Gestión de Documentación CAE con IA | PlayCAE",
    description:
      "Automatiza PRL y CAE. Registro y control de accesos en fábrica.",
  },
  icons: { icon: "/favicon.ico" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlayCAE",
  url: "https://www.playcae.com",
  logo: "https://www.playcae.com/assets/playcae.png",
  description:
    "Plataforma CAE con IA para gestion documental de contratas y subcontratas. Cumplimiento RD 171/2004.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+34-628-735-826",
    contactType: "customer service",
    availableLanguage: "Spanish",
    areaServed: "ES",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
    addressLocality: "Barcelona",
  },
  sameAs: [],
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
        <Script id="ld-organization" type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </Script>
        {children}
        <ConsentAwareGoogleAnalytics />
        <Toaster />
      </body>
    </html>
  );
}


