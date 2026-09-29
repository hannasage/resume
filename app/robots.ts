import type { MetadataRoute } from "next";

const BASE_URL = "https://hannasage.love";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/scroll-world-preview"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
