// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api", "/dashboard", "/onboarding", "/access-control"],
    },
    sitemap: "https://www.playcae.com/sitemap.xml",
  };
}
