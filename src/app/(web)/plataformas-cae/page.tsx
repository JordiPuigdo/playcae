// app/(web)/plataformas-cae/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Brain,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  FileCheck,
  FileText,
  Headphones,
  LockKeyhole,
  Scale,
  Shield,
  Sparkles,
  Star,
  Timer,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  PlataformasCaeChecklist,
  PlataformasCaeTableOfContents,
} from "./PlataformasCaeInteractive";

const canonicalUrl = "https://www.playcae.com/plataformas-cae";

export const metadata: Metadata = {
  title: {
    absolute:
      "Plataformas CAE 2026: Guía Completa, Comparativa y Cómo Elegir la Mejor | PlayCAE",
  },
  description:
    "Guía definitiva de plataformas CAE en España 2026. Comparativa de las mejores soluciones, criterios de selección, precios y por qué PlayCAE es la opción más moderna. Incluye checklist gratuito.",
  keywords: [
    "plataformas cae",
    "software cae",
    "plataforma cae empresas",
    "mejor plataforma cae",
    "comparativa plataformas cae",
    "gestión documental cae",
    "control acceso fabricas",
    "coordinación actividades empresariales",
    "RD 171/2004",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "article",
    title:
      "Plataformas CAE 2026: Guía Completa, Comparativa y Cómo Elegir la Mejor | PlayCAE",
    description:
      "Comparativa de plataformas CAE en España, criterios de selección, marco legal, checklist y diferencias clave para elegir software CAE.",
    url: canonicalUrl,
    images: [
      {
        url: "https://www.playcae.com/assets/img/checklist-documentos-cae.webp",
        alt: "Checklist de documentos CAE para elegir plataforma CAE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title:
      "Plataformas CAE 2026: Guía Completa y Comparativa | PlayCAE",
    description:
      "Guía práctica para elegir plataforma CAE: legalidad, comparativa, criterios, errores comunes y checklist gratuito.",
    images: ["https://www.playcae.com/assets/img/checklist-documentos-cae.webp"],
  },
  robots: { index: true, follow: true },
};

type IconCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const selectionCriteria: IconCard[] = [
  {
    icon: FileCheck,
    title: "Gestión documental completa",
    description:
      "Debe cubrir documentos de empresa, trabajador, centro, maquinaria, formación, aptitud médica, seguros y requisitos por actividad.",
  },
  {
    icon: Brain,
    title: "Validación",
    description:
      "La automatización útil extrae datos, detecta caducidades y valida coherencia documental sin convertir a PRL en un cuello de botella.",
  },
  {
    icon: LockKeyhole,
    title: "Control de accesos integrado",
    description:
      "La plataforma CAE debe bloquear accesos cuando falta documentación o un requisito crítico está caducado.",
  },
  {
    icon: Users,
    title: "Facilidad de uso para contratas",
    description:
      "Si las contratas no entienden qué subir, cuándo y por qué se rechaza, el proyecto acaba en llamadas, correos y retrasos.",
  },
  {
    icon: Bell,
    title: "Alertas de caducidad automáticas",
    description:
      "Avisos preventivos antes de vencer documentos clave, con estados claros para empresa principal y contratas.",
  },
  {
    icon: Timer,
    title: "Implementación rápida",
    description:
      "La configuración inicial debería medirse en días, no en meses, especialmente si no hay integraciones complejas.",
  },
  {
    icon: CreditCard,
    title: "Precio transparente",
    description:
      "Evalúa si el coste cambia por trabajador, contrata, documento, centro o módulo, y pide siempre el coste total esperado.",
  },
  {
    icon: Headphones,
    title: "Soporte en español",
    description:
      "La adopción depende mucho del acompañamiento inicial y de resolver dudas operativas de PRL y contratas sin esperas largas.",
  },
];

const comparisonPlatforms = [
  {
    name: "PlayCAE",
    badge: "Mejor valorado 2026",
    ai: "Equipo interno",
    access: "Integrado",
    implementation: "< 1 semana",
    price: "Tarifa plana",
    contractorsFree: "Sí",
    support: "Sí",
    usability: 5,
    highlighted: true,
  },
  {
    name: "Twind/CTAIMA",
    ai: "Según plan",
    access: "Según configuración",
    implementation: "4 semanas",
    price: "Consultar",
    contractorsFree: "Consultar",
    support: "Sí",
    usability: 4,
    highlighted: false,
  },
  {
    name: "Nalanda",
    ai: "Según plan",
    access: "Según configuración",
    implementation: "6 semanas",
    price: "Consultar",
    contractorsFree: "Consultar",
    support: "Sí",
    usability: 4,
    highlighted: false,
  },
  {
    name: "Dokify",
    ai: "Según plan",
    access: "Según configuración",
    implementation: "Proyecto guiado",
    price: "Consultar",
    contractorsFree: "Consultar",
    support: "Sí",
    usability: 4,
    highlighted: false,
  },
  {
    name: "6conecta",
    ai: "Según plan",
    access: "Según configuración",
    implementation: "Consultar",
    price: "Consultar",
    contractorsFree: "Consultar",
    support: "Sí",
    usability: 3,
    highlighted: false,
  },
];

const playCaeDifferences: IconCard[] = [
  {
    icon: Brain,
    title: "Inteligencia artificial",
    description:
      "PlayCAE está pensado para validar documentos en segundos, detectar fechas y reducir la revisión humana repetitiva.",
  },
  {
    icon: Zap,
    title: "Operativa en menos de 1 semana",
    description:
      "La puesta en marcha prioriza configuración clara, invitación de contratas y requisitos documentales listos para trabajar.",
  },
  {
    icon: CreditCard,
    title: "Tarifa plana sin coste por contrata",
    description:
      "Un modelo predecible evita que el coste crezca justo cuando aumentan los centros, contratas o trabajadores externos.",
  },
  {
    icon: Building2,
    title: "100% español con soporte local",
    description:
      "Soporte cercano para responsables de PRL, RRHH, operaciones y gerencia que necesitan respuestas aplicables.",
  },
];

const commonMistakes = [
  "Elegir por precio sin evaluar automatización real.",
  "No considerar la experiencia de las contratas.",
  "Ignorar el tiempo de implementación real.",
  "No verificar el soporte postventa.",
  "Firmar contratos con costes ocultos por número de contratas.",
];

const faqItems: FaqItem[] = [
  {
    question: "¿Qué es una plataforma CAE?",
    answer:
      "Una plataforma CAE es un software para gestionar la Coordinación de Actividades Empresariales: intercambio de información preventiva, solicitud y validación documental de contratas, control de requisitos por trabajador y evidencias de cumplimiento cuando varias empresas coinciden en un centro de trabajo.",
  },
  {
    question: "¿Cuál es la mejor plataforma CAE para pymes?",
    answer:
      "Para una pyme, la mejor plataforma CAE suele ser la que combina implantación rápida, precio predecible, soporte cercano y facilidad para contratas. Si además incorpora validación automática y control de accesos, reduce trabajo administrativo sin crear un proyecto tecnológico complejo.",
  },
  {
    question: "¿Cuánto cuesta una plataforma CAE?",
    answer:
      "El precio depende del proveedor, número de centros, trabajadores, contratas, módulos e integraciones. En comparativas conviene exigir el coste total: licencias, implantación, soporte, control de accesos, migración y posibles cargos por volumen. En competidores, si no hay precio público, lo prudente es indicar Consultar.",
  },
  {
    question: "¿Es obligatorio usar software CAE?",
    answer:
      "La ley no obliga a usar un software concreto. Lo obligatorio es cumplir la Coordinación de Actividades Empresariales según la Ley 31/1995 y el RD 171/2004. En empresas con varias contratas, hacerlo con correo, hojas de cálculo y carpetas suele aumentar el riesgo de errores y falta de trazabilidad.",
  },
  {
    question: "¿Qué documentos gestiona una plataforma CAE?",
    answer:
      "Puede gestionar certificados de aptitud médica, formación PRL, entrega de EPIs, TC1/TC2 o documentos equivalentes, seguros de responsabilidad civil, evaluaciones de riesgos, planes preventivos, autorizaciones de maquinaria, permisos de trabajo y documentación específica por actividad o centro.",
  },
  {
    question: "¿Cuánto tarda la implementación?",
    answer:
      "Depende de la complejidad. Una implantación sencilla puede estar operativa en días si los requisitos documentales están claros. Los proyectos con muchos centros, integraciones de control de acceso o migración histórica pueden requerir más planificación.",
  },
  {
    question: "¿Qué diferencia hay entre Twind, Nalanda y PlayCAE?",
    answer:
      "Twind, Nalanda y otras plataformas consolidadas cubren necesidades CAE con distintos enfoques, planes e implantaciones. PlayCAE se diferencia por priorizar IA documental, tarifa plana, puesta en marcha rápida y soporte local, especialmente para empresas que quieren reducir revisión manual.",
  },
  {
    question: "¿Pueden las contratas acceder gratis?",
    answer:
      "En PlayCAE, el modelo busca que las contratas puedan subir documentación sin convertirse en un coste variable para la empresa principal. En otras plataformas, esta condición depende del contrato y debe verificarse antes de comparar precios.",
  },
  {
    question: "¿Una plataforma CAE sirve para control acceso fabricas?",
    answer:
      "Sí, si integra la validación documental con el sistema de accesos. El objetivo es que un trabajador con documentación caducada o requisitos incompletos no pueda entrar en zonas donde no debería estar autorizado.",
  },
];

const sanctions = [
  {
    type: "Leves",
    amount: "45€ - 2.450€",
    detail:
      "Incumplimientos formales o de menor entidad en prevención de riesgos laborales.",
  },
  {
    type: "Graves",
    amount: "2.451€ - 49.180€",
    detail:
      "Deficiencias preventivas relevantes, falta de coordinación efectiva o ausencia de controles exigibles.",
  },
  {
    type: "Muy graves",
    amount: "49.181€ - 983.736€",
    detail:
      "Situaciones con riesgo grave, incumplimientos severos o exposición de trabajadores a daños relevantes.",
  },
];

const sourceLinks = [
  {
    label: "RD 171/2004 sobre coordinación de actividades empresariales",
    href: "https://www.boe.es/eli/es/rd/2004/01/30/171",
  },
  {
    label: "Ley 31/1995 de Prevención de Riesgos Laborales",
    href: "https://www.boe.es/buscar/act.php?id=BOE-A-1995-24292",
  },
  {
    label: "LISOS: cuantía de sanciones en prevención",
    href: "https://www.boe.es/buscar/act.php?id=BOE-A-2000-15060",
  },
  {
    label: "INSST: Coordinación de Actividades Empresariales",
    href: "https://www.insst.es/materias/transversales/gestion-prevencion/cae",
  },
];

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://www.playcae.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Plataformas CAE",
      item: canonicalUrl,
    },
  ],
};

