import type { ContentSource, Post } from "./types";

const REQUIRED_ENV_VARS = [
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_TOKEN",
  "SANITY_API_VERSION",
] as const;

function readConfig() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `SanityContentSource is not configured: missing ${missing.join(", ")}. ` +
        "Set BLOG_CONTENT_SOURCE=local (or leave it unset) to use the local " +
        "filesystem source instead, or provide all Sanity env vars.",
    );
  }

  return {
    projectId: process.env.SANITY_PROJECT_ID as string,
    dataset: process.env.SANITY_DATASET as string,
    apiToken: process.env.SANITY_API_TOKEN as string,
    apiVersion: process.env.SANITY_API_VERSION as string,
  };
}

/**
 * Placeholder for a Sanity-backed content source. This is a stub: it
 * validates configuration and throws a clear error when it is missing,
 * but it never makes a network call. It exists so the shape of a real
 * Sanity integration is visible without requiring an account, project,
 * or token to build or test this repo.
 *
 * Wiring this up to the real Sanity client is future work, tracked
 * alongside the rest of the shared blog backend.
 */
export class SanityContentSource implements ContentSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- part of the ContentSource interface; unused until the real client lands
  async listPosts(siteId: string): Promise<Post[]> {
    readConfig();
    throw new Error(
      "SanityContentSource.listPosts is a stub and has no real implementation yet.",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- part of the ContentSource interface; unused until the real client lands
  async getPost(siteId: string, slug: string): Promise<Post | null> {
    readConfig();
    throw new Error(
      "SanityContentSource.getPost is a stub and has no real implementation yet.",
    );
  }
}
