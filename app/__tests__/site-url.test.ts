import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { SITE_URL } from "@/app/lib/site";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { GET as rssGet } from "@/app/blog/rss.xml/route";

// app/layout.tsx imports next/font/google, which only resolves under
// Next's own bundler, not plain Vite/vitest. It cannot be imported here,
// so this checks its source text instead of its exported metadata.
const LAYOUT_SOURCE = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");

function originsIn(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s"'/<>)]+/g) ?? [];
  return [...new Set(matches)];
}

describe("SITE_URL is the single source of the site's origin", () => {
  it("layout.tsx builds metadataBase from SITE_URL, not a literal", () => {
    expect(LAYOUT_SOURCE).toContain("new URL(SITE_URL)");
    expect(originsIn(LAYOUT_SOURCE)).toEqual([]);
  });

  it("sitemap only emits URLs under SITE_URL", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith(SITE_URL)).toBe(true);
    }
    expect(originsIn(urls.join(" "))).toEqual([SITE_URL]);
  });

  it("robots only points its sitemap field at SITE_URL", () => {
    const result = robots();
    const sitemapUrls = ([] as string[]).concat(result.sitemap ?? []);

    expect(originsIn(sitemapUrls.join(" "))).toEqual([SITE_URL]);
  });

  it("the RSS feed only carries SITE_URL as an origin", async () => {
    const response = await rssGet();
    const xml = await response.text();

    expect(xml).toContain(SITE_URL);
    expect(originsIn(xml)).toEqual([SITE_URL]);
  });
});

describe("RSS feed with a mocked content directory", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "site-url-test-"));
    fs.mkdirSync(path.join(tmpDir, "content", "blog"), { recursive: true });
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
    delete process.env.NEXT_PUBLIC_SITE_ID;
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalSiteId === undefined) delete process.env.NEXT_PUBLIC_SITE_ID;
    else process.env.NEXT_PUBLIC_SITE_ID = originalSiteId;
  });

  it("still carries only SITE_URL once a post exists", async () => {
    const dir = path.join(tmpDir, "content", "blog");
    const lines = [
      "---",
      'title: "A post"',
      'excerpt: "e"',
      "heroImage:",
      '  url: "/hero.png"',
      '  alt: "Hero"',
      'publishedAt: "2026-01-01"',
      "sites:",
      "  - hannasage.love",
      "canonicalSite: hannasage.love",
      "---",
      "Body.",
    ];
    fs.writeFileSync(path.join(dir, "a-post.md"), lines.join("\n"), "utf8");

    const response = await rssGet();
    const xml = await response.text();

    expect(originsIn(xml)).toEqual([SITE_URL]);
  });
});
