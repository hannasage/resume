import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SanityContentSource } from "../sanity-source";

const SANITY_ENV_VARS = [
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_TOKEN",
  "SANITY_API_VERSION",
] as const;

describe("SanityContentSource", () => {
  const originalEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of SANITY_ENV_VARS) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of SANITY_ENV_VARS) {
      if (originalEnv[key] === undefined) delete process.env[key];
      else process.env[key] = originalEnv[key];
    }
  });

  it("throws a clear error from listPosts when no env vars are set", async () => {
    const source = new SanityContentSource();
    await expect(source.listPosts("site-a")).rejects.toThrow(/not configured/i);
  });

  it("throws a clear error from getPost when no env vars are set", async () => {
    const source = new SanityContentSource();
    await expect(source.getPost("site-a", "some-slug")).rejects.toThrow(/not configured/i);
  });

  it("names every missing variable in the error message", async () => {
    process.env.SANITY_PROJECT_ID = "test-project";
    const source = new SanityContentSource();
    await expect(source.listPosts("site-a")).rejects.toThrow(
      /SANITY_DATASET[\s\S]*SANITY_API_TOKEN[\s\S]*SANITY_API_VERSION/,
    );
  });

  it("still refuses to proceed even with every env var set, since it is a stub", async () => {
    process.env.SANITY_PROJECT_ID = "test-project";
    process.env.SANITY_DATASET = "production";
    process.env.SANITY_API_TOKEN = "not-a-real-token";
    process.env.SANITY_API_VERSION = "2024-01-01";

    const source = new SanityContentSource();
    await expect(source.listPosts("site-a")).rejects.toThrow(/stub/i);
  });
});
