import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentSource, Post } from "./types";

function contentDir(): string {
  return path.join(process.cwd(), "content", "blog");
}

function assertString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Post frontmatter in ${file} is missing required field "${field}"`);
  }
  return value;
}

function parsePost(fileName: string, raw: string): Post {
  const { data, content } = matter(raw);
  const slug = typeof data.slug === "string" && data.slug.length > 0
    ? data.slug
    : fileName.replace(/\.md$/, "");

  const heroImage = data.heroImage ?? {};
  const sites = Array.isArray(data.sites) ? data.sites.filter((s): s is string => typeof s === "string") : [];

  return {
    slug,
    title: assertString(data.title, "title", fileName),
    excerpt: assertString(data.excerpt, "excerpt", fileName),
    body: content.trim(),
    heroImage: {
      url: assertString(heroImage.url, "heroImage.url", fileName),
      alt: assertString(heroImage.alt, "heroImage.alt", fileName),
    },
    publishedAt: assertString(data.publishedAt, "publishedAt", fileName),
    sites,
    canonicalSite: assertString(data.canonicalSite, "canonicalSite", fileName),
  };
}

function readAllPosts(): Post[] {
  const dir = contentDir();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const posts = files.map((fileName) => {
    const raw = fs.readFileSync(path.join(dir, fileName), "utf8");
    return parsePost(fileName, raw);
  });

  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/**
 * Filesystem-backed content source. Reads Markdown files with YAML
 * frontmatter from `content/blog/*.md`. This is the default source for
 * local development and for any deployment that has not opted into the
 * Sanity-backed source.
 */
export class LocalContentSource implements ContentSource {
  async listPosts(siteId: string): Promise<Post[]> {
    return readAllPosts().filter((post) => post.sites.includes(siteId));
  }

  async getPost(siteId: string, slug: string): Promise<Post | null> {
    const post = readAllPosts().find((p) => p.slug === slug);
    if (!post || !post.sites.includes(siteId)) {
      return null;
    }
    return post;
  }
}
