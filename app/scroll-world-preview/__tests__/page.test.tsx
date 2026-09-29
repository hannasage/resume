import { describe, it, expect, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import ScrollWorldPreviewPage from "../page";

describe("ScrollWorldPreviewPage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders without throwing outside production", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("SCROLL_WORLD_PREVIEW", "");
    expect(() => render(<ScrollWorldPreviewPage />)).not.toThrow();
  });

  it("renders the ScrollWorld scaffold when SCROLL_WORLD_PREVIEW=1 in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SCROLL_WORLD_PREVIEW", "1");
    const { getByTestId } = render(<ScrollWorldPreviewPage />);
    expect(getByTestId("scroll-world")).toBeInTheDocument();
  });

  it("returns notFound in production without the flag", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("SCROLL_WORLD_PREVIEW", "");
    expect(() => render(<ScrollWorldPreviewPage />)).toThrow();
  });
});
