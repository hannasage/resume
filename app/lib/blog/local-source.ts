import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentSource, Post } from "./types";
import { KNOWN_SITES } from "./types";
import { SITE_URL } from "../site";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SITE_ORIGIN = new URL(SITE_URL).origin;

function contentDir(): string {
  return path.join(process.cwd(), "content", "blog");
}

function assertString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Post frontmatter in ${file} is missing required field "${field}"`);
  }
  return value;
}

function assertSlug(value: string, file: string): string {
  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      `Post frontmatter in ${file} has an invalid slug "${value}". A slug may contain only lowercase letters, digits, and hyphens.`,
    );
  }
  return value;
}

function assertKnownSite(value: string, field: string, file: string): string {
  if (!KNOWN_SITES.includes(value)) {
    throw new Error(
      `Post frontmatter in ${file} has an unknown ${field} "${value}". Known sites are: ${KNOWN_SITES.join(", ")}.`,
    );
  }
  return value;
}

function assertHeroImageUrl(value: string, file: string): string {
  // A backslash is not a path separator in a URL, but the WHATWG URL
  // parser (and every browser) treats one as equivalent to a forward
  // slash. "/\evil.example.com/x.jpg" reads as site-relative here but
  // parses as "//evil.example.com/x.jpg", a protocol-relative URL to a
  // different origin. Reject it outright rather than try to normalize it.
  if (value.includes("\\")) {
    throw new Error(
      `Post frontmatter in ${file} has an invalid heroImage.url "${value}". A backslash is not allowed.`,
    );
  }

  let resolved: URL;
  let isAbsolute: boolean;
  try {
    resolved = new URL(value);
    isAbsolute = true;
  } catch {
    isAbsolute = false;
    try {
      resolved = new URL(value, SITE_URL);
    } catch {
      throw new Error(`Post frontmatter in ${file} has an invalid heroImage.url "${value}".`);
    }
  }

  const valid = isAbsolute ? resolved.protocol === "https:" : resolved.origin === SITE_ORIGIN;
  if (!valid) {
    throw new Error(
      `Post frontmatter in ${file} has an invalid heroImage.url "${value}". It must be an https:// URL or a path under /public.`,
    );
  }
  return value;
}

function parsePost(fileName: string, raw: string): Post {
  const { data, content } = matter(raw);
  const rawSlug = typeof data.slug === "string" && data.slug.length > 0
    ? data.slug
    : fileName.replace(/\.md$/, "");
  const slug = assertSlug(rawSlug, fileName);

  const heroImage = data.heroImage ?? {};
  const sites = Array.isArray(data.sites) ? data.sites.filter((s): s is string => typeof s === "string") : [];

  return {
    slug,
    title: assertString(data.title, "title", fileName),
    excerpt: assertString(data.excerpt, "excerpt", fileName),
    body: content.trim(),
    heroImage: {
      url: assertHeroImageUrl(assertString(heroImage.url, "heroImage.url", fileName), fileName),
      alt: assertString(heroImage.alt, "heroImage.alt", fileName),
    },
    publishedAt: assertString(data.publishedAt, "publishedAt", fileName),
    sites,
    canonicalSite: assertKnownSite(assertString(data.canonicalSite, "canonicalSite", fileName), "canonicalSite", fileName),
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
