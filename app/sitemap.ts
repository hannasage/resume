import type { MetadataRoute } from "next";
import { getContentSource, getCurrentSiteId } from "@/app/lib/blog";

const BASE_URL = "https://hannasage.love";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteId = getCurrentSiteId();
  const posts = await getContentSource().listPosts(siteId);

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
