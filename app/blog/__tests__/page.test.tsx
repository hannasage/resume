import { describe, it, expect, afterEach } from "vitest";
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
describe("BlogIndexPage", () => {
  const originalSiteId = process.env.NEXT_PUBLIC_SITE_ID;

  afterEach(() => {
    if (originalSiteId === undefined) delete process.env.NEXT_PUBLIC_SITE_ID;
    else process.env.NEXT_PUBLIC_SITE_ID = originalSiteId;
  });

  it("renders the posts permitted for the default site", async () => {
    delete process.env.NEXT_PUBLIC_SITE_ID;
    const element = await BlogIndexPage();
    render(element);

    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Welcome to the blog")).toBeInTheDocument();
    expect(screen.getByText("One post, two sites")).toBeInTheDocument();
  });

  it("renders an empty state for a site with no permitted posts", async () => {
    process.env.NEXT_PUBLIC_SITE_ID = "a-site-with-no-posts";
    const element = await BlogIndexPage();
    render(element);

    expect(screen.getByText("No posts yet.")).toBeInTheDocument();
  });
});
