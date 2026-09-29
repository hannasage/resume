import { describe, it, expect, afterEach } from "vitest";
import { getContentSource, getCurrentSiteId } from "../index";
import { LocalContentSource } from "../local-source";
import { SanityContentSource } from "../sanity-source";

describe("getContentSource", () => {
  const original = process.env.BLOG_CONTENT_SOURCE;

  afterEach(() => {
    if (original === undefined) delete process.env.BLOG_CONTENT_SOURCE;
    else process.env.BLOG_CONTENT_SOURCE = original;
  });

  it("defaults to the local source when BLOG_CONTENT_SOURCE is unset", () => {
    delete process.env.BLOG_CONTENT_SOURCE;
    expect(getContentSource()).toBeInstanceOf(LocalContentSource);
  });

  it("returns the local source when explicitly set to local", () => {
    process.env.BLOG_CONTENT_SOURCE = "local";
    expect(getContentSource()).toBeInstanceOf(LocalContentSource);
  });

  it("returns the sanity source when explicitly set to sanity", () => {
    process.env.BLOG_CONTENT_SOURCE = "sanity";
    expect(getContentSource()).toBeInstanceOf(SanityContentSource);
  });

  it("throws on an unrecognized value", () => {
    process.env.BLOG_CONTENT_SOURCE = "something-else";
    expect(() => getContentSource()).toThrow(/Unknown BLOG_CONTENT_SOURCE/);
  });
});

describe("getCurrentSiteId", () => {
  const original = process.env.NEXT_PUBLIC_SITE_ID;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_ID;
    else process.env.NEXT_PUBLIC_SITE_ID = original;
  });

  it("defaults to hannasage.love when unset", () => {
    delete process.env.NEXT_PUBLIC_SITE_ID;
    expect(getCurrentSiteId()).toBe("hannasage.love");
  });

  it("reads NEXT_PUBLIC_SITE_ID when set", () => {
    process.env.NEXT_PUBLIC_SITE_ID = "example-brand.example";
    expect(getCurrentSiteId()).toBe("example-brand.example");
  });
});
