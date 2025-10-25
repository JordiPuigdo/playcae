"use client";

export default function ContactForm() {
  return (
    <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
      {/* Honeypot (oculto a usuarios) */}
      <div className="hidden">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
          aria-required="true"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-cyan-500 focus:ring focus:ring-cyan-500/30"
          aria-required="true"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-gray-300 text-brandSecondary focus:ring-cyan-500"
          aria-required="true"
        />
        <label htmlFor="consent" className="text-sm text-gray-700">
          He leído y acepto la{" "}
          <a href="/legal/privacidad" className="text-brandSecondary underline">
            Política de Privacidad
          </a>{" "}
          y la{" "}
          <a href="/legal/cookies" className="text-brandSecondary underline">
            Política de Cookies
          </a>
          .
        </label>
      </div>

      <button
        type="submit"
        disabled={false}
        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/50 disabled:opacity-60"
        aria-busy={false}
      >
        Enviar mensaje
      </button>

      {/* Visual-only: no server errors shown */}
    </form>
  );
}
