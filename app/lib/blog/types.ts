/**
 * Shared post shape for the multi-site blog backend.
 *
 * `sites` and `canonicalSite` are the default answers to two open
 * questions about the shared blog architecture (see the project's
 * ROADMAP.md). They are deliberately simple and swappable:
 *
 * - `sites`: a flat array of site identifiers a post is permitted to
 *   show on. The alternative considered was a boolean flag per site
 *   (one tag per site); an array was chosen because it reads directly
 *   as a permission list and needs no schema change when a new site
 *   is added.
 * - `canonicalSite`: a single field on the post naming which site owns
 *   the canonical URL. The alternatives considered were "whichever
 *   site published first" (requires tracking publish order per site)
 *   or a hardcoded site (does not generalize). An explicit field keeps
 *   the choice visible and per-post.
 *
 * Both are placeholders pending a real decision from the project
 * owner; nothing downstream assumes they are final.
 */
export interface HeroImage {
  url: string;
  alt: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  heroImage: HeroImage;
  publishedAt: string;
  /** Site identifiers permitted to show this post. */
  sites: string[];
  /** The site identifier that owns this post's canonical URL. */
  canonicalSite: string;
}

/**
 * A content backend for the shared blog. Implementations return only
 * the posts a given site is permitted to show.
 */
export interface ContentSource {
  listPosts(siteId: string): Promise<Post[]>;
  getPost(siteId: string, slug: string): Promise<Post | null>;
}
