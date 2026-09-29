import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/scroll-world-preview"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
