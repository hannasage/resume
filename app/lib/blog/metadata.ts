import type { Metadata } from "next";
import type { Post } from "./types";

/** The site's own default share image, used when a post has no hero image. */
const DEFAULT_IMAGE = "/opengraph-image";
const DEFAULT_IMAGE_ALT = "Hanna Sage — Software Engineer & AI Enthusiast";

/**
 * Builds the `Metadata` for one blog post: title, description, a
 * canonical URL built from `canonicalSite`, and Open Graph and Twitter
 * images from `heroImage`. Falls back to the site default image when a
 * post has none.
 */
export function buildPostMetadata(post: Post): Metadata {
  const canonicalUrl = `https://${post.canonicalSite}/blog/${post.slug}`;
  const imageUrl = post.heroImage?.url || DEFAULT_IMAGE;
  const imageAlt = post.heroImage?.url ? post.heroImage.alt : DEFAULT_IMAGE_ALT;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  };
}
