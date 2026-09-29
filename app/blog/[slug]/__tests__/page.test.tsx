import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { render, screen } from "@testing-library/react";
import BlogPostPage from "../page";

// See app/blog/__tests__/page.test.tsx for the tradeoff behind calling
// the server component function directly instead of exercising Next's
// full rendering pipeline, and for why posts are seeded from fixtures
// into a mocked cwd rather than read from production content.
const FIXTURES_DIR = path.join(__dirname, "..", "..", "__tests__", "fixtures");

function seedFixtures(tmpDir: string) {
  const dest = path.join(tmpDir, "content", "blog");
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(FIXTURES_DIR)) {
    fs.copyFileSync(path.join(FIXTURES_DIR, file), path.join(dest, file));
  }
}

describe("BlogPostPage", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-slug-page-test-"));
    seedFixtures(tmpDir);
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
  });

  afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalSiteId === undefined) delete process.env.NEXT_PUBLIC_SITE_ID;
    else process.env.NEXT_PUBLIC_SITE_ID = originalSiteId;
  });

  it("renders a post that is permitted for the default site", async () => {
    delete process.env.NEXT_PUBLIC_SITE_ID;
    const element = await BlogPostPage({ params: Promise.resolve({ slug: "welcome-to-the-blog" }) });
    render(element);

    expect(screen.getByRole("heading", { name: "Welcome to the blog" })).toBeInTheDocument();
  });

  it("calls notFound() for a slug that does not exist", async () => {
    delete process.env.NEXT_PUBLIC_SITE_ID;
    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: "does-not-exist" }) }),
    ).rejects.toThrow();
  });

  it("calls notFound() for a post not permitted on the current site", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "a-site-with-no-posts";
    await expect(
      BlogPostPage({ params: Promise.resolve({ slug: "welcome-to-the-blog" }) }),
    ).rejects.toThrow();
  });
});
