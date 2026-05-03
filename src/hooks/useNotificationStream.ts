"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "./useNotificationStore";
import { useAuthStore } from "./useAuthStore";
import { UserNotification } from "@/types/notification";

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
}

export function useNotificationStream(enabled: boolean) {
  const { addNotification, fetchUnreadCount } = useNotificationStore();
  const expiresAt = useAuthStore((s) => s.expiresAt);
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!expiresAt || Date.now() > expiresAt) return;

    const token = getStoredToken();
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_PLAYCAE_API ?? "";
    const url = `${apiUrl}/api/notifications/stream?token=${encodeURIComponent(token)}`;

    let retryTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      const source = new EventSource(url);
      sourceRef.current = source;

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string) as { type?: string } & UserNotification;
          if (data.type === "connected") return;
          addNotification(data);
        } catch {
          // Malformed message — ignore
        }
      };

      source.onerror = () => {
        source.close();
        sourceRef.current = null;
        // Reconnect after 5s on error
        retryTimeout = setTimeout(connect, 5000);
      };
    }

    connect();

    // Fetch current unread count on mount
    fetchUnreadCount();

    return () => {
      clearTimeout(retryTimeout);
      sourceRef.current?.close();
      sourceRef.current = null;
    };
  }, [enabled, expiresAt, addNotification, fetchUnreadCount]);
}
