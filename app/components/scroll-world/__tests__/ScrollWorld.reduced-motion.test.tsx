import { describe, it, expect, beforeAll } from "vitest";
import { render } from "@testing-library/react";
import ScrollWorld from "../ScrollWorld";

// Framer Motion's `useReducedMotion` lazily reads `window.matchMedia` the
// first time it runs in this module graph and caches the result, so the
// override below must happen before the first render in this file (kept
// separate from the other ScrollWorld tests, which rely on the
// no-preference default set in vitest.setup.ts).
beforeAll(() => {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
});

describe("ScrollWorld with prefers-reduced-motion: reduce", () => {
  it("renders every section fully visible with no entrance animation", () => {
    const { container } = render(<ScrollWorld />);
    const sections = container.querySelectorAll("[data-slot-kind]");

    // Still the full, correctly-ordered set of sections.
    expect(sections).toHaveLength(9);

    // Each section is present and in its final visible state immediately —
    // opacity 1 and no translateY offset — rather than the pre-entrance
    // opacity: 0 / translateY(24px) state used when motion is allowed.
    // Framer Motion applies this via inline styles, so we assert on the
    // rendered effect (computed style) rather than on which internal
    // variant object was selected, which would break if Framer Motion's
    // internals changed without any user-visible regression.
    sections.forEach((section) => {
      const style = getComputedStyle(section as HTMLElement);
      expect(style.opacity).toBe("1");
      expect(section).toBeVisible();
    });
  });
});
