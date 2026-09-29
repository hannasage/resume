import type { ContentSource } from "./types";
import { LocalContentSource } from "./local-source";
import { SanityContentSource } from "./sanity-source";
import { SITE_URL } from "../site";

export type { ContentSource, Post, HeroImage } from "./types";

/**
 * Selects the active content source. Defaults to the local filesystem
 * source when `BLOG_CONTENT_SOURCE` is unset, so `npm run dev` works
 * out of the box with no environment file at all. Setting
 * `BLOG_CONTENT_SOURCE=sanity` opts into the Sanity stub, which itself
 * requires every `SANITY_*` env var to be set before it can be used.
 */
export function getContentSource(): ContentSource {
  const source = process.env.BLOG_CONTENT_SOURCE ?? "local";

  switch (source) {
    case "sanity":
      return new SanityContentSource();
    case "local":
      return new LocalContentSource();
    default:
      throw new Error(
        `Unknown BLOG_CONTENT_SOURCE "${source}". Expected "local" or "sanity".`,
      );
  }
}

/** The site identifier for this deployment, used to filter posts by permission. */
export function getCurrentSiteId(): string {
  return process.env.NEXT_PUBLIC_SITE_ID ?? new URL(SITE_URL).host;
}
