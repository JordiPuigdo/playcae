// app/(web)/plataforma-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  Clock,
  Brain,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plataforma CAE: Qué es y Cómo Automatiza tu Gestión Documental",
  description:
    "Una plataforma CAE centraliza la documentación de contratas, valida con IA y bloquea accesos si algo caduca. Cumple el RD 171/2004 sin gestión manual. Descubre cómo funciona PlayCAE.",
  keywords: [
    "plataforma cae",
    "software cae",
    "coordinacion de actividades empresariales",
    "coordinacion actividades empresariales",
    "rd 171/2004",
    "gestion documental prl",
    "software coordinacion actividades empresariales",
    "control de accesos contratas",
    "plataforma cae empresas",
    "gestion documental cae",
    "validacion documental cae",
  ],
  alternates: { canonical: "/plataforma-cae" },
  openGraph: {
    type: "article",
    title: "Plataforma CAE: Qué es y Cómo Funciona | PlayCAE",
    description:
      "Descubre qué es una plataforma CAE, cómo funciona y por qué tu empresa necesita una para cumplir con el RD 171/2004.",
    url: "https://www.playcae.com/plataforma-cae",
    images: [
      {
        url: "https://www.playcae.com/og-logo.png",
        alt: "PlayCAE – Plataforma CAE con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title: "Plataforma CAE: Qué es y Cómo Funciona | PlayCAE",
    description:
      "Qué es una plataforma CAE, cómo funciona y por qué la necesita tu empresa.",
    images: ["https://www.playcae.com/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

const howItWorks = [
  {
    step: "1",
    title: "Las contratas suben su documentación",
    description:
      "Empresas y trabajadores externos suben TC1/TC2, seguros de RC, formaciones PRL y reconocimientos médicos a través del portal de contratas.",
  },
  {
    step: "2",
    title: "La IA valida automáticamente",
    description:
      "El motor de inteligencia artificial extrae los datos del documento, verifica fechas de vigencia, importes mínimos y requisitos legales sin intervención humana.",
  },
  {
    step: "3",
    title: "Acceso solo a quién cumple",
    description:
      "Solo los trabajadores con documentación válida y al día reciben autorización de acceso. El sistema bloquea en tiempo real a quien no cumple.",
  },
  {
    step: "4",
    title: "Alertas antes de que caduque",
    description:
      "La plataforma avisa automáticamente a contratas y responsables cuando un documento está próximo a caducar, evitando interrupciones.",
  },
];

const legalObligations = [
  {
    title: "RD 171/2004",
    description:
      "El Real Decreto 171/2004 obliga a las empresas titulares a coordinar la prevención de riesgos cuando concurren trabajadores de distintas empresas en un mismo centro de trabajo.",
  },
  {
    title: "Ley 31/1995 de PRL",
    description:
      "La Ley de Prevención de Riesgos Laborales establece las obligaciones generales del empresario en materia de seguridad y salud.",
  },
  {
    title: "Responsabilidad subsidiaria",
    description:
      "Sin una plataforma CAE, la empresa principal puede ser responsable subsidiaria de las sanciones a sus contratas por incumplimientos de PRL.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Ahorro de tiempo real",
    description:
      "Elimina la revisión manual de documentos. Lo que antes tardaba días, una plataforma CAE con IA lo hace en segundos.",
  },
  {
    icon: Shield,
    title: "Protección legal",
    description:
      "Demuestra diligencia debida ante Inspección de Trabajo. El historial de validaciones es tu evidencia ante cualquier auditoría.",
  },
  {
    icon: AlertTriangle,
    title: "Cero documentación caducada",
    description:
      "Las alertas automáticas garantizan que ningún trabajador entre con documentación vencida, eliminando el riesgo de sanción.",
  },
  {
    icon: Users,
    title: "Contratas más ordenadas",
    description:
      "Las empresas subcontratadas saben exactamente qué documentación necesitan y cuándo renovarla. Menos llamadas, menos caos.",
  },
  {
    icon: Brain,
    title: "IA que aprende",
    description:
      "El sistema reconoce todos los tipos de documentos del mercado español y se actualiza con cambios normativos automáticamente.",
  },
  {
    icon: Zap,
    title: "Implementación en días",
    description:
      "Sin proyectos de meses ni consultorías costosas. Una buena plataforma CAE está operativa en menos de una semana.",
  },
];

const whoNeedsIt = [
  {
    profile: "Empresa principal con contratas",
    description:
      "Tienes trabajadores de otras empresas en tus instalaciones y eres responsable de coordinar su prevención.",
    urgency: "Obligatorio",
  },
  {
    profile: "Empresa contratista",
    description:
      "Trabajas en instalaciones de tus clientes y necesitas gestionar tu documentación PRL para acceder.",
    urgency: "Muy recomendable",
  },
  {
    profile: "Servicio de Prevención Ajeno (SPA)",
    description:
      "Gestionas la prevención de múltiples clientes y necesitas una plataforma centralizada y escalable.",
    urgency: "Muy recomendable",
  },
  {
    profile: "Departamento de RRHH / PRL",
    description:
      "Eres responsable de mantener al día la documentación de contratas y trabajadores externos.",
    urgency: "Necesario",
  },
];

const faqItems = [
  {
    question: "¿Qué es una plataforma CAE y para qué sirve?",
    answer:
      "Una plataforma CAE es un software de Coordinación de Actividades Empresariales que centraliza la gestión documental PRL de contratas y subcontratas. Sirve para validar documentación, controlar accesos y cumplir el RD 171/2004 con trazabilidad.",
  },
  {
    question: "¿Es obligatorio usar una plataforma CAE para cumplir la normativa?",
    answer:
      "No es obligatorio usar una herramienta concreta, pero sí cumplir la Coordinación de Actividades Empresariales del RD 171/2004 y la Ley 31/1995. Un software CAE reduce riesgo legal y facilita demostrar cumplimiento en auditorías e inspecciones.",
  },
  {
    question: "¿Qué documentos revisa un software CAE?",
    answer:
      "Un software CAE suele revisar documentación PRL como TC1/TC2, seguro de responsabilidad civil, formación PRL, reconocimientos médicos, evaluaciones de riesgos, entrega de EPIs y otros requisitos de acceso de trabajadores externos.",
  },
  {
    question: "¿Cuánto tarda la implantación de una plataforma CAE?",
    answer:
      "Depende del proveedor y la complejidad, pero una plataforma CAE moderna puede quedar operativa en pocos días. La clave es automatizar la validación documental y configurar flujos de aprobación desde el inicio.",
  },
  {
    question: "¿Qué diferencia hay entre gestión CAE manual y software CAE?",
    answer:
      "Con gestión manual en Excel y correo hay más errores, menos trazabilidad y mayor riesgo de caducidades. Con software CAE tienes alertas automáticas, repositorio único de documentos y control de accesos en tiempo real.",
  },
  {
    question: "¿Qué empresas necesitan plataforma CAE?",
    answer:
      "Cualquier empresa titular que trabaje con contratas en su centro de trabajo, y también contratistas que acceden a instalaciones de clientes. Es especialmente relevante en industria, construcción, logística, energía y servicios técnicos.",
  },
];

export default function PlataformaCAEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-playGrey">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <span className="mb-4 inline-block rounded-full bg-playBlueDark/10 px-4 py-2 text-sm font-semibold text-playBlueDark">
              Coordinación de Actividades Empresariales
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
              Plataforma CAE
              <span className="block text-playBlueLight">
                Qué es, Cómo Funciona y Por Qué la Necesitas
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-playBlueLight md:text-xl">
              Una <strong>plataforma CAE</strong> digitaliza y automatiza toda la
              gestión de{" "}
              <strong>Coordinación de Actividades Empresariales</strong>:
              documentación PRL de contratas, control de accesos y cumplimiento
              del RD 171/2004 sin esfuerzo manual.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-playOrange px-6 py-3 text-white transition-all hover:bg-playBlueLight"
              >
                Prueba PlayCAE Gratis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/que-es-cae"
                className="inline-flex items-center gap-2 rounded-lg border border-playBlueLight/30 bg-white px-6 py-3 text-playBlueLight transition-all hover:border-playBlueLight/50"
              >
                ¿Qué es la CAE?
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es una Plataforma CAE */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <h2 className="mb-6 text-3xl font-bold text-playBlueDark">
              ¿Qué es una Plataforma CAE?
            </h2>
            <p className="mb-4 text-lg text-playBlueLight">
              Una <strong>plataforma CAE</strong> es un software especializado
              que gestiona de forma digital la{" "}
              <strong>Coordinación de Actividades Empresariales</strong> según el
              RD 171/2004. Su función principal es garantizar que todas las
              empresas y trabajadores externos que acceden a tus instalaciones
              tienen la documentación PRL en regla.
            </p>
            <p className="mb-6 text-lg text-playBlueLight">
              Sin una plataforma CAE, las empresas gestionan esta documentación
              con hojas de cálculo, correos electrónicos y carpetas físicas — un
              sistema propenso a errores, caducidades no detectadas y
              exposición legal.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-playGrey p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-playBlueDark">
                  RD 171/2004
                </div>
                <div className="text-sm text-playBlueLight">
                  Normativa que regula la CAE
                </div>
              </div>
              <div className="rounded-xl bg-playGrey p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-playBlueDark">
                  100% Digital
                </div>
                <div className="text-sm text-playBlueLight">
                  Sin papel ni correos manuales
                </div>
              </div>
              <div className="rounded-xl bg-playGrey p-4 text-center">
                <div className="mb-2 text-2xl font-bold text-playBlueDark">
                  Tiempo Real
                </div>
                <div className="text-sm text-playBlueLight">
                  Validación y accesos al momento
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Cómo Funciona una Plataforma CAE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              El proceso completo, de principio a fin:
            </p>
          </div>

          <div className="relative space-y-6">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-playBlueDark text-xl font-bold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-playBlueDark">
                    {step.title}
                  </h3>
                  <p className="text-playBlueLight">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Beneficios de Usar una Plataforma CAE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Por qué las empresas que implementan una plataforma CAE no vuelven
              a gestionarlo manualmente:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6 transition-all hover:border-playBlueLight/50 hover:shadow-lg"
              >
                <div className="mb-4 rounded-lg bg-playBlueLight/15 p-3 w-fit">
                  <benefit.icon className="h-6 w-6 text-playBlueDark" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-playBlueDark">
                  {benefit.title}
                </h3>
                <p className="text-playBlueLight">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Obligaciones Legales */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Marco Legal de la CAE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Las bases legales que hacen imprescindible una plataforma CAE:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {legalObligations.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border-l-4 border-playBlueDark bg-white p-6 shadow-md"
              >
                <h3 className="mb-3 text-xl font-bold text-playBlueDark">
                  {item.title}
                </h3>
                <p className="text-playBlueLight">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Quién Necesita una Plataforma CAE? */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              ¿Quién Necesita una Plataforma CAE?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Si tu empresa trabaja con contratas o eres empresa contratista,
              necesitas una plataforma CAE:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {whoNeedsIt.map((profile, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-playBlueDark">
                    {profile.profile}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      profile.urgency === "Obligatorio"
                        ? "bg-securityRed/15 text-securityRed"
                        : "bg-playYellow/20 text-playBlueDark"
                    }`}
                  >
                    {profile.urgency}
                  </span>
                </div>
                <p className="text-playBlueLight">{profile.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PlayCAE CTA */}
      <section className="bg-gradient-to-br from-playBlueDark to-playBlueLight px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              PlayCAE: La Plataforma CAE con IA
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-playGrey">
              La única plataforma CAE española con validación documental por IA
              real. Operativa en menos de 1 semana, tarifa plana sin sorpresas.
            </p>

            <div className="mb-12 grid gap-6 md:grid-cols-4">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
                <div className="mb-1 text-3xl font-bold">{"<1"}</div>
                <div className="text-sm text-playGrey">semana de implementación</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
                <div className="mb-1 text-3xl font-bold">100%</div>
                <div className="text-sm text-playGrey">validación automática</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
                <div className="mb-1 text-3xl font-bold">0€</div>
                <div className="text-sm text-playGrey">costes ocultos</div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
                <div className="mb-1 text-3xl font-bold">24/7</div>
                <div className="text-sm text-playGrey">acceso para contratas</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-playBlueDark transition-all hover:bg-playGrey"
              >
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Hablar con un Experto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              FAQs sobre Plataforma CAE y Gestión Documental PRL
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-playBlueLight">
              Respuestas claras a las dudas más habituales sobre software CAE,
              Coordinación de Actividades Empresariales y cumplimiento del RD
              171/2004.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <h3 className="mb-3 text-xl font-semibold text-playBlueDark">
                  {faq.question}
                </h3>
                <p className="text-playBlueLight">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Internal linking */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl border border-playBlueLight/20 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-playBlueDark">
              Más sobre Plataformas CAE y PRL
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/plataformas-cae"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>Comparativa de Plataformas CAE</span>
              </Link>
              <Link
                href="/plataformas-cae-prl"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>Plataformas CAE + PRL</span>
              </Link>
              <Link
                href="/que-es-cae"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>¿Qué es la CAE?</span>
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>FAQs de CAE y PRL</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
