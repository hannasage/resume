import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { LocalContentSource } from "../local-source";

function writePost(dir: string, fileName: string, frontmatter: Record<string, unknown>, body = "Body text.") {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${item}`);
    } else if (value && typeof value === "object") {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        lines.push(`  ${k}: "${v}"`);
      }
    } else {
      lines.push(`${key}: "${value}"`);
    }
  }
  lines.push("---", body);
  fs.writeFileSync(path.join(dir, fileName), lines.join("\n"), "utf8");
}

describe("LocalContentSource", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-test-"));
    fs.mkdirSync(path.join(tmpDir, "content", "blog"), { recursive: true });
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns a post only for a site listed in its sites array", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "single-site.md", {
      title: "Single site post",
      excerpt: "Only on one site.",
      heroImage: { url: "/hero.png", alt: "Hero" },
      publishedAt: "2026-01-01",
      sites: ["site-a"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();

    const siteAPosts = await source.listPosts("site-a");
    expect(siteAPosts).toHaveLength(1);
    expect(siteAPosts[0].slug).toBe("single-site");

    const siteBPosts = await source.listPosts("site-b");
    expect(siteBPosts).toHaveLength(0);
  });

  it("returns a post for every site listed in a multi-site post", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "shared.md", {
      title: "Shared post",
      excerpt: "On two sites.",
      heroImage: { url: "/hero.png", alt: "Hero" },
      publishedAt: "2026-01-02",
      sites: ["site-a", "site-b"],
      canonicalSite: "example-brand.example",
    });

    const source = new LocalContentSource();

    expect(await source.listPosts("site-a")).toHaveLength(1);
    expect(await source.listPosts("site-b")).toHaveLength(1);
    expect(await source.listPosts("site-c")).toHaveLength(0);
  });

  it("sorts posts by publishedAt, most recent first", async () => {
    const dir = path.join(tmpDir, "content", "blog");
    writePost(dir, "older.md", {
      title: "Older",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["site-a"],
      canonicalSite: "hannasage.love",
    });
    writePost(dir, "newer.md", {
      title: "Newer",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-02-01",
      sites: ["site-a"],
      canonicalSite: "hannasage.love",
    });

    const posts = await new LocalContentSource().listPosts("site-a");
    expect(posts.map((p) => p.slug)).toEqual(["newer", "older"]);
  });

  it("getPost returns null when the post is not permitted for the site", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "restricted.md", {
      title: "Restricted",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["site-a"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    expect(await source.getPost("site-b", "restricted")).toBeNull();
    expect(await source.getPost("site-a", "restricted")).not.toBeNull();
  });

  it("getPost returns null for a missing slug", async () => {
    const source = new LocalContentSource();
    expect(await source.getPost("site-a", "does-not-exist")).toBeNull();
  });

  it("returns an empty list when the content directory does not exist", async () => {
    fs.rmSync(path.join(tmpDir, "content"), { recursive: true, force: true });
    const source = new LocalContentSource();
    expect(await source.listPosts("site-a")).toEqual([]);
  });

  it("throws a clear error when required frontmatter is missing", async () => {
    const dir = path.join(tmpDir, "content", "blog");
    fs.writeFileSync(
      path.join(dir, "broken.md"),
      ["---", 'excerpt: "no title here"', "---", "Body"].join("\n"),
      "utf8",
    );

    const source = new LocalContentSource();
    await expect(source.listPosts("site-a")).rejects.toThrow(/title/);
  });

  it("falls back to the file name for slug when frontmatter has none", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "my-post.md", {
      title: "My post",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["site-a"],
      canonicalSite: "hannasage.love",
    });

    const post = await new LocalContentSource().getPost("site-a", "my-post");
    expect(post?.slug).toBe("my-post");
  });

  it("throws when canonicalSite is not a known site", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bad-canonical.md", {
      title: "Bad canonical",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "not-a-real-site.example",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/canonicalSite/);
  });

  it("throws when heroImage.url is neither https nor a site-relative path", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bad-image.md", {
      title: "Bad image",
      excerpt: "e",
      heroImage: { url: "ftp://example.com/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/heroImage\.url/);
  });

  it("throws when a protocol-relative heroImage.url points off-site", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "protocol-relative.md", {
      title: "Protocol relative",
      excerpt: "e",
      heroImage: { url: "//evil.example/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/heroImage\.url/);
  });

  it("throws when heroImage.url contains a backslash (single)", async () => {
    // Single-quoted YAML so the backslash reaches the parser literally,
    // instead of being read as a double-quoted-string escape sequence.
    const raw = [
      "---",
      'title: "Backslash single"',
      'excerpt: "e"',
      "heroImage:",
      "  url: '/\\evil.example.com/x.jpg'",
      '  alt: "a"',
      'publishedAt: "2026-01-01"',
      "sites:",
      "  - hannasage.love",
      'canonicalSite: "hannasage.love"',
      "---",
      "Body.",
    ].join("\n");
    fs.writeFileSync(path.join(tmpDir, "content", "blog", "backslash-single.md"), raw, "utf8");

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/backslash/i);
  });

  it("throws when heroImage.url contains a backslash (double)", async () => {
    const raw = [
      "---",
      'title: "Backslash double"',
      'excerpt: "e"',
      "heroImage:",
      "  url: '/\\\\evil.example.com/x.jpg'",
      '  alt: "a"',
      'publishedAt: "2026-01-01"',
      "sites:",
      "  - hannasage.love",
      'canonicalSite: "hannasage.love"',
      "---",
      "Body.",
    ].join("\n");
    fs.writeFileSync(path.join(tmpDir, "content", "blog", "backslash-double.md"), raw, "utf8");

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/backslash/i);
  });

  it("rejects an absolute https URL written without // (https:host)", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "scheme-only.md", {
      title: "Scheme only",
      excerpt: "e",
      heroImage: { url: "https:host", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/heroImage\.url/);
  });

  it("allows an absolute https URL on this deployment's own host", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "own-host.md", {
      title: "Own host",
      excerpt: "e",
      heroImage: { url: "https://hannasage.love/hero.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    const posts = await source.listPosts("hannasage.love");
    expect(posts[0].heroImage?.url).toBe("https://hannasage.love/hero.png");
  });

  it("rejects an absolute https URL on a host outside the allowed list", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "off-allowlist.md", {
      title: "Off allowlist",
      excerpt: "e",
      heroImage: { url: "https://evil.example/hero.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/heroImage\.url/);
  });

  it("parses a post with no heroImage frontmatter field, leaving heroImage undefined", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "no-hero.md", {
      title: "No hero image",
      excerpt: "e",
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const posts = await new LocalContentSource().listPosts("hannasage.love");
    expect(posts).toHaveLength(1);
    expect(posts[0].heroImage).toBeUndefined();
  });

  it("throws when publishedAt is not strict ISO 8601", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bad-date.md", {
      title: "Bad date",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "not-a-date",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/publishedAt/);
  });

  it('rejects a non-ISO date phrase like "March 7"', async () => {
    writePost(path.join(tmpDir, "content", "blog"), "march-seven.md", {
      title: "March seven",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "March 7",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/publishedAt/);
  });

  it('rejects a bare number like "1"', async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bare-number.md", {
      title: "Bare number",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "1",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/publishedAt/);
  });

  it("rejects a calendar-invalid ISO date such as 2026-02-30", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "invalid-calendar-date.md", {
      title: "Invalid calendar date",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-02-30",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/publishedAt/);
  });

  it("rejects an out-of-range timezone offset such as +99:99", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bad-offset.md", {
      title: "Bad offset",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01T09:00:00+99:99",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/publishedAt/);
  });

  it("accepts a strict ISO 8601 date with a time and a zone", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "with-time.md", {
      title: "With time",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01T09:30:00Z",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const posts = await new LocalContentSource().listPosts("hannasage.love");
    expect(posts[0].publishedAt).toBe("2026-01-01T09:30:00Z");
  });

  it("throws when the slug contains characters outside [a-z0-9-]", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "bad-slug.md", {
      title: "Bad slug",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
      slug: "Bad Slug!",
    });

    const source = new LocalContentSource();
    await expect(source.listPosts("hannasage.love")).rejects.toThrow(/slug/);
  });
});
