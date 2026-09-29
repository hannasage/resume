import "@testing-library/jest-dom/vitest";

// jsdom implements neither API. Framer Motion's `whileInView` support
// calls `new IntersectionObserver(...)` unconditionally on mount, and its
// `useReducedMotion` hook reads `window.matchMedia` — both need a stub so
// components using them can render under jsdom. `matches: false` is the
// default (no reduced-motion preference); tests that exercise the
// reduced-motion path override `window.matchMedia` themselves.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (typeof window.matchMedia === "undefined") {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
