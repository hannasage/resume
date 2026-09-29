import type { MetadataRoute } from "next";
import { getContentSource, getCurrentSiteId } from "@/app/lib/blog";
import { SITE_URL } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteId = getCurrentSiteId();
  const posts = await getContentSource().listPosts(siteId);

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
