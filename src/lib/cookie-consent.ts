export const COOKIE_CONSENT_STORAGE_KEY = "playcae-cookie-consent";
export const COOKIE_CONSENT_COOKIE_NAME = "playcae-cookie-consent";
export const COOKIE_CONSENT_UPDATED_EVENT = "playcae:cookie-consent-updated";
export const COOKIE_PREFERENCES_OPEN_EVENT = "playcae:cookie-preferences-open";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type CookieConsent = {
  version: 1;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;

    if (
      parsed.version !== 1 ||
      parsed.necessary !== true ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return {
      version: 1,
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`)
  );

  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function createCookieConsent(values: {
  analytics: boolean;
  marketing: boolean;
}): CookieConsent {
  return {
    version: 1,
    necessary: true,
    analytics: values.analytics,
    marketing: values.marketing,
    updatedAt: new Date().toISOString(),
  };
}

export function getStoredCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  const fromStorage = parseConsent(
    window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  );
  if (fromStorage) return fromStorage;

  const fromCookie = parseConsent(getCookieValue(COOKIE_CONSENT_COOKIE_NAME));
  if (!fromCookie) return null;

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify(fromCookie)
  );

  return fromCookie;
}

export function saveCookieConsent(consent: CookieConsent): void {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(consent);
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serialized);
  document.cookie =
    `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; ` +
    `path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;

  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: consent })
  );
}

export function openCookiePreferences(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_PREFERENCES_OPEN_EVENT));
}
