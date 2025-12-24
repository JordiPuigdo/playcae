// app/(web)/servicios/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Servicios | PlayCAE",
  description:
    "Servicios de PlayCAE para gestionar CAE y PRL con IA: validación documental y control de accesos en fábrica. Pensado para pymes manufactureras en España.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    type: "website",
    url: "https://playcae.com/servicios",
    title: "Servicios | PlayCAE",
    description:
      "Validación documental PRL y control de accesos vinculados a CAE. Ahorra tiempo y cumple normativa.",
  },
  robots: { index: true, follow: true },
};

const services = [
  {
    slug: "gestion-documentacion-cae",
    title: "Validación documental PRL y CAE con IA",
    excerpt:
      "Solicita y valida documentación PRL automáticamente. Alertas de caducidad, evidencias y trazabilidad.",
    bullets: [
      "Solicitud y recopilación a contratas",
      "Validación automática con IA",
      "Alertas y evidencias auditoría",
    ],
  },
  {
    slug: "control-accesos-fabrica",
    title: "Control de accesos y registro en fábrica",
    excerpt:
      "Sabe quién está dentro en tiempo real y vincula el acceso al estado documental PRL.",
    bullets: [
      "Registro horario y presencial",
      "Bloqueo por incumplimiento PRL",
      "Informes y auditoría",
    ],
  },
  // Si más adelante añades otro servicio, lo agregas aquí.
];

export default function ServiciosIndexPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://playcae.com/servicios/${s.slug}`,
      name: s.title,
    })),
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://playcae.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
        item: "https://playcae.com/servicios",
      },
    ],
  };

  return (
    <main className="relative overflow-hidden">
      {/* Fondo suave acorde a tu estilo */}
      <div className="absolute inset-0 bg-playGrey" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-4 py-24">
        {/* Cabecera */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-playBlueDark">
            Servicios de PlayCAE
          </h1>
          <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
            Automatiza la CAE y el PRL con Inteligencia Artificial y conecta el
            control de accesos en planta.
          </p>
        </header>

        {/* Grid de servicios */}
        <section className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {services.map((s) => (
            <article
              key={s.slug}
              className="rounded-2xl border border-playBlueLight/20 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-playBlueDark">
                {s.title}
              </h2>
              <p className="mt-3 text-playBlueLight">{s.excerpt}</p>
              <ul className="mt-4 list-disc pl-5 text-playBlueDark/80 space-y-1">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/servicios/${s.slug}`}
                  className="rounded-full bg-playOrange px-6 py-2 font-semibold text-white shadow-md hover:bg-playOrange/90 transition-colors"
                  aria-label={`Ver detalle de ${s.title}`}
                >
                  Ver servicio
                </Link>
                <Link
                  href="/contacto"
                  className="rounded-full border border-playBlueDark px-6 py-2 font-semibold text-playBlueDark hover:bg-playBlueDark/5 transition-colors"
                >
                  Agenda una demo
                </Link>
              </div>
            </article>
          ))}
        </section>

        {/* CTA inferior */}
        <div className="mt-16 text-center">
          <p className="text-playBlueDark">
            ¿No estás seguro de por dónde empezar?
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block rounded-full bg-playOrange px-8 py-3 font-semibold text-white shadow-md hover:bg-playOrange/90 transition-colors"
          >
            Habla con nosotros
          </Link>
        </div>
      </div>

      {/* JSON-LD */}
      <Script
        id="ld-itemlist"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </main>
  );
}
