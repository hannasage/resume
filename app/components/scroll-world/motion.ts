import type { Transition, Variants } from "framer-motion";

/**
 * Shared entrance-motion constants for scroll-world sections.
 * Internal to this component group — not part of its public surface.
 *
 * The entrance is fixed-duration and position-triggered (fires once when
 * a section enters the viewport), not scroll-position-driven: progress is
 * never tied to `scrollYProgress`. That keeps the motion predictable
 * regardless of scroll speed and avoids fighting trackpad/momentum
 * scrolling. Only `opacity` and `transform` (translateY) are animated.
 */

// Custom cubic-bezier (never a bare "ease") — a gentle deceleration
// suited to a one-time, large-element entrance rather than snappy UI
// feedback.
export const SECTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SECTION_TRANSITION: Transition = {
  duration: 0.45,
  ease: SECTION_EASE,
};

/** Default entrance: fade + small rise, well under 500ms. */
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: SECTION_TRANSITION },
};

/**
 * Used instead of `sectionVariants` when the visitor has requested
 * reduced motion. Hidden and visible states are identical, so the
 * section is always in its final, fully-visible state — no fade, no
 * translate, regardless of when (or whether) `whileInView` fires.
 */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const STATIC_TRANSITION: Transition = { duration: 0 };
