import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal | PlayCAE",
  description:
    "Aviso legal de PlayCAE, plataforma de gestión documental CAE y PRL con Inteligencia Artificial. Información sobre propiedad, condiciones de uso y responsabilidades.",
  alternates: { canonical: "/legal/aviso-legal" },
  robots: { index: true, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <main className="container mx-auto px-4 relative overflow-hidden py-24 prose prose-gray max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-brandPrimary">
        Aviso Legal
      </h1>

      <p className="text-muted-foreground mb-4">
        En cumplimiento con el deber de información recogido en la Ley 34/2002,
        de 11 de julio, de Servicios de la Sociedad de la Información y del
        Comercio Electrónico (LSSI-CE), se facilitan a continuación los datos
        identificativos del titular de este sitio web.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        1. Datos identificativos
      </h2>
      <p>
        <strong>Nombre comercial:</strong> PlayCAE
        <br />
        <strong>Denominación social:</strong> PlayCae SL
        <br />
        <strong>NIF:</strong> BXXXXXXXX
        <br />
        <strong>Domicilio social:</strong> [Dirección completa]
        <br />
        <strong>Correo electrónico de contacto:</strong>{" "}
        <a
          href="mailto:info@playcae.com"
          className="text-brandSecondary hover:underline"
        >
          info@playcae.com
        </a>{" "}
        <br />
        <strong>Dominio web:</strong>{" "}
        <a
          href="https://playcae.com"
          className="text-brandSecondary hover:underline"
        >
          www.playcae.com
        </a>
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        2. Objeto y ámbito de aplicación
      </h2>
      <p>
        El presente Aviso Legal regula el acceso, navegación y uso del sitio web{" "}
        <strong>www.playcae.com</strong>, así como las responsabilidades
        derivadas de la utilización de sus contenidos, entendiendo por estos los
        textos, gráficos, ilustraciones, diseños, códigos, software,
        fotografías, vídeos, sonidos, bases de datos y cualquier otra creación
        protegida por las leyes nacionales e internacionales de propiedad
        intelectual e industrial.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        3. Condiciones de uso
      </h2>
      <p>
        El acceso y uso de la web de PlayCAE atribuye la condición de usuario e
        implica la aceptación plena y sin reservas de todas las disposiciones
        incluidas en este Aviso Legal. El usuario se compromete a hacer un uso
        adecuado de los contenidos y servicios ofrecidos, respetando la
        legislación vigente y los derechos de propiedad intelectual e industrial
        de PlayCAE o de terceros.
      </p>
      <p>
        Se prohíbe expresamente utilizar el sitio web con fines ilícitos o
        lesivos, o que puedan causar perjuicio o impedir el normal
        funcionamiento del sitio.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        4. Propiedad intelectual e industrial
      </h2>
      <p>
        Todos los contenidos de este sitio web, incluidos textos, fotografías,
        gráficos, logotipos, iconos, tecnología, software, así como su diseño
        gráfico y códigos fuente, son propiedad exclusiva de PlayCAE o de
        terceros, estando protegidos por la legislación española e internacional
        sobre propiedad intelectual e industrial.
      </p>
      <p>
        Queda prohibida la reproducción, distribución, comunicación pública o
        transformación de dichos contenidos sin la autorización previa y expresa
        de PlayCAE.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        5. Responsabilidad
      </h2>
      <p>
        PlayCAE no se hace responsable de los daños o perjuicios derivados del
        uso indebido de la información o servicios contenidos en este sitio web,
        ni de las decisiones adoptadas por el usuario basadas en dicha
        información.
      </p>
      <p>
        Tampoco garantiza la disponibilidad, continuidad ni la ausencia de virus
        u otros elementos que puedan alterar los sistemas informáticos o
        documentos electrónicos del usuario.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        6. Política de enlaces
      </h2>
      <p>
        Este sitio web puede contener enlaces a otros sitios o contenidos
        pertenecientes a terceros. PlayCAE no se responsabiliza en ningún caso
        de los resultados que puedan derivarse del acceso a dichos sitios.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        7. Protección de datos personales
      </h2>
      <p>
        PlayCAE cumple con la normativa vigente en materia de protección de
        datos personales, el <strong>Reglamento (UE) 2016/679</strong> (RGPD) y
        la <strong>Ley Orgánica 3/2018</strong>, de Protección de Datos
        Personales y garantía de los derechos digitales.
      </p>
      <p>
        Puedes consultar nuestra{" "}
        <a
          href="/legal/privacidad"
          className="text-brandSecondary hover:underline"
        >
          Política de Privacidad
        </a>{" "}
        para conocer en detalle cómo tratamos la información personal.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        8. Legislación aplicable y jurisdicción
      </h2>
      <p>
        El presente Aviso Legal se rige por la legislación española. Para la
        resolución de conflictos o reclamaciones, las partes se someten a los
        Juzgados y Tribunales de [Ciudad del domicilio social], renunciando
        expresamente a cualquier otro fuero que pudiera corresponderles.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        9. Contacto
      </h2>
      <p>
        Si tienes cualquier duda o comentario sobre este Aviso Legal, puedes
        ponerte en contacto con nosotros en el correo{" "}
        <a
          href="mailto:info@playcae.com"
          className="text-brandSecondary hover:underline"
        >
          info@playcae.com
        </a>
        .
      </p>

      <p className="text-sm text-muted-foreground mt-10">
        Última actualización: Octubre de 2025
      </p>
    </main>
  );
}
