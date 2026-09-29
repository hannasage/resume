import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogPostPage from "../page";

// See app/blog/__tests__/page.test.tsx for the tradeoff behind calling
// the server component function directly instead of exercising Next's
// full rendering pipeline.
describe("BlogPostPage", () => {
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  afterEach(() => {
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
