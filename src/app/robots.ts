// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api", "/admin", "/privacy-preview"],
    },
    sitemap: "https://playcae.com/sitemap.xml",
  };
}
