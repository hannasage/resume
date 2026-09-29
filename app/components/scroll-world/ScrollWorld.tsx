"use client";

/**
 * ScrollWorld
 * -----------
 * Scaffold for a scroll-driven home hero: five full-height "dive"
 * sections alternating with four shorter "connector" sections
 * (dive, connector, dive, connector, dive, connector, dive, connector,
 * dive — nine sections total). Real media (video clips, generated
 * stills) is produced separately and is out of scope here; every
 * section renders clearly-labeled placeholder content until that
 * lands.
 *
 * Motion weighting for this surface (a creative/marketing portfolio
 * hero, not a high-frequency productivity tool): polish-first,
 * playful-secondary. Entrances stay subtle and production-grade rather
 * than showy — the playful, scroll-driven personality this kind of
 * surface can support should come through in small secondary touches
 * later, not in the base entrance. This is a starting point, not a
 * final call: confirm or override the balance with the project owner
 * once real hero media is in place.
 *
 * Each section's entrance (see ./motion.ts) is a fixed-duration,
 * position-triggered fade + small translateY, triggered once when the
 * section enters the viewport via `whileInView` (which itself builds on
 * IntersectionObserver). Animation progress is never tied to scroll
 * speed or position — no `scrollYProgress`-driven opacity/transform —
 * because that coupling reads as janky rather than polished and fights
 * momentum scrolling. Only `opacity` and `transform` are animated, the
 * entrance is well under 500ms, and `prefers-reduced-motion` is
 * honored: when set, every section renders in its final visible state
 * immediately, with no animation.
 *
 * No parallax, zoom, or spin is used here by design. A scroll-driven
 * hero is inherently large-scale motion, and those particular effects
 * are a known vestibular trigger. If/when real video assets are wired
 * into these sections later, any parallax or zoom treatment applied to
 * the media itself will need its own explicit reduced-motion fallback
 * at that time — that is future work, not covered by this scaffold.
 */

import DiveSection from "./DiveSection";
import ConnectorSection from "./ConnectorSection";
import type { DiveSlot, ConnectorSlot, ScrollWorldSlot } from "./types";

const DIVE_COUNT = 5;
const CONNECTOR_COUNT = 4;

const diveSlots: DiveSlot[] = Array.from({ length: DIVE_COUNT }, (_, i) => ({
  kind: "dive",
  id: `dive-${i + 1}`,
  index: i,
  placeholderLabel: `Dive ${i + 1}`,
}));

const connectorSlots: ConnectorSlot[] = Array.from({ length: CONNECTOR_COUNT }, (_, i) => ({
  kind: "connector",
  id: `connector-${i + 1}`,
  index: i,
  placeholderLabel: `Connector ${i + 1}`,
}));

// Interleave: dive, connector, dive, connector, ..., ending on the fifth dive.
const sequence: ScrollWorldSlot[] = diveSlots.flatMap((dive, i) =>
  connectorSlots[i] ? [dive, connectorSlots[i]] : [dive]
);

export default function ScrollWorld() {
  return (
    <div data-testid="scroll-world" className="flex flex-col">
      {sequence.map((slot) =>
        slot.kind === "dive" ? (
          <DiveSection key={slot.id} slot={slot} />
        ) : (
          <ConnectorSection key={slot.id} slot={slot} />
        )
      )}
    </div>
  );
}
