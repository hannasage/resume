import { describe, it, expect } from "vitest";
import { buildPostMetadata } from "../metadata";
import type { Post } from "../types";
import { SITE_URL } from "../../site";

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

  it("falls back to the site default image when a post's heroImage is undefined", () => {
    const metadata = buildPostMetadata(post({ heroImage: undefined }));

    expect(metadata.openGraph?.images).toEqual([
      { url: "/opengraph-image", alt: "Hanna Sage — Software Engineer & AI Enthusiast" },
    ]);
    expect(metadata.twitter?.images).toEqual(["/opengraph-image"]);
  });

  it("builds a canonical URL that agrees with SITE_URL's host for the production canonicalSite", () => {
    const metadata = buildPostMetadata(post({ canonicalSite: new URL(SITE_URL).host }));

    expect(new URL(metadata.alternates!.canonical as string).host).toBe(new URL(SITE_URL).host);
  });

  it("sets og:site_name and og:locale on post metadata", () => {
    const metadata = buildPostMetadata(post());

    expect(metadata.openGraph?.siteName).toBe("Hanna Sage");
    expect(metadata.openGraph?.locale).toBe("en_US");
  });
});
