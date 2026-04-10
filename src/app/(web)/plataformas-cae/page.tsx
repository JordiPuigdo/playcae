// app/(web)/plataformas-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  Shield,
  Zap,
  Users,
  FileCheck,
  Clock,
  Building2,
  Brain,
  ChevronRight,
  AlertTriangle,
  Star,
  Layers,
  GitBranch,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plataformas CAE 2026: Guía Completa, Comparativa y Cómo Elegir",
  description:
    "Guía definitiva sobre plataformas CAE: qué son, cómo funcionan, tipos, comparativa real y cómo elegir la mejor para tu empresa. Incluye alternativas a las soluciones más conocidas del mercado español.",
  keywords: [
    "plataformas cae",
    "plataforma cae",
    "software cae",
    "comparativa plataformas cae",
    "alternativa dokify",
    "coordinacion actividades empresariales software",
    "mejor plataforma cae",
    "software coordinacion actividades empresariales",
    "plataforma cae precio",
    "plataforma cae sin coste por trabajador",
    "gestion documental prl",
    "rd 171 2004 software",
  ],
  alternates: { canonical: "/plataformas-cae" },
  openGraph: {
    type: "article",
    title: "Plataformas CAE 2026: Guía Completa y Comparativa | PlayCAE",
    description:
      "Qué son, cómo funcionan, tipos y cómo elegir la mejor plataforma CAE para tu empresa. Comparativa real del mercado español.",
    url: "https://www.playcae.com/plataformas-cae",
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
    title: "Plataformas CAE 2026: Guía Completa y Comparativa | PlayCAE",
    description:
      "Guía definitiva: qué son las plataformas CAE, tipos, comparativa y cómo elegir la correcta para tu empresa.",
    images: ["https://www.playcae.com/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

// ─── Datos ────────────────────────────────────────────────────────────────────

const tiposPlataforma = [
  {
    icon: Layers,
    tipo: "Repositorio documental básico",
    descripcion:
      "El nivel más sencillo. La empresa sube documentos en una carpeta compartida o portal web. No hay validación automática: alguien del equipo revisa cada documento manualmente y da el visto bueno.",
    ventajas: ["Bajo coste inicial", "Fácil de entender"],
    limitaciones: [
      "Requiere revisión manual de cada documento",
      "Sin alertas automáticas de caducidad",
      "Sin control de accesos integrado",
      "Escala mal con volumen de contratas",
    ],
    paraQuien: "Empresas pequeñas con 2-5 contratas y poco movimiento documental.",
  },
  {
    icon: GitBranch,
    tipo: "Plataforma CAE con workflows",
    descripcion:
      "Incorpora flujos de aprobación configurables: cuando una contrata sube un documento, el sistema lo enruta al responsable correcto. Hay notificaciones, estados y trazabilidad, pero la validación sigue siendo humana.",
    ventajas: [
      "Trazabilidad y auditoría clara",
      "Flujos personalizables por tipo de empresa",
      "Alertas de caducidad automatizadas",
    ],
    limitaciones: [
      "La validación final la hace una persona",
      "Cuellos de botella en picos de trabajo",
      "Crecimiento del equipo necesario al escalar",
    ],
    paraQuien: "Empresas medianas con 20-100 contratas que tienen técnico de PRL dedicado.",
  },
  {
    icon: Brain,
    tipo: "Plataforma CAE con IA",
    descripcion:
      "El nivel más avanzado. La inteligencia artificial extrae datos del documento (fechas, importes, CIF, coberturas), los valida contra los requisitos configurados y emite una decisión automática en segundos. Sin intervención humana para el 80-95% de los documentos.",
    ventajas: [
      "Validación en segundos, no en días",
      "Sin errores humanos ni descuidos",
      "Escala sin aumentar equipo",
      "Control de accesos en tiempo real",
      "Alertas preventivas automáticas",
    ],
    limitaciones: [
      "Mayor coste mensual vs repositorios básicos",
      "Requiere configuración inicial de requisitos",
    ],
    paraQuien: "Empresas con más de 50 contratas, industria, logística, construcción o energía.",
  },
];

const funcionalidades = [
  {
    icon: FileCheck,
    titulo: "Validación documental automática",
    descripcion:
      "TC1/TC2, seguros de RC, formaciones PRL, reconocimientos médicos, evaluaciones de riesgo. Una plataforma CAE real valida fechas de vigencia, importes mínimos y datos del asegurado sin que nadie lo lea.",
    esencial: true,
  },
  {
    icon: Users,
    titulo: "Gestión de contratas y subcontratas",
    descripcion:
      "Estructura jerárquica de empresas: principal → contratista → subcontratista. Con acceso diferenciado por rol y visibilidad sobre qué empresas tienen documentación en regla.",
    esencial: true,
  },
  {
    icon: Clock,
    titulo: "Alertas de caducidad preventivas",
    descripcion:
      "La plataforma avisa con 30, 15 y 7 días de antelación antes de que un documento caduque. La contrata recibe el aviso y puede renovar antes de quedarse sin acceso.",
    esencial: true,
  },
  {
    icon: Shield,
    titulo: "Control de accesos en tiempo real",
    descripcion:
      "Solo los trabajadores con documentación válida y al día reciben autorización. El sistema bloquea automáticamente a quien tiene algo caducado, sin depender de un vigilante revisando manualmente.",
    esencial: false,
  },
  {
    icon: Zap,
    titulo: "Portal de contratas autoservicio",
    descripcion:
      "Las empresas subcontratadas suben su documentación directamente sin llamar a nadie. Ven en tiempo real qué tienen aprobado, qué falta y qué va a caducar.",
    esencial: true,
  },
  {
    icon: Building2,
    titulo: "Multi-centro y multi-empresa",
    descripcion:
      "Para grupos empresariales con varias instalaciones: gestión unificada con requisitos diferenciados por centro de trabajo, tipo de trabajo o zona de riesgo.",
    esencial: false,
  },
];

const criteriosEleccion = [
  {
    numero: "01",
    criterio: "¿Valida automáticamente o solo almacena?",
    explicacion:
      "La diferencia más importante. Un repositorio documental no es una plataforma CAE. Si el sistema solo guarda PDFs y alguien los tiene que revisar a mano, el cuello de botella sigue existiendo. Pregunta directamente: '¿Quién valida el documento?' Si la respuesta incluye a una persona de tu equipo, no es automatización real.",
  },
  {
    numero: "02",
    criterio: "¿Cuánto tarda la implementación?",
    explicacion:
      "Plataformas heredadas de los años 2000-2010 requieren proyectos de 3 a 6 meses con consultorías externas. Las soluciones modernas están operativas en menos de una semana. Si el proveedor no puede darte un plazo concreto en días, es una señal de alerta.",
  },
  {
    numero: "03",
    criterio: "¿El precio escala con trabajadores o con contratas?",
    explicacion:
      "El modelo de precios más habitual en el mercado cobra por trabajador registrado. Con 500 trabajadores externos, el coste mensual puede dispararse sin que el servicio mejore. Evalúa plataformas con tarifa plana independiente del volumen, especialmente si tu plantilla de contratas fluctúa.",
  },
  {
    numero: "04",
    criterio: "¿Qué pasa cuando hay un cambio normativo?",
    explicacion:
      "El RD 171/2004 y la normativa de PRL evolucionan. Algunos proveedores actualizan sus sistemas automáticamente; otros requieren una nueva consultoría. Pregunta específicamente quién actualiza las plantillas de validación cuando cambia la ley y en qué plazo.",
  },
  {
    numero: "05",
    criterio: "¿Cómo es el soporte real?",
    explicacion:
      "Durante los primeros meses de uso tu equipo tendrá dudas, tus contratas también. Verifica si el soporte es por ticket (respuesta en días) o por canal directo (respuesta en horas). Un soporte lento durante la adopción inicial puede hundir el proyecto.",
  },
];

const comparativaRows = [
  {
    criterio: "Validación automática con IA",
    tradicional: false,
    playcae: true,
    nota: "",
  },
  {
    criterio: "Precio por trabajador",
    tradicional: true,
    playcae: false,
    nota: "PlayCAE: tarifa plana",
  },
  {
    criterio: "Implementación < 1 semana",
    tradicional: false,
    playcae: true,
    nota: "",
  },
  {
    criterio: "Portal de contratas incluido",
    tradicional: true,
    playcae: true,
    nota: "",
  },
  {
    criterio: "Alertas automáticas de caducidad",
    tradicional: true,
    playcae: true,
    nota: "",
  },
  {
    criterio: "Control de accesos en tiempo real",
    tradicional: false,
    playcae: true,
    nota: "Opcional en muchas soluciones",
  },
  {
    criterio: "Actualizaciones normativas automáticas",
    tradicional: false,
    playcae: true,
    nota: "",
  },
  {
    criterio: "Onboarding sin consultoría",
    tradicional: false,
    playcae: true,
    nota: "",
  },
];

const sectores = [
  {
    nombre: "Construcción e infraestructuras",
    retos:
      "Alto volumen de subcontratas, alta rotación de trabajadores, trabajos en altura y espacios confinados, documentación específica por tipo de obra.",
    clave:
      "Control de accesos por zona y validación de formaciones específicas (trabajos en altura, espacios confinados, eléctricos).",
  },
  {
    nombre: "Industria y fabricación",
    retos:
      "Contratas de mantenimiento recurrentes, zonas ATEX, riesgos específicos por proceso productivo y necesidad de permisos de trabajo.",
    clave:
      "Requisitos configurables por zona industrial y gestión de permisos de trabajo integrada.",
  },
  {
    nombre: "Logística y distribución",
    retos:
      "Alta rotación de transportistas externos, múltiples puntos de acceso simultáneos y operativa 24/7.",
    clave:
      "Validación express automatizada y control de accesos en tiempo real sin intervención humana en cada turno.",
  },
  {
    nombre: "Energía y utilities",
    retos:
      "Normativas estrictas, trabajos eléctricos de alta tensión, riesgos medioambientales y contratas altamente especializadas.",
    clave:
      "Gestión de certificaciones específicas, formaciones reglamentadas y trazabilidad completa para auditorías sectoriales.",
  },
];

const faqItems = [
  {
    question: "¿Qué es una plataforma CAE y para qué sirve exactamente?",
    answer:
      "Una plataforma CAE (Coordinación de Actividades Empresariales) es un software que digitaliza y automatiza la gestión de la documentación PRL que las empresas están obligadas a intercambiar cuando trabajan juntas en un mismo centro de trabajo (RD 171/2004). Sirve para validar que contratas y trabajadores externos tienen al día documentos como TC1/TC2, seguro de RC, formaciones de seguridad y reconocimientos médicos, y para controlar quién puede acceder a tus instalaciones.",
  },
  {
    question: "¿Cuánto cuesta una plataforma CAE?",
    answer:
      "Los precios varían mucho según el modelo de negocio. Las plataformas tradicionales suelen cobrar por trabajador registrado (entre 1 y 5€ por trabajador/mes), lo que dispara el coste en empresas con muchas contratas. Las plataformas modernas como PlayCAE ofrecen tarifa plana desde 199€/mes independientemente del número de trabajadores. El coste total de propiedad (incluyendo horas de tu equipo validando manualmente) suele ser mayor en soluciones aparentemente baratas.",
  },
  {
    question: "¿Cuánto tiempo tarda en implementarse una plataforma CAE?",
    answer:
      "Depende del proveedor. Las soluciones heredadas del mercado suelen requerir proyectos de implementación de 3 a 6 meses con consultorías incluidas. Las plataformas modernas con configuración guiada están operativas en menos de una semana: configuras tus requisitos documentales, invitas a tus contratas y empiezas a recibir documentación el mismo día.",
  },
  {
    question: "¿Qué diferencia hay entre Dokify y otras plataformas CAE del mercado?",
    answer:
      "Dokify es una de las plataformas CAE más conocidas en España, con una base de usuarios consolidada. Las diferencias principales entre plataformas suelen estar en el modelo de precios (por trabajador vs tarifa plana), el grado de automatización real (IA vs revisión manual) y el tiempo de implementación. Si buscas alternativas, los criterios clave son: ¿quién valida realmente el documento?, ¿qué modelo de precios tiene cuando tu volumen de contratas crece?, y ¿en cuánto tiempo puedes estar operativo?",
  },
  {
    question: "¿Es obligatorio usar una plataforma CAE para cumplir el RD 171/2004?",
    answer:
      "No existe obligación legal de usar un software específico, pero sí de cumplir las obligaciones de Coordinación de Actividades Empresariales. La realidad es que con más de 10-15 contratas activas, cumplir estas obligaciones de forma manual (correo, Excel, carpetas) resulta inviable sin errores. Una plataforma CAE no es un lujo: es la forma práctica de demostrar diligencia debida ante Inspección de Trabajo.",
  },
  {
    question: "¿Puedo usar una plataforma CAE sin pagar por cada trabajador?",
    answer:
      "Sí. El modelo de pago por trabajador es el más extendido en el mercado heredado, pero no es el único. Algunas plataformas modernas ofrecen tarifa plana mensual sin restricciones de volumen. Este modelo es especialmente ventajoso si trabajas con sectores de alta rotación (logística, construcción temporal) donde el número de trabajadores externos fluctúa mucho entre meses.",
  },
  {
    question: "¿Qué documentos debe gestionar una plataforma CAE?",
    answer:
      "Los documentos habituales son: TC1/TC2 (cotizaciones a la Seguridad Social), seguro de responsabilidad civil, plan de prevención de riesgos, evaluación de riesgos, formaciones PRL específicas por puesto, reconocimientos médicos, entrega de EPIs y, en algunos casos, permisos de trabajo o certificaciones específicas por sector. Una buena plataforma CAE permite configurar qué documentos exige a cada tipo de empresa o trabajador.",
  },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function PlataformasCAEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-playGrey">

      {/* Hero */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <span className="mb-4 inline-block rounded-full bg-playBlueDark/10 px-4 py-2 text-sm font-semibold text-playBlueDark">
              Guía actualizada 2026
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
              Plataformas CAE:{" "}
              <span className="text-playBlueLight">
                Guía Completa y Comparativa
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-playBlueLight md:text-xl">
              Todo lo que necesitas saber sobre las plataformas de{" "}
              <strong>Coordinación de Actividades Empresariales</strong>: qué
              son, cómo funcionan, qué tipos existen y cómo elegir la correcta
              para tu empresa — sin venderte nada en los primeros 2.000 palabras.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-playBlueLight sm:flex-row">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> 12 min de lectura
              </span>
              <span className="hidden sm:block">·</span>
              <span>Actualizado abril 2026</span>
              <span className="hidden sm:block">·</span>
              <span>RD 171/2004 incluido</span>
            </div>
          </div>
        </div>
      </section>

      {/* Índice */}
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <nav className="rounded-xl border border-playBlueLight/20 bg-white p-6">
            <p className="mb-4 font-semibold text-playBlueDark">En esta guía:</p>
            <ol className="space-y-2 text-playBlueLight">
              {[
                "¿Qué es una plataforma CAE?",
                "Cómo funciona paso a paso",
                "Tipos de plataformas CAE",
                "Funcionalidades clave",
                "Comparativa del mercado español",
                "Alternativa a Dokify y plataformas establecidas",
                "Plataforma CAE sin coste por trabajador",
                "Implementación en días vs meses",
                "Cómo elegir la correcta",
                "Plataformas CAE por sector",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-playBlueDark/10 text-xs font-bold text-playBlueDark">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 1. Qué es */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-6 text-3xl font-bold text-playBlueDark">
            ¿Qué es una Plataforma CAE?
          </h2>
          <div className="space-y-4 text-lg text-playBlueLight">
            <p>
              Una <strong>plataforma CAE</strong> es un software especializado que
              digitaliza la gestión de la{" "}
              <strong>Coordinación de Actividades Empresariales</strong> tal como
              la exige el Real Decreto 171/2004 y la Ley 31/1995 de Prevención de
              Riesgos Laborales.
            </p>
            <p>
              Su función central es garantizar que todas las empresas y
              trabajadores externos que acceden a tus instalaciones tienen la
              documentación de prevención de riesgos en regla — antes de entrar,
              no después.
            </p>
            <p>
              Sin una plataforma CAE, esta gestión se hace manualmente: correos
              electrónicos con PDFs adjuntos, Excel con fechas de caducidad,
              llamadas de recordatorio y revisión visual de cada documento. Un
              sistema que funciona con 5 contratas y colapsa con 50.
            </p>
          </div>
          <div className="mt-8 rounded-xl border-l-4 border-playBlueDark bg-playGrey p-6">
            <p className="font-semibold text-playBlueDark">Marco legal de referencia:</p>
            <ul className="mt-3 space-y-2 text-playBlueLight">
              <li className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playBlueDark" />
                <span>
                  <strong>RD 171/2004</strong> — regula la coordinación cuando
                  concurren trabajadores de distintas empresas en un mismo centro
                  de trabajo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playBlueDark" />
                <span>
                  <strong>Ley 31/1995 de PRL</strong> — establece las obligaciones
                  generales del empresario en materia de seguridad y salud.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-playOrange" />
                <span>
                  Sin cumplimiento documentado, la empresa principal puede ser
                  responsable subsidiaria de las sanciones a sus contratas.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Cómo funciona */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Cómo Funciona una Plataforma CAE (Paso a Paso)
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            El proceso completo, desde que una contrata empieza a trabajar contigo
            hasta que un trabajador cruza la puerta:
          </p>
          <div className="space-y-6">
            {[
              {
                paso: "1",
                titulo: "La empresa principal configura sus requisitos",
                detalle:
                  "Defines qué documentación exiges a cada tipo de empresa contratista y a cada perfil de trabajador. Puede variar según el centro de trabajo, el tipo de tarea o la zona de riesgo.",
              },
              {
                paso: "2",
                titulo: "La contrata recibe acceso al portal y sube su documentación",
                detalle:
                  "La empresa subcontratada recibe un enlace de invitación, accede al portal con sus credenciales y sube los documentos requeridos: TC1/TC2, seguro de RC, formaciones, reconocimientos médicos, etc.",
              },
              {
                paso: "3",
                titulo: "La plataforma valida automáticamente",
                detalle:
                  "En las plataformas con IA, el sistema extrae los datos del documento, verifica fechas de vigencia, importes de cobertura y datos de identificación. En plataformas con workflows, el documento pasa a revisión manual por un técnico.",
              },
              {
                paso: "4",
                titulo: "Los trabajadores se dan de alta y reciben autorización",
                detalle:
                  "Cada trabajador queda vinculado a su empresa y a los centros de trabajo donde opera. Solo quienes tienen toda la documentación en regla reciben autorización de acceso.",
              },
              {
                paso: "5",
                titulo: "Control continuo y alertas de caducidad",
                detalle:
                  "La plataforma monitoriza fechas de vencimiento. Cuando un documento va a caducar, avisa automáticamente a la contrata y al responsable de la empresa principal con la antelación configurada.",
              },
              {
                paso: "6",
                titulo: "Control de accesos en tiempo real (si aplica)",
                detalle:
                  "Las plataformas CAE más completas integran control de accesos físico: solo los trabajadores con documentación válida pueden entrar. El bloqueo es automático cuando algo caduca.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-playBlueDark text-lg font-bold text-white">
                  {item.paso}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-playBlueDark">
                    {item.titulo}
                  </h3>
                  <p className="text-playBlueLight">{item.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tipos */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Tipos de Plataformas CAE en el Mercado
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            No todas las plataformas CAE son iguales. Hay tres generaciones bien
            diferenciadas en el mercado español:
          </p>
          <div className="space-y-8">
            {tiposPlataforma.map((tipo, i) => (
              <div
                key={i}
                className="rounded-2xl border border-playBlueLight/20 bg-white p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-playBlueDark/10 p-3">
                    <tipo.icon className="h-6 w-6 text-playBlueDark" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-playBlueLight">
                      Tipo {i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-playBlueDark">
                      {tipo.tipo}
                    </h3>
                  </div>
                </div>
                <p className="mb-6 text-playBlueLight">{tipo.descripcion}</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-2 font-semibold text-playBlueDark">Ventajas:</p>
                    <ul className="space-y-1">
                      {tipo.ventajas.map((v, j) => (
                        <li key={j} className="flex items-start gap-2 text-playBlueLight">
                          <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playGreen" />
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-playBlueDark">Limitaciones:</p>
                    <ul className="space-y-1">
                      {tipo.limitaciones.map((l, j) => (
                        <li key={j} className="flex items-start gap-2 text-playBlueLight">
                          <X className="mt-1 h-4 w-4 flex-shrink-0 text-securityRed" />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-5 rounded-lg bg-playGrey px-4 py-3">
                  <span className="text-sm font-semibold text-playBlueDark">
                    ¿Para quién?{" "}
                  </span>
                  <span className="text-sm text-playBlueLight">{tipo.paraQuien}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Funcionalidades */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Funcionalidades Clave de las Plataformas CAE
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            Al evaluar cualquier plataforma CAE, estas son las funcionalidades
            que debes verificar — y las que son imprescindibles vs. opcionales:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {funcionalidades.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-playBlueDark/10 p-3">
                    <f.icon className="h-6 w-6 text-playBlueDark" />
                  </div>
                  {f.esencial ? (
                    <span className="rounded-full bg-playGreen/20 px-3 py-1 text-xs font-semibold text-playGreen">
                      Imprescindible
                    </span>
                  ) : (
                    <span className="rounded-full bg-playBlueDark/10 px-3 py-1 text-xs font-semibold text-playBlueDark">
                      Muy recomendable
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-playBlueDark">
                  {f.titulo}
                </h3>
                <p className="text-playBlueLight">{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Comparativa */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Comparativa de Plataformas CAE en España 2026
          </h2>
          <p className="mb-2 text-lg text-playBlueLight">
            El mercado español de software CAE está dominado por soluciones que
            nacieron hace 10-15 años para gestionar documentación manualmente.
            Han ido incorporando mejoras, pero su arquitectura base —y su modelo
            de precios— sigue siendo la misma.
          </p>
          <p className="mb-8 text-lg text-playBlueLight">
            En los últimos dos años han aparecido plataformas de nueva generación
            con IA real integrada desde el diseño. Esta tabla compara ambos
            enfoques:
          </p>
          <div className="overflow-hidden rounded-2xl border border-playBlueLight/20 bg-white shadow-sm">
            <div className="grid grid-cols-3 border-b border-playBlueLight/20 bg-playGrey px-4 py-4">
              <div className="font-semibold text-playBlueDark">Criterio</div>
              <div className="text-center font-semibold text-playBlueLight">
                Plataformas tradicionales
              </div>
              <div className="text-center font-semibold text-playBlueDark">
                PlayCAE
              </div>
            </div>
            {comparativaRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 px-4 py-4 ${
                  i % 2 === 0 ? "bg-white" : "bg-playGrey/30"
                }`}
              >
                <div className="text-playBlueDark">
                  <p className="font-medium">{row.criterio}</p>
                  {row.nota && (
                    <p className="mt-0.5 text-xs text-playBlueLight">{row.nota}</p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {row.tradicional ? (
                    <Check className="h-5 w-5 text-playGreen" />
                  ) : (
                    <X className="h-5 w-5 text-securityRed" />
                  )}
                </div>
                <div className="flex items-center justify-center">
                  {row.playcae ? (
                    <Check className="h-5 w-5 text-playGreen" />
                  ) : (
                    <X className="h-5 w-5 text-securityRed" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-playBlueLight/70">
            * Comparativa basada en funcionalidades estándar de plataformas
            consolidadas del mercado. Las características específicas pueden variar
            según plan y configuración.
          </p>
        </div>
      </section>

      {/* 6. Alternativa a Dokify */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Alternativa a Dokify: Qué Evaluar Antes de Cambiar
          </h2>
          <p className="mb-6 text-lg text-playBlueLight">
            Dokify es una de las plataformas CAE más conocidas en España, con una
            base de clientes sólida y muchos años de recorrido. Si estás usando
            Dokify —o cualquier otra plataforma establecida— y estás evaluando
            alternativas, estas son las preguntas correctas que hacerse:
          </p>
          <div className="space-y-4">
            {[
              {
                pregunta: "¿Tu equipo sigue validando documentos manualmente?",
                contexto:
                  "Si la plataforma almacena documentos pero alguien de tu equipo los tiene que revisar uno a uno, estás pagando por un repositorio, no por automatización. Una alternativa real debería eliminar esa carga completamente.",
              },
              {
                pregunta: "¿El coste mensual crece con cada trabajador nuevo?",
                contexto:
                  "El modelo de pago por trabajador penaliza el crecimiento. Si acabas de ganar un contrato nuevo con 200 trabajadores externos, tu factura se dispara. Evalúa si existe un modelo de tarifa plana que te proteja de esa variabilidad.",
              },
              {
                pregunta: "¿Cuánto tardaste en implementarlo cuando empezaste?",
                contexto:
                  "Si la implementación inicial duró meses y necesitaste consultoría externa, el coste real del software fue mucho mayor del precio anunciado. Las alternativas modernas deben poder demostrarte un onboarding autoguiado en menos de una semana.",
              },
              {
                pregunta: "¿La interfaz que usan tus contratas es intuitiva?",
                contexto:
                  "Si tus subcontratas te llaman constantemente porque no saben cómo subir documentos, el problema no es de ellas — es del diseño de la plataforma. La adopción de las contratas es el mayor factor de éxito en la implementación.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <h3 className="mb-2 flex items-start gap-2 text-lg font-semibold text-playBlueDark">
                  <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-playOrange" />
                  {item.pregunta}
                </h3>
                <p className="text-playBlueLight">{item.contexto}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-playBlueDark p-6 text-white">
            <p className="font-semibold">Conclusión:</p>
            <p className="mt-2 text-playGrey">
              No cambies de plataforma solo por el precio. Cambia si la plataforma
              actual te crea trabajo en lugar de eliminarlo. El indicador más
              honesto es cuántas horas semanales dedica tu equipo a revisar
              documentos manualmente.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Sin coste por trabajador */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Plataforma CAE sin Coste por Trabajador: El Modelo de Tarifa Plana
          </h2>
          <p className="mb-6 text-lg text-playBlueLight">
            El modelo de precios más extendido en el mercado CAE cobra por cada
            trabajador externo registrado en la plataforma. Parece razonable al
            principio, pero tiene un problema fundamental: penaliza exactamente
            lo que más te interesa, que es registrar a todos tus trabajadores
            externos.
          </p>
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-securityRed/30 bg-securityRed/5 p-6">
              <h3 className="mb-4 font-semibold text-securityRed">
                Modelo por trabajador — el problema
              </h3>
              <ul className="space-y-3 text-playBlueLight">
                <li className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0 text-securityRed" />
                  <span>
                    500 trabajadores × 2€/mes = <strong>1.000€/mes</strong>{" "}
                    variables
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0 text-securityRed" />
                  <span>
                    Picos de coste en temporadas altas (obra nueva, campañas
                    logísticas)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0 text-securityRed" />
                  <span>
                    Incentivo perverso a no registrar todos los trabajadores
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-1 h-4 w-4 flex-shrink-0 text-securityRed" />
                  <span>Factura impredecible mes a mes</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-playGreen/30 bg-playGreen/5 p-6">
              <h3 className="mb-4 font-semibold text-playGreen">
                Modelo tarifa plana — las ventajas
              </h3>
              <ul className="space-y-3 text-playBlueLight">
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playGreen" />
                  <span>Coste fijo mensual independientemente del volumen</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playGreen" />
                  <span>
                    Presupuesto predecible: el crecimiento no penaliza
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playGreen" />
                  <span>
                    Incentivo correcto: registras a todos los trabajadores
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-playGreen" />
                  <span>ROI positivo desde el primer mes con volumen medio</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-lg text-playBlueLight">
            El modelo de tarifa plana es especialmente ventajoso para empresas con
            alta rotación de trabajadores externos (construcción, logística,
            eventos, mantenimiento industrial) donde el número de registros activos
            puede variar un 200-300% entre meses.
          </p>
        </div>
      </section>

      {/* 8. Implementación días vs meses */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Implementación en Días vs Meses: Cómo Distinguir una Plataforma Moderna
          </h2>
          <p className="mb-8 text-lg text-playBlueLight">
            El tiempo de implementación es uno de los indicadores más honestos de
            si estás ante una solución moderna o heredada. Estas son las señales
            claras:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-playBlueLight">
                🔴 Señales de implementación larga (3-6 meses)
              </h3>
              {[
                'Te ofrecen un "proyecto de implantación" con fases',
                "Requiere formación presencial de tu equipo",
                "Necesitas migrar datos de un sistema anterior manualmente",
                "El onboarding lo lidera un consultor externo",
                "La configuración de requisitos requiere tickets al soporte",
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-securityRed/20 bg-white p-4"
                >
                  <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-securityRed" />
                  <span className="text-playBlueLight">{s}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-playBlueLight">
                🟢 Señales de implementación rápida (&lt;1 semana)
              </h3>
              {[
                "Puedes configurar tus requisitos tú mismo desde el panel",
                "El portal de contratas está listo para usar el mismo día",
                "Las contratas se incorporan solas con un enlace de invitación",
                "Hay documentación de autoservicio clara y vídeos cortos",
                "El soporte responde en horas, no en días laborables",
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-playGreen/20 bg-white p-4"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-playGreen" />
                  <span className="text-playBlueLight">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Cómo elegir */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Cómo Elegir la Plataforma CAE Correcta para tu Empresa
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            5 criterios reales para tomar la decisión — sin dejarte llevar solo
            por la demo o el precio de portada:
          </p>
          <div className="space-y-6">
            {criteriosEleccion.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6 transition-all hover:border-playBlueDark/30"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-bold text-playBlueDark/20">
                    {c.numero}
                  </span>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-playBlueDark">
                      {c.criterio}
                    </h3>
                    <p className="text-playBlueLight">{c.explicacion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Sectores */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Plataformas CAE por Sector: Qué Necesita Cada Industria
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            Los retos de coordinación de actividades empresariales no son iguales
            en todos los sectores. Estos son los más habituales:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {sectores.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Building2 className="h-7 w-7 text-playBlueDark" />
                  <h3 className="text-xl font-semibold text-playBlueDark">
                    {s.nombre}
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-playBlueLight/60">
                    Retos típicos
                  </p>
                  <p className="text-playBlueLight">{s.retos}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-playBlueLight/60">
                    Lo que más importa en la plataforma
                  </p>
                  <p className="text-playBlueLight">{s.clave}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PlayCAE */}
      <section className="bg-gradient-to-br from-playBlueDark to-playBlueLight px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            PlayCAE — Plataforma CAE española con IA
          </span>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            La Plataforma CAE Diseñada para No Darte Trabajo
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-playGrey">
            Validación automática con IA, tarifa plana sin coste por trabajador,
            portal de contratas incluido y operativo en menos de una semana. Sin
            consultorías, sin sorpresas en la factura.
          </p>
          <div className="mb-12 grid gap-4 sm:grid-cols-4">
            {[
              { valor: "<1 semana", label: "Implementación" },
              { valor: "Tarifa plana", label: "Sin coste por trabajador" },
              { valor: "IA real", label: "Validación automática" },
              { valor: "24/7", label: "Acceso para contratas" },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="mb-1 text-2xl font-bold">{stat.valor}</div>
                <div className="text-sm text-playGrey">{stat.label}</div>
              </div>
            ))}
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
      </section>

      {/* FAQ */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
            Preguntas Frecuentes sobre Plataformas CAE
          </h2>
          <p className="mb-10 text-lg text-playBlueLight">
            Las dudas más habituales al evaluar un software de Coordinación de
            Actividades Empresariales:
          </p>
          <div className="space-y-6">
            {faqItems.map((faq, i) => (
              <article
                key={i}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <h3 className="mb-3 text-lg font-semibold text-playBlueDark">
                  {faq.question}
                </h3>
                <p className="text-playBlueLight">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Internal linking */}
      <section className="bg-playGrey px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-playBlueLight/20 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-playBlueDark">
              Más recursos sobre CAE y PRL
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { href: "/plataforma-cae", label: "¿Qué es una Plataforma CAE?" },
                { href: "/plataformas-cae-prl", label: "Plataformas CAE + PRL" },
                { href: "/que-es-cae", label: "¿Qué es la CAE?" },
                { href: "/preguntas-frecuentes", label: "FAQs CAE y PRL" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
                >
                  <ChevronRight className="h-5 w-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              ))}
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
