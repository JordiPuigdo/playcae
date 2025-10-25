// src/app/_components/ScrollTop.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollTop() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    // Evita cualquier animación
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    // Accesibilidad: enfoca el <main> si existe
    const main = document.querySelector("main");
    if (main) (main as HTMLElement).focus?.();
  }, [pathname, search?.toString()]);

  return null;
}
