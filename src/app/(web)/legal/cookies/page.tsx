import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies | PlayCAE",
  description:
    "Política de cookies de PlayCAE. Conoce qué cookies utilizamos para mejorar tu experiencia, analizar el tráfico y ofrecerte un servicio personalizado conforme al RGPD y la LSSI.",
  alternates: { canonical: "/legal/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-4 relative overflow-hidden py-24 prose prose-gray max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-brandPrimary">
        Política de Cookies
      </h1>

      <p className="text-muted-foreground mb-6">
        En <strong>PlayCAE</strong> utilizamos cookies y tecnologías similares
        para ofrecerte una mejor experiencia de navegación, analizar el tráfico
        del sitio y personalizar el contenido. En esta Política explicamos qué
        son las cookies, qué tipos usamos y cómo puedes gestionarlas.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        1. ¿Qué son las cookies?
      </h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web colocan en
        tu dispositivo (ordenador, móvil o tablet) cuando los visitas. Sirven
        para almacenar información sobre tus preferencias, recordar tus datos de
        inicio de sesión o analizar cómo interactúas con el sitio.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        2. Tipos de cookies que utilizamos
      </h2>
      <p>
        Este sitio web utiliza tanto <strong>cookies propias</strong> como{" "}
        <strong>de terceros</strong> para diferentes finalidades:
      </p>

      <ul>
        <li>
          <strong>Cookies técnicas o necesarias:</strong> permiten la navegación
          y el uso de las funcionalidades esenciales del sitio (por ejemplo,
          iniciar sesión o recordar el idioma). No requieren tu consentimiento.
        </li>
        <li>
          <strong>Cookies de análisis o medición:</strong> nos ayudan a entender
          cómo los usuarios interactúan con el sitio web para mejorar su
          rendimiento. Por ejemplo, usamos servicios como Google Analytics con
          IP anonimizada.
        </li>
        <li>
          <strong>Cookies de personalización:</strong> recuerdan tus
          preferencias (como idioma o tema oscuro) para ofrecerte una
          experiencia más coherente.
        </li>
        <li>
          <strong>Cookies publicitarias o de terceros:</strong> se utilizan
          ocasionalmente para mostrar anuncios personalizados o medir su
          rendimiento. Estas cookies son gestionadas por terceros (como Google o
          LinkedIn).
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        3. Cookies utilizadas en PlayCAE
      </h2>
      <p>
        A continuación se indican las cookies activas actualmente en{" "}
        <strong>www.playcae.com</strong>:
      </p>

      <table className="w-full text-sm border border-gray-200 mt-4">
        <thead className="bg-brandAccent text-left">
          <tr>
            <th className="p-2">Cookie</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Duración</th>
            <th className="p-2">Finalidad</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">_ga</td>
            <td className="p-2">Analítica (Google Analytics)</td>
            <td className="p-2">2 años</td>
            <td className="p-2">
              Se usa para distinguir usuarios de forma anónima y analizar el
              tráfico del sitio.
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2">_gid</td>
            <td className="p-2">Analítica (Google Analytics)</td>
            <td className="p-2">24 horas</td>
            <td className="p-2">
              Registra un identificador único para generar informes estadísticos
              sobre el uso del sitio.
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2">cookie_consent</td>
            <td className="p-2">Técnica</td>
            <td className="p-2">1 año</td>
            <td className="p-2">
              Guarda las preferencias del usuario sobre la aceptación de
              cookies.
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-sm text-muted-foreground mt-3">
        *La lista anterior se actualizará a medida que evolucione el sitio o se
        incorporen nuevas herramientas.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        4. Gestión y eliminación de cookies
      </h2>
      <p>
        Puedes permitir, bloquear o eliminar las cookies instaladas en tu
        dispositivo mediante la configuración de tu navegador. A continuación te
        facilitamos enlaces a la ayuda de los principales navegadores:
      </p>

      <ul>
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brandSecondary hover:underline"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/es/kb/Borrar%20cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brandSecondary hover:underline"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brandSecondary hover:underline"
          >
            Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brandSecondary hover:underline"
          >
            Microsoft Edge / Explorer
          </a>
        </li>
      </ul>

      <p>
        Si rechazas algunas cookies, es posible que ciertas funcionalidades del
        sitio web no estén disponibles o no funcionen correctamente.
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        5. Consentimiento de cookies
      </h2>
      <p>
        Cuando accedes por primera vez a nuestro sitio web, se muestra un banner
        o ventana emergente que te permite aceptar o rechazar las cookies no
        esenciales. Puedes modificar tu consentimiento en cualquier momento
        desde el{" "}
        <a href="#" className="text-brandSecondary hover:underline">
          Centro de preferencias de cookies
        </a>{" "}
        (próximamente disponible).
      </p>

      <h2 className="text-2xl font-semibold mt-10 text-brandPrimary">
        6. Actualizaciones de la política
      </h2>
      <p>
        Esta Política de Cookies puede actualizarse en función de cambios
        normativos o técnicos. Te recomendamos revisarla periódicamente para
        mantenerte informado sobre cómo usamos las cookies.
      </p>

      <p className="text-sm text-muted-foreground mt-10">
        Última actualización: Octubre de 2025
      </p>
    </main>
  );
}
