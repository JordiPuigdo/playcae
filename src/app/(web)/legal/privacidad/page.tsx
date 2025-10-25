import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | PlayCAE",
  description:
    "Política de privacidad de PlayCAE. Conoce cómo tratamos tus datos personales conforme al RGPD y la LOPDGDD. Transparencia, seguridad y cumplimiento normativo.",
  alternates: { canonical: "/legal/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main className="container mx-auto px-4  prose prose-gray relative overflow-hidden py-24 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-brandPrimary">
        Política de Privacidad
      </h1>

      <p className="text-muted-foreground mb-6">
        En cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679, del
        Parlamento Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y la
        Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos
        Personales y garantía de los derechos digitales (LOPDGDD), te informamos
        sobre cómo tratamos tus datos personales en <strong>PlayCAE</strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        1. Identidad del responsable del tratamiento
      </h2>
      <p>
        <strong>Responsable:</strong> PlayCae
        <br />
        <strong>Nombre comercial:</strong> PlayCAE
        <br />
        <strong>NIF:</strong> BXXXXXXXX
        <br />
        <strong>Domicilio social:</strong> [Dirección completa]
        <br />
        <strong>Correo electrónico:</strong>{" "}
        <a
          href="mailto:info@playcae.com"
          className="text-brandSecondary hover:underline"
        >
          info@playcae.com
        </a>
        <br />
        <strong>Sitio web:</strong>{" "}
        <a
          href="https://playcae.com"
          className="text-brandSecondary hover:underline"
        >
          www.playcae.com
        </a>
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        2. Finalidad del tratamiento de los datos
      </h2>
      <p>
        En <strong>PlayCAE</strong> tratamos los datos personales con las
        siguientes finalidades:
      </p>

      <ul>
        <li>
          Gestionar el registro de usuarios y el acceso a la plataforma PlayCAE.
        </li>
        <li>
          Atender solicitudes de información, demostraciones o soporte técnico.
        </li>
        <li>
          Enviar comunicaciones comerciales relacionadas con nuestros servicios
          (solo si el usuario ha otorgado su consentimiento).
        </li>
        <li>
          Mejorar el rendimiento, la seguridad y la experiencia de usuario de la
          plataforma mediante analítica web.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        3. Base legal para el tratamiento
      </h2>
      <p>Las bases legales que legitiman el tratamiento de tus datos son:</p>

      <ul>
        <li>
          <strong>Ejecución de un contrato</strong> (art. 6.1.b RGPD): para la
          prestación de los servicios contratados a través de la plataforma.
        </li>
        <li>
          <strong>Consentimiento del interesado</strong> (art. 6.1.a RGPD): para
          comunicaciones comerciales, suscripciones o demostraciones.
        </li>
        <li>
          <strong>Interés legítimo</strong> (art. 6.1.f RGPD): para mantener la
          seguridad del sistema y mejorar los servicios.
        </li>
        <li>
          <strong>Obligación legal</strong> (art. 6.1.c RGPD): para cumplir con
          requerimientos fiscales, contables o de prevención de riesgos.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        4. Plazo de conservación de los datos
      </h2>
      <p>
        Los datos personales se conservarán mientras se mantenga la relación
        contractual o mientras el usuario no solicite su supresión.
        Posteriormente, se mantendrán bloqueados durante los plazos legalmente
        establecidos para atender posibles responsabilidades legales o
        administrativas.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        5. Destinatarios de los datos
      </h2>
      <p>Los datos podrán ser comunicados a:</p>

      <ul>
        <li>
          Proveedores tecnológicos necesarios para la prestación del servicio
          (alojamiento web, correo electrónico, analítica, herramientas de
          soporte y CRM).
        </li>
        <li>
          Administraciones públicas o autoridades competentes cuando así lo
          exija la normativa vigente.
        </li>
      </ul>

      <p>
        Todos los proveedores cumplen con el RGPD y, en caso de transferencias
        internacionales (por ejemplo, servicios de Google o AWS), se aplican las
        <strong> Cláusulas Contractuales Tipo</strong> aprobadas por la Comisión
        Europea para garantizar un nivel adecuado de protección.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        6. Derechos de los usuarios
      </h2>
      <p>
        Puedes ejercer en cualquier momento tus derechos reconocidos por el
        RGPD:
      </p>

      <ul>
        <li>
          <strong>Acceso:</strong> conocer qué datos tratamos sobre ti.
        </li>
        <li>
          <strong>Rectificación:</strong> solicitar la corrección de datos
          inexactos.
        </li>
        <li>
          <strong>Supresión:</strong> pedir la eliminación de tus datos cuando
          ya no sean necesarios.
        </li>
        <li>
          <strong>Oposición:</strong> oponerte al tratamiento de tus datos por
          motivos legítimos.
        </li>
        <li>
          <strong>Limitación del tratamiento:</strong> restringir temporalmente
          el uso de tus datos.
        </li>
        <li>
          <strong>Portabilidad:</strong> recibir tus datos en un formato
          estructurado y transmitirlos a otro responsable.
        </li>
      </ul>

      <p>
        Para ejercer estos derechos, puedes contactar con nosotros en{" "}
        <a
          href="mailto:info@playcae.com"
          className="text-brandSecondary hover:underline"
        >
          info@playcae.com
        </a>{" "}
        indicando el derecho que deseas ejercer y adjuntando copia de tu
        documento de identidad.
      </p>

      <p>
        Si consideras que se ha vulnerado tu derecho a la protección de datos,
        puedes presentar una reclamación ante la{" "}
        <a
          href="https://www.aepd.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brandSecondary hover:underline"
        >
          Agencia Española de Protección de Datos (AEPD)
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        7. Seguridad de los datos
      </h2>
      <p>
        En <strong>PlayCAE</strong> implementamos medidas técnicas y
        organizativas adecuadas para garantizar la seguridad, confidencialidad e
        integridad de los datos personales, evitando su pérdida, alteración o
        acceso no autorizado. Estas medidas incluyen cifrado de datos,
        comunicaciones seguras (HTTPS) y control de acceso interno.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        8. Menores de edad
      </h2>
      <p>
        Nuestros servicios están dirigidos exclusivamente a empresas y
        profesionales mayores de 18 años. No recopilamos deliberadamente datos
        personales de menores. Si detectamos que hemos obtenido información de
        un menor, procederemos a su eliminación inmediata.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        9. Cambios en la política de privacidad
      </h2>
      <p>
        PlayCAE se reserva el derecho a modificar la presente Política de
        Privacidad para adaptarla a novedades legislativas o mejoras técnicas.
        En caso de cambios sustanciales, se notificará a los usuarios por medios
        visibles (banner, email o notificación en la plataforma).
      </p>

      <p className="text-sm text-muted-foreground mt-10">
        Última actualización: Octubre de 2025
      </p>
    </main>
  );
}
