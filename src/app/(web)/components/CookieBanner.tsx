"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useTranslation";
import {
  COOKIE_PREFERENCES_OPEN_EVENT,
  COOKIE_CONSENT_UPDATED_EVENT,
  createCookieConsent,
  getStoredCookieConsent,
  saveCookieConsent,
} from "@/lib/cookie-consent";

type Copy = {
  title: string;
  description: string;
  configure: string;
  rejectAll: string;
  acceptAll: string;
  save: string;
  settingsTitle: string;
  requiredLabel: string;
  analyticsLabel: string;
  marketingLabel: string;
  alwaysActive: string;
  on: string;
  off: string;
  policyPrefix: string;
  policyLink: string;
  manageFloating: string;
};

const copyByLocale: Record<"es" | "ca", Copy> = {
  es: {
    title: "Uso de cookies",
    description:
      "Utilizamos cookies propias y de terceros para analitica y mejora del servicio. Puedes aceptar, rechazar o configurar tus preferencias.",
    configure: "Configurar",
    rejectAll: "Rechazar",
    acceptAll: "Aceptar",
    save: "Guardar preferencias",
    settingsTitle: "Preferencias de cookies",
    requiredLabel: "Cookies tecnicas (necesarias)",
    analyticsLabel: "Cookies de analitica",
    marketingLabel: "Cookies de marketing",
    alwaysActive: "Siempre activas",
    on: "Activas",
    off: "Desactivadas",
    policyPrefix: "Mas informacion en nuestra",
    policyLink: "Politica de cookies",
    manageFloating: "Configurar cookies",
  },
  ca: {
    title: "Us de cookies",
    description:
      "Utilitzem cookies propies i de tercers per a analitica i millora del servei. Pots acceptar, rebutjar o configurar les preferencies.",
    configure: "Configurar",
    rejectAll: "Rebutjar",
    acceptAll: "Acceptar",
    save: "Guardar preferencies",
    settingsTitle: "Preferencies de cookies",
    requiredLabel: "Cookies tecniques (necessaries)",
    analyticsLabel: "Cookies d'analitica",
    marketingLabel: "Cookies de marketing",
    alwaysActive: "Sempre actives",
    on: "Actives",
    off: "Desactivades",
    policyPrefix: "Mes informacio a la nostra",
    policyLink: "Politica de cookies",
    manageFloating: "Configurar cookies",
  },
};

function Toggle({
  label,
  enabled,
  onToggle,
  onLabel,
  offLabel,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3">
      <p className="text-sm text-slate-700">{label}</p>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
          enabled
            ? "bg-emerald-100 text-emerald-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {enabled ? onLabel : offLabel}
      </button>
    </div>
  );
}

export default function CookieBanner() {
  const locale = useLocale();
  const copy = useMemo(() => copyByLocale[locale], [locale]);

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const applyConsent = (analytics: boolean, marketing: boolean) => {
    saveCookieConsent(createCookieConsent({ analytics, marketing }));
    setAnalyticsEnabled(analytics);
    setMarketingEnabled(marketing);
    setHasDecision(true);
    setShowSettings(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const consent = getStoredCookieConsent();

    if (consent) {
      setAnalyticsEnabled(consent.analytics);
      setMarketingEnabled(consent.marketing);
      setHasDecision(true);
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setShowSettings(false);
    }

    const openPreferences = () => {
      const current = getStoredCookieConsent();
      if (current) {
        setAnalyticsEnabled(current.analytics);
        setMarketingEnabled(current.marketing);
        setHasDecision(true);
      }
      setShowSettings(true);
      setIsOpen(true);
    };

    const onConsentUpdated = () => {
      const current = getStoredCookieConsent();
      if (!current) return;
      setAnalyticsEnabled(current.analytics);
      setMarketingEnabled(current.marketing);
      setHasDecision(true);
    };

    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences);
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);

    return () => {
      window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, openPreferences);
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onConsentUpdated);
    };
  }, []);

  return (
    <>
      {hasDecision && !isOpen ? (
        <button
          type="button"
          onClick={() => {
            setShowSettings(true);
            setIsOpen(true);
          }}
          className="fixed bottom-4 left-4 z-[70] rounded-full border border-gray-200 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg backdrop-blur hover:bg-white"
        >
          {copy.manageFloating}
        </button>
      ) : null}

      {isOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-5">
          <div className="mx-auto w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-brandPrimary">{copy.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{copy.description}</p>
            <p className="mt-2 text-sm text-slate-600">
              {copy.policyPrefix}{" "}
              <Link
                href="/legal/cookies"
                className="font-semibold text-brandSecondary hover:underline"
              >
                {copy.policyLink}
              </Link>
              .
            </p>

            {showSettings ? (
              <div className="mt-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  {copy.settingsTitle}
                </h3>

                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm text-slate-700">{copy.requiredLabel}</p>
                  <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                    {copy.alwaysActive}
                  </span>
                </div>

                <Toggle
                  label={copy.analyticsLabel}
                  enabled={analyticsEnabled}
                  onToggle={() => setAnalyticsEnabled((value) => !value)}
                  onLabel={copy.on}
                  offLabel={copy.off}
                />
                <Toggle
                  label={copy.marketingLabel}
                  enabled={marketingEnabled}
                  onToggle={() => setMarketingEnabled((value) => !value)}
                  onLabel={copy.on}
                  offLabel={copy.off}
                />
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => applyConsent(false, false)}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-gray-100"
              >
                {copy.rejectAll}
              </button>

              {showSettings ? (
                <button
                  type="button"
                  onClick={() =>
                    applyConsent(analyticsEnabled, marketingEnabled)
                  }
                  className="rounded-full bg-brandPrimary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brandPrimary/90"
                >
                  {copy.save}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  className="rounded-full border border-brandPrimary px-4 py-2 text-sm font-semibold text-brandPrimary transition-colors hover:bg-brandPrimary/5"
                >
                  {copy.configure}
                </button>
              )}

              <button
                type="button"
                onClick={() => applyConsent(true, true)}
                className="rounded-full bg-brandSecondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brandSecondary/90"
              >
                {copy.acceptAll}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

