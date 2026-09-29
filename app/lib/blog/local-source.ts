import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentSource, Post } from "./types";
import { KNOWN_SITES } from "./types";
import { SITE_URL } from "../site";

const SLUG_PATTERN = /^[a-z0-9-]+$/;
const SITE_ORIGIN = new URL(SITE_URL).origin;

// A list, not a single string: this deployment's own host is the only
// entry today, but a future trusted image host (for example a CDN) can
// join it without loosening the check to "any https host".
const ALLOWED_IMAGE_HOSTS: readonly string[] = [new URL(SITE_URL).host];

function contentDir(): string {
  return path.join(process.cwd(), "content", "blog");
}

function assertString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Post frontmatter in ${file} is missing required field "${field}"`);
  }
  return value;
}

// Date.parse accepts far more than ISO 8601 ("March 7", "1"), and it
// silently rolls an out-of-range day or month into the next one instead
// of rejecting it. Match the ISO 8601 shape first, then check the
// calendar fields by hand.
const ISO_8601_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))?)?$/;

function assertPublishedAt(value: string, file: string): string {
  const invalid = () =>
    new Error(
      `Post frontmatter in ${file} has an invalid publishedAt "${value}". It must be strict ISO 8601, for example "2026-01-01" or "2026-01-01T09:00:00Z".`,
    );

  const match = ISO_8601_PATTERN.exec(value);
  if (!match) {
    throw invalid();
  }

  const [, year, month, day, hour, minute, second, offsetHour, offsetMinute] = match;
  const monthNum = Number(month);
  const dayNum = Number(day);
  if (monthNum < 1 || monthNum > 12) {
    throw invalid();
  }
  const daysInMonth = new Date(Number(year), monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) {
    throw invalid();
  }
  if (hour !== undefined && (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59)) {
    throw invalid();
  }
  if (offsetHour !== undefined && (Number(offsetHour) > 23 || Number(offsetMinute) > 59)) {
    throw invalid();
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

  // The WHATWG URL parser accepts "https:host" (no //) as a valid
  // absolute URL, either normalizing it to "https://host/" on its own,
  // or - when given SITE_URL as a base whose scheme also happens to be
  // "https:" - silently folding it into a same-origin relative path.
  // Reject any value with a scheme prefix that is not the literal
  // "https://" before either parse is attempted.
  const hasSchemePrefix = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
  const isAbsolute = value.startsWith("https://");
  if (hasSchemePrefix && !isAbsolute) {
    throw new Error(
      `Post frontmatter in ${file} has an invalid heroImage.url "${value}". An absolute URL must start with "https://".`,
    );
  }

  let resolved: URL;
  if (isAbsolute) {
    try {
      resolved = new URL(value);
    } catch {
      throw new Error(`Post frontmatter in ${file} has an invalid heroImage.url "${value}".`);
    }
  } else {
    try {
      resolved = new URL(value, SITE_URL);
    } catch {
      throw new Error(`Post frontmatter in ${file} has an invalid heroImage.url "${value}".`);
    }
  }

  const valid = isAbsolute
    ? ALLOWED_IMAGE_HOSTS.includes(resolved.host)
    : resolved.origin === SITE_ORIGIN;
  if (!valid) {
    throw new Error(
      `Post frontmatter in ${file} has an invalid heroImage.url "${value}". It must be an https:// URL on an allowed host or a path under /public.`,
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

  const sites = Array.isArray(data.sites) ? data.sites.filter((s): s is string => typeof s === "string") : [];
  const heroImage = data.heroImage
    ? {
        url: assertHeroImageUrl(assertString(data.heroImage.url, "heroImage.url", fileName), fileName),
        alt: assertString(data.heroImage.alt, "heroImage.alt", fileName),
      }
    : undefined;

  return {
    slug,
    title: assertString(data.title, "title", fileName),
    excerpt: assertString(data.excerpt, "excerpt", fileName),
    body: content.trim(),
    heroImage,
    publishedAt: assertPublishedAt(assertString(data.publishedAt, "publishedAt", fileName), fileName),
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
