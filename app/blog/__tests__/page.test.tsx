import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { render, screen } from "@testing-library/react";
import BlogIndexPage from "../page";

// Next 15 App Router server components are plain async functions that
// return JSX. React Testing Library has no built-in support for
// rendering an async server component tree with data fetching and
// suspense boundaries resolved. The pragmatic approach used here -
// standard in early Next 15 App Router test setups - is to call the
// component function directly, await its result, and render the
// resolved element. This does not exercise Next's own server
// rendering pipeline (streaming, suspense boundaries, notFound()
// integration with the App Router), but it does exercise every bit of
// this project's own logic: data loading, filtering, and markup.
//
// The site launches with no posts in content/blog (decision 2 = C), so
// tests that need posts seed them into a mocked cwd from fixtures
// instead of relying on production content.
const FIXTURES_DIR = path.join(__dirname, "fixtures");

function seedFixtures(tmpDir: string) {
  const dest = path.join(tmpDir, "content", "blog");
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(FIXTURES_DIR)) {
    fs.copyFileSync(path.join(FIXTURES_DIR, file), path.join(dest, file));
  }
}

describe("BlogIndexPage", () => {
  let tmpDir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn> | undefined;
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "blog-page-test-"));
  });

  afterEach(() => {
    cwdSpy?.mockRestore();
    cwdSpy = undefined;
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalSiteId === undefined) delete process.env.NEXT_PUBLIC_SITE_ID;
    else process.env.NEXT_PUBLIC_SITE_ID = originalSiteId;
  });

  it("renders the posts permitted for the default site", async () => {
    seedFixtures(tmpDir);
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
    delete process.env.NEXT_PUBLIC_SITE_ID;

    const element = await BlogIndexPage();
    render(element);

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Welcome to the blog")).toBeInTheDocument();
    expect(screen.getByText("One post, two sites")).toBeInTheDocument();
  });

  it("renders an empty state for a site with no permitted posts", async () => {
    seedFixtures(tmpDir);
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
    process.env.NEXT_PUBLIC_SITE_ID = "a-site-with-no-posts";

    const element = await BlogIndexPage();
    render(element);

    expect(screen.getByText("No posts yet.")).toBeInTheDocument();
  });

  it("renders the launch empty state, with real content/blog holding zero posts", async () => {
    delete process.env.NEXT_PUBLIC_SITE_ID;

    const element = await BlogIndexPage();
    render(element);

    expect(screen.getByText("No posts yet.")).toBeInTheDocument();
  });
});