const faqLd = {
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
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlayCAE",
  url: "https://www.playcae.com",
  logo: "https://www.playcae.com/assets/playcae.png",
  description:
    "Plataforma CAE con IA para gestión documental de contratas y control de accesos.",
  areaServed: {
    "@type": "Country",
    name: "España",
  },
};

const renderStars = (value: number) => {
  return (
    <span aria-label={`${value} de 5 estrellas`} className="text-playOrange">
      {"★".repeat(value)}
      <span className="text-playBlueLight/30">{"★".repeat(5 - value)}</span>
    </span>
  );
};

function SectionHeading({
  eyebrow,
  id,
  title,
  description,
}: {
  eyebrow?: string;
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-playOrange">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="scroll-mt-28 text-3xl font-bold text-playBlueDark">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-8 text-playBlueLight">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FeatureCard({ item }: { item: IconCard }) {
  return (
    <article className="rounded-lg border border-playBlueLight/20 bg-white p-6 shadow-sm transition-all hover:border-playOrange/40 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-playBlueDark/10">
        <item.icon className="h-6 w-6 text-playBlueDark" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-playBlueDark">
        {item.title}
      </h3>
      <p className="leading-7 text-playBlueLight">{item.description}</p>
    </article>
  );
}

function StatusCell({ value }: { value: string }) {
  const positive = ["Sí", "Integrado", "Tarifa plana", "< 1 semana"].some(
    (text) => value.startsWith(text)
  );

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
        positive
          ? "bg-playGreen/10 text-playGreen"
          : "bg-playGrey text-playBlueLight"
      }`}
    >
      {value}
    </span>
  );
}

export default function PlataformasCaePage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-playGrey">
        <div className="absolute inset-0 bg-gradient-to-br from-playBlueDark/10 via-white/30 to-playOrange/10" />
        <div className="container relative mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-playBlueDark shadow-sm">
              <Sparkles className="h-4 w-4 text-playOrange" />
              Guía actualizada 2026
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
              Plataformas CAE en España 2026: Guía Completa y Comparativa
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-playBlueLight md:text-xl">
              Elegir una <strong>plataforma CAE</strong> ya no va solo de subir
              PDFs. El mejor <strong>software CAE</strong> combina gestión
              documental CAE, validación automática, trazabilidad legal y control
              de accesos para fábricas, obras, centros logísticos e instalaciones
              con contratas.
            </p>
            <div className="mt-6 rounded-lg border border-playOrange/20 bg-white p-5 text-playBlueDark shadow-sm">
              <p className="flex gap-3 leading-7">
                <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-playOrange" />
                <span>
                  El INSST recuerda que la concurrencia de empresas exige
                  controlar los riesgos de cada actividad y los generados por su
                  interacción. La CAE debe evitar el mero cumplimiento formal y
                  servir para prevenir accidentes reales.
                </span>
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-playOrange px-6 py-3 font-semibold text-white transition-colors hover:bg-playBlueDark"
              >
                Prueba PlayCAE Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#comparativa-plataformas-cae"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-playBlueLight/30 bg-white px-6 py-3 font-semibold text-playBlueDark transition-colors hover:border-playOrange hover:text-playOrange"
              >
                Ver comparativa
              </a>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-white bg-white shadow-lg">
            <Image
              src="/assets/img/checklist-documentos-cae.webp"
              alt="Checklist de gestión documental CAE para comparar plataformas CAE"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[280px_1fr] lg:py-16">
        <PlataformasCaeTableOfContents />

        <div className="space-y-20">
          <section id="que-es-plataforma-cae" className="scroll-mt-28">
            <SectionHeading
              id="que-es-una-plataforma-cae"
              eyebrow="Concepto básico"
              title="¿Qué es una plataforma CAE?"
              description="Una plataforma CAE es una herramienta digital para gestionar las obligaciones de Coordinación de Actividades Empresariales cuando varias empresas o trabajadores autónomos coinciden en un mismo centro de trabajo."
            />
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5 text-lg leading-8 text-playBlueLight">
                <p>
                  El RD 171/2004 desarrolla el artículo 24 de la Ley 31/1995 y
                  regula cómo deben cooperar, informarse y coordinarse las
                  empresas concurrentes. En la práctica, una{" "}
                  <strong>plataforma cae empresas</strong> centraliza requisitos,
                  documentos, estados, avisos y evidencias para demostrar que esa
                  coordinación existe.
                </p>
                <p>
                  Sirve para solicitar documentación a contratas, validar
                  requisitos por trabajador o empresa, controlar vencimientos,
                  preparar inspecciones y conectar el estado documental con el
                  acceso físico al centro cuando existe integración.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-securityRed/20 bg-securityRed/5 p-5">
                    <h3 className="mb-3 font-semibold text-securityRed">
                      Gestión manual
                    </h3>
                    <ul className="space-y-2 text-base">
                      <li className="flex gap-2">
                        <X className="mt-1 h-4 w-4 flex-shrink-0" />
                        Correos, Excel y carpetas dispersas.
                      </li>
                      <li className="flex gap-2">
                        <X className="mt-1 h-4 w-4 flex-shrink-0" />
                        Caducidades revisadas tarde.
                      </li>
                      <li className="flex gap-2">
                        <X className="mt-1 h-4 w-4 flex-shrink-0" />
                        Difícil trazabilidad ante inspección.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-playGreen/20 bg-playGreen/5 p-5">
                    <h3 className="mb-3 font-semibold text-playGreen">
                      Plataforma CAE
                    </h3>
                    <ul className="space-y-2 text-base">
                      <li className="flex gap-2">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                        Estados y evidencias centralizados.
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                        Alertas y validaciones automáticas.
                      </li>
                      <li className="flex gap-2">
                        <Check className="mt-1 h-4 w-4 flex-shrink-0" />
                        Accesos vinculados a cumplimiento.
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="rounded-lg bg-playGrey p-5 text-base">
                  Nota sobre estadísticas: en esta guía no usamos como oficiales
                  cifras comerciales no verificadas. Las referencias legales y
                  preventivas se apoyan en BOE e INSST.
                </p>
              </div>
              <div className="relative min-h-72 overflow-hidden rounded-lg border border-playBlueLight/20">
                <Image
                  src="/assets/img/trabajadores-obra-epis.webp"
                  alt="Trabajadores con EPIs en entorno de concurrencia empresarial CAE"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 320px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section className="scroll-mt-28">
            <SectionHeading
              id="marco-legal-obligatorio"
              eyebrow="Normativa"
              title="Marco legal obligatorio"
              description="El software no sustituye al criterio preventivo, pero ayuda a demostrar diligencia: quién pidió cada documento, cuándo se validó, qué venció y qué trabajador estaba autorizado."
            />
            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                item={{
                  icon: Scale,
                  title: "Ley 31/1995",
                  description:
                    "Establece el marco general de prevención de riesgos laborales y el deber de protección empresarial.",
                }}
              />
              <FeatureCard
                item={{
                  icon: Shield,
                  title: "RD 171/2004",
                  description:
                    "Desarrolla la coordinación cuando concurren empresas en un mismo centro de trabajo.",
                }}
              />
              <FeatureCard
                item={{
                  icon: FileText,
                  title: "LISOS",
                  description:
                    "Tipifica infracciones y cuantías sancionadoras aplicables en prevención de riesgos laborales.",
                }}
              />
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr] lg:items-center">
              <div className="relative min-h-64 overflow-hidden rounded-lg border border-playBlueLight/20">
                <Image
                  src="/assets/img/inspeccion-trabajo-cae.webp"
                  alt="Inspección de trabajo revisando documentación CAE y PRL"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 360px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="rounded-lg bg-playGrey p-6">
                <h3 className="mb-3 text-xl font-semibold text-playBlueDark">
                  Evidencias listas para inspección
                </h3>
                <p className="leading-7 text-playBlueLight">
                  Una plataforma CAE debe permitir reconstruir qué documentación
                  se solicitó, quién la aportó, cuándo se validó y qué medidas de
                  coordinación estaban activas. Esa trazabilidad es la diferencia
                  entre una gestión documental cae ordenada y una carpeta difícil
                  de defender.
                </p>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-playBlueLight/20 bg-white">
              <div className="bg-playBlueDark px-5 py-4 text-white">
                <h3 className="text-xl font-semibold">
                  Tabla de sanciones PRL según LISOS
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead className="bg-playGrey text-sm uppercase tracking-wide text-playBlueDark">
                    <tr>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Importe</th>
                      <th className="px-5 py-4">Contexto habitual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-playBlueLight/10">
                    {sanctions.map((sanction) => (
                      <tr key={sanction.type}>
                        <td className="px-5 py-4 font-semibold text-playBlueDark">
                          {sanction.type}
                        </td>
                        <td className="px-5 py-4 text-playOrange">
                          {sanction.amount}
                        </td>
                        <td className="px-5 py-4 text-playBlueLight">
                          {sanction.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-6 rounded-lg bg-playGrey p-5 leading-7 text-playBlueLight">
              Responsabilidad subsidiaria, vigilancia del cumplimiento y
              coordinación efectiva deben analizarse caso por caso. Una
              plataforma CAE no elimina la responsabilidad preventiva, pero sí
              reduce el riesgo operativo de no poder acreditar controles,
              comunicaciones y documentación exigida.
            </p>
          </section>

          <section id="criterios-elegir-plataforma-cae" className="scroll-mt-28">
            <SectionHeading
              id="criterios-para-elegir-una-plataforma-cae"
              eyebrow="Framework de decisión"
              title="Criterios para elegir una plataforma CAE"
              description="Antes de comparar demos, compara criterios. La mejor plataforma CAE no es la que tiene más pantallas, sino la que reduce riesgo, llamadas y trabajo manual."
            />
            <div className="grid gap-5 md:grid-cols-2">
              {selectionCriteria.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
          </section>

          <section id="comparativa-plataformas-cae" className="scroll-mt-28">
            <SectionHeading
              id="comparativa-de-las-mejores-plataformas-cae-2026"
              eyebrow="Comparativa plataformas CAE"
              title="Comparativa de las mejores plataformas CAE 2026"
              description="Comparativa honesta basada en criterios de compra habituales. Las funcionalidades concretas pueden variar por plan, contrato, implantación o configuración."
            />
            <div className="overflow-hidden rounded-lg border border-playBlueLight/20 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="bg-playBlueDark text-sm uppercase tracking-wide text-white">
                    <tr>
                      <th className="px-4 py-4">Plataforma</th>
                      <th className="px-4 py-4">Validación</th>
                      <th className="px-4 py-4">Control accesos</th>
                      <th className="px-4 py-4">Implementación</th>
                      <th className="px-4 py-4">Precio desde</th>
                      <th className="px-4 py-4">Gratuito contratas</th>
                      <th className="px-4 py-4">Soporte español</th>
                      <th className="px-4 py-4">Facilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-playBlueLight/10">
                    {comparisonPlatforms.map((platform) => (
                      <tr
                        key={platform.name}
                        className={
                          platform.highlighted
                            ? "bg-playOrange/5"
                            : "bg-white"
                        }
                      >
                        <td className="px-4 py-5">
                          <div className="font-semibold text-playBlueDark">
                            {platform.name}
                          </div>
                          {platform.badge ? (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-playOrange px-3 py-1 text-xs font-semibold text-white">
                              <Star className="h-3 w-3" />
                              {platform.badge}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.ai} />
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.access} />
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.implementation} />
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.price} />
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.contractorsFree} />
                        </td>
                        <td className="px-4 py-5">
                          <StatusCell value={platform.support} />
                        </td>
                        <td className="px-4 py-5">
                          {renderStars(platform.usability)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-playBlueLight">
              No inventamos precios de competidores: cuando no hay tarifa pública
              clara, la tabla indica Consultar. Revisa siempre contrato, alcance,
              implantación e integraciones antes de decidir.
            </p>
          </section>

          <section className="scroll-mt-28">
            <SectionHeading
              id="por-que-playcae-es-diferente"
              eyebrow="PlayCAE"
              title="Por qué PlayCAE es diferente"
              description="PlayCAE está diseñado para responsables de PRL, RRHH, gerentes y operaciones que necesitan controlar contratas sin multiplicar el trabajo administrativo."
            />
            <div className="grid gap-5 md:grid-cols-2">
              {playCaeDifferences.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
          </section>

          <section id="errores-comunes-plataforma-cae" className="scroll-mt-28">
            <SectionHeading
              id="errores-comunes-al-elegir-plataforma-cae"
              eyebrow="Riesgos de compra"
              title="Errores comunes al elegir plataforma CAE"
              description="Los errores más caros no suelen verse en la demo. Aparecen cuando llegan las primeras caducidades, las primeras contratas bloqueadas o la primera inspección."
            />
            <div className="space-y-4">
              {commonMistakes.map((mistake, index) => (
                <article
                  key={mistake}
                  className="flex gap-4 rounded-lg border border-playBlueLight/20 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-playOrange/10 font-semibold text-playOrange">
                    {index + 1}
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-playOrange" />
                    <p className="text-lg font-medium text-playBlueDark">
                      {mistake}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <PlataformasCaeChecklist />

          <section id="preguntas-frecuentes" className="scroll-mt-28">
            <SectionHeading
              id="preguntas-frecuentes-ampliadas"
              eyebrow="FAQ"
              title="Preguntas frecuentes ampliadas"
              description="Respuestas rápidas para comparar plataformas cae, entender obligaciones y preparar una compra con menos incertidumbre."
            />
            <div className="grid gap-5">
              {faqItems.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-lg border border-playBlueLight/20 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-3 text-xl font-semibold text-playBlueDark">
                    {faq.question}
                  </h3>
                  <p className="leading-7 text-playBlueLight">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg bg-gradient-to-br from-playBlueDark to-playBlueLight p-8 text-white md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  Sin tarjeta de crédito
                </p>
                <h2
                  id="prueba-playcae-gratis"
                  className="scroll-mt-28 text-3xl font-bold"
                >
                  Prueba PlayCAE 14 días gratis — Sin tarjeta de crédito
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-playGrey">
                  Comprueba si la validación con IA, el portal de contratas y el
                  control de accesos encajan con tu operativa antes de comprometer
                  presupuesto.
                </p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-playBlueDark transition-colors hover:bg-playGrey"
              >
                Prueba PlayCAE Gratis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>

          <section className="rounded-lg border border-playBlueLight/20 bg-playGrey p-6">
            <h2
              id="fuentes-consultadas"
              className="mb-4 scroll-mt-28 text-2xl font-bold text-playBlueDark"
            >
              Fuentes consultadas
            </h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {sourceLinks.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-lg bg-white p-4 text-playBlueLight transition-colors hover:text-playOrange"
                  >
                    <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span>{source.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white">
            <div className="rounded-lg border border-playBlueLight/20 bg-white p-8 shadow-sm">
              <h2
                id="enlaces-internos-cae-prl"
                className="mb-6 scroll-mt-28 text-2xl font-bold text-playBlueDark"
              >
                Más recursos sobre CAE y PRL
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { href: "/plataforma-cae", label: "¿Qué es una Plataforma CAE?" },
                  { href: "/plataformas-cae-prl", label: "Plataformas CAE + PRL" },
                  { href: "/que-es-cae", label: "¿Qué es la CAE?" },
                  { href: "/preguntas-frecuentes", label: "FAQs CAE y PRL" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
                  >
                    <ChevronRight className="h-5 w-5 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <Script
        id="plataformas-cae-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Script
        id="plataformas-cae-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id="plataformas-cae-organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
    </main>
  );
}
