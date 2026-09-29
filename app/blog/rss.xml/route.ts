import { NextResponse } from "next/server";
import { getContentSource, getCurrentSiteId } from "@/app/lib/blog";
import { SITE_URL } from "@/app/lib/site";

// XML 1.0 forbids these control characters outright; no amount of
// escaping makes them legal, so strip them before escaping the rest.
const XML_ILLEGAL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

function escapeXml(value: string): string {
  return value
    .replace(XML_ILLEGAL_CHARS, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteId = getCurrentSiteId();
  const posts = await getContentSource().listPosts(siteId);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join("");

  const feedUrl = `${SITE_URL}/blog/rss.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hanna Sage</title>
    <link>${SITE_URL}</link>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <description>Posts from Hanna Sage.</description>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
