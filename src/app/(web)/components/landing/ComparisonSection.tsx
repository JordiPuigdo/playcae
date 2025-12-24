"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Clock, Users, CreditCard } from "lucide-react";

const comparisonPoints = [
  {
    feature: "Validación documental con IA",
    playcae: true,
    others: "Manual o semi-automática",
    highlight: true,
  },
  {
    feature: "Tiempo de implementación",
    playcae: "Días",
    others: "Meses",
    highlight: true,
  },
  {
    feature: "Coste por contrata/trabajador",
    playcae: "Sin costes ocultos",
    others: "Pago por volumen",
    highlight: true,
  },
  {
    feature: "Soporte técnico",
    playcae: "Personalizado incluido",
    others: "De pago o limitado",
    highlight: false,
  },
  {
    feature: "Control de accesos integrado",
    playcae: true,
    others: "Módulo adicional",
    highlight: false,
  },
  {
    feature: "Alertas de caducidad automáticas",
    playcae: true,
    others: true,
    highlight: false,
  },
  {
    feature: "Interfaz intuitiva para contratas",
    playcae: true,
    others: "Curva de aprendizaje alta",
    highlight: true,
  },
  {
    feature: "API abierta para integraciones",
    playcae: true,
    others: "Limitada o de pago",
    highlight: false,
  },
];

const differentiators = [
  {
    icon: Zap,
    title: "Implementación en días, no meses",
    description:
      "Mientras otras plataformas CAE requieren proyectos de implementación largos, con PlayCAE puedes estar operativo en menos de una semana.",
  },
  {
    icon: CreditCard,
    title: "Precio transparente y predecible",
    description:
      "Sin costes por contrata, sin tarifas por trabajador, sin sorpresas. Sabes exactamente lo que vas a pagar desde el primer día.",
  },
  {
    icon: Clock,
    title: "IA que trabaja por ti 24/7",
    description:
      "Nuestra inteligencia artificial valida documentos automáticamente mientras tú te centras en lo importante. 99.2% de precisión.",
  },
  {
    icon: Users,
    title: "Soporte real, no tickets",
    description:
      "Acceso directo a nuestro equipo de expertos en CAE y PRL. Sin esperas de días ni respuestas automáticas.",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-16 lg:py-24 bg-white" id="comparativa">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4">
            ¿Por qué elegir PlayCAE frente a otras plataformas CAE?
          </h2>
          <p className="text-lg text-playBlueLight max-w-3xl mx-auto">
            No todas las plataformas de coordinación de actividades
            empresariales son iguales. Compara y decide con información real.
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {differentiators.map((item, idx) => (
            <div
              key={idx}
              className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10 hover:shadow-lg transition-shadow"
            >
              <div className="bg-playOrange w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-playBlueDark mb-2">
                {item.title}
              </h3>
              <p className="text-playBlueLight text-sm">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-playGrey rounded-2xl border border-playBlueLight/20 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-playBlueDark text-white">
              <div className="p-4 font-semibold">Funcionalidad</div>
              <div className="p-4 font-semibold text-center bg-playOrange">
                PlayCAE
              </div>
              <div className="p-4 font-semibold text-center">
                Otras plataformas
              </div>
            </div>

            {/* Table Rows */}
            {comparisonPoints.map((point, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 border-b border-playBlueLight/10 ${
                  point.highlight ? "bg-playOrange/5" : "bg-white"
                }`}
              >
                <div className="p-4 text-playBlueDark font-medium">
                  {point.feature}
                </div>
                <div className="p-4 text-center">
                  {typeof point.playcae === "boolean" ? (
                    point.playcae ? (
                      <Check className="h-5 w-5 text-playGreen mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-playGreen font-semibold text-sm">
                      {point.playcae}
                    </span>
                  )}
                </div>
                <div className="p-4 text-center">
                  {typeof point.others === "boolean" ? (
                    point.others ? (
                      <Check className="h-5 w-5 text-playBlueLight mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-playBlueLight text-sm">
                      {point.others}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-playBlueLight mt-4">
            * Comparativa basada en características públicas de plataformas CAE
            del mercado español.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-playBlueDark font-medium mb-4">
            ¿Vienes de otra plataforma CAE?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-playOrange/90 hover:scale-[1.02]"
          >
            Te ayudamos con la migración gratuita
          </a>
        </motion.div>
      </div>
    </section>
  );
}
