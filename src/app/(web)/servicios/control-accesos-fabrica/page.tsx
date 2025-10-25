import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda una Demo",
  description:
    "Descubre cómo automatizar la CAE y el PRL con IA. Agenda una demo o crea tu cuenta gratis.",
  alternates: { canonical: "/contacto" },
};

export default function ContactoPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Agenda una demo</h1>
      <p className="mt-4 text-muted-foreground">
        Cuéntanos tu caso y te mostraremos cómo PlayCAE puede ayudarte.
      </p>
      {/* Formulario / Calendly / WhatsApp… */}
    </main>
  );
}
