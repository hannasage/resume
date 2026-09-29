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
      canonicalSite: "site-a",
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
      canonicalSite: "site-b",
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
      canonicalSite: "site-a",
    });
    writePost(dir, "newer.md", {
      title: "Newer",
      excerpt: "e",
      heroImage: { url: "/a.png", alt: "a" },
      publishedAt: "2026-02-01",
      sites: ["site-a"],
      canonicalSite: "site-a",
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
      canonicalSite: "site-a",
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
      canonicalSite: "site-a",
    });

    const post = await new LocalContentSource().getPost("site-a", "my-post");
    expect(post?.slug).toBe("my-post");
  });
});
