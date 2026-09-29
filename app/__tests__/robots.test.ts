import { describe, it, expect } from "vitest";
import robots from "../robots";

describe("robots", () => {
  it("allows crawling, disallows the preview route, and names the sitemap", () => {
    const result = robots();

    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/scroll-world-preview"],
    });
    expect(result.sitemap).toBe("https://hannasage.love/sitemap.xml");
  });
});
