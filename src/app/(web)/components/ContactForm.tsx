"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Check honeypot
    if (formData.get("company")) {
      return; // Bot detected
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const consent = formData.get("consent");

    if (!name || !email || !message || !consent) {
      setError(t("landing.contact.errorRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("landing.contact.errorGeneric"));
      }

      // Redirect to thank you page
      router.push("/contacto/gracias");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("landing.contact.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
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
          {t("landing.contact.formName")}
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
          {t("landing.contact.formEmail")}
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
          {t("landing.contact.formMessage")}
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
          {t("common.consent.prefix")}{" "}
          <a href="/legal/privacidad" className="text-brandSecondary underline">
            {t("footer.linkPrivacy")}
          </a>{" "}
          {t("common.consent.and")}{" "}
          <a href="/legal/cookies" className="text-brandSecondary underline">
            {t("footer.linkCookies")}
          </a>
          .
        </label>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? t("landing.contact.formSending") : t("landing.contact.formSubmit")}
      </button>
    </form>
  );
}
