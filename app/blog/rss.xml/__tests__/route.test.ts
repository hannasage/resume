import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GET } from "../route";

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

describe("GET /blog/rss.xml", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rss-test-"));
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

  it("serves a valid RSS 2.0 channel with zero posts", async () => {
    const response = await GET();
    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toContain("application/rss+xml");
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).not.toContain("<item>");
  });

  it("lists permitted posts newest first", async () => {
    const dir = path.join(tmpDir, "content", "blog");
    writePost(dir, "older.md", {
      title: "Older post",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });
    writePost(dir, "newer.md", {
      title: "Newer post",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-02-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const response = await GET();
    const xml = await response.text();

    const newerIndex = xml.indexOf("Newer post");
    const olderIndex = xml.indexOf("Older post");
    expect(newerIndex).toBeGreaterThan(-1);
    expect(olderIndex).toBeGreaterThan(-1);
    expect(newerIndex).toBeLessThan(olderIndex);
    expect(xml).toContain("https://hannasage.love/blog/newer");
  });

  it("omits a post not permitted for the current site", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "other-site.md", {
      title: "Other site post",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-01-01",
      sites: ["example-brand.example"],
      canonicalSite: "example-brand.example",
    });

    const response = await GET();
    const xml = await response.text();

    expect(xml).not.toContain("Other site post");
  });
});
