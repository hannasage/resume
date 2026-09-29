import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import sitemap from "../sitemap";

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

describe("sitemap", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sitemap-test-"));
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

  it("lists home and blog with zero posts", async () => {
    const entries = await sitemap();

    expect(entries.map((e) => e.url)).toEqual(["https://hannasage.love", "https://hannasage.love/blog"]);
  });

  it("lists a post the current site is permitted to show", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "a-post.md", {
      title: "A post",
      excerpt: "e",
      heroImage: { url: "/hero.png", alt: "Hero" },
      publishedAt: "2026-03-01",
      sites: ["hannasage.love"],
      canonicalSite: "hannasage.love",
    });

    const entries = await sitemap();

    expect(entries.map((e) => e.url)).toContain("https://hannasage.love/blog/a-post");
  });

  it("omits a post not permitted for the current site", async () => {
    writePost(path.join(tmpDir, "content", "blog"), "other-site.md", {
      title: "Other site post",
      excerpt: "e",
      heroImage: { url: "/hero.png", alt: "Hero" },
      publishedAt: "2026-03-01",
      sites: ["example-brand.example"],
      canonicalSite: "example-brand.example",
    });

    const entries = await sitemap();

    expect(entries.map((e) => e.url)).toEqual(["https://hannasage.love", "https://hannasage.love/blog"]);
  });
});
