import { useEffect, useState } from "react";

const LAST_LOGO_KEY = "kiosk-last-logo-url";

/**
 * Returns the logo URL to display, persisting it in localStorage so it
 * survives a page reload even when the auth store hasn't hydrated yet.
 * Image caching is handled by the browser's HTTP cache (no timestamp on URL).
 */
export function useLogoCache(logoUrl: string | null): string | null {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem(LAST_LOGO_KEY, logoUrl);
      setDisplayUrl(logoUrl);
    } else {
      const stored = localStorage.getItem(LAST_LOGO_KEY);
      if (stored) setDisplayUrl(stored);
    }
  }, [logoUrl]);

  return displayUrl;
}
