// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.playcae.com";
  
  // Usar fechas específicas en lugar de 'now' para evitar que Google piense que todo cambia constantemente
  const contentDate = new Date("2025-11-01").toISOString();
  const staticDate = new Date("2025-06-01").toISOString();
  
  return [
    {
      url: `${base}/`,
      lastModified: contentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/servicios`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/servicios/gestion-documentacion-cae`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/servicios/control-accesos-fabrica`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/precios`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/que-es-cae`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/alternativas-software-cae`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/plataformas-cae`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/plataformas-prl`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/plataformas-gestion-documental`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/prl-trabajos-altura`,
      lastModified: contentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contacto`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/blog`,
      lastModified: contentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/legal/aviso-legal`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/privacidad`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/legal/cookies`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
