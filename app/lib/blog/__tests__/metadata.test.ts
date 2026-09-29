import { describe, it, expect } from "vitest";
import { buildPostMetadata } from "../metadata";
import type { Post } from "../types";

function post(overrides: Partial<Post> = {}): Post {
  return {
    slug: "a-post",
    title: "A post",
    excerpt: "An excerpt.",
    body: "Body text.",
    heroImage: { url: "/hero.png", alt: "A hero image" },
    publishedAt: "2026-01-01",
    sites: ["hannasage.love"],
    canonicalSite: "hannasage.love",
    ...overrides,
  };
}

describe("buildPostMetadata", () => {
  it("sets title, description, and a canonical URL built from canonicalSite", () => {
    const metadata = buildPostMetadata(post({ canonicalSite: "example-brand.example" }));

    expect(metadata.title).toBe("A post");
    expect(metadata.description).toBe("An excerpt.");
    expect(metadata.alternates?.canonical).toBe("https://example-brand.example/blog/a-post");
  });

  it("uses the post's hero image for Open Graph and Twitter when it has one", () => {
    const metadata = buildPostMetadata(post({ heroImage: { url: "/hero.png", alt: "A hero image" } }));

    expect(metadata.openGraph?.images).toEqual([{ url: "/hero.png", alt: "A hero image" }]);
    expect(metadata.twitter?.images).toEqual(["/hero.png"]);
  });

  it("falls back to the site default image when a post has none", () => {
    const metadata = buildPostMetadata(post({ heroImage: { url: "", alt: "" } }));

    expect(metadata.openGraph?.images).toEqual([
      { url: "/opengraph-image", alt: "Hanna Sage — Software Engineer & AI Enthusiast" },
    ]);
    expect(metadata.twitter?.images).toEqual(["/opengraph-image"]);
  });
});
