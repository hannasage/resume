import type { ReactNode } from "react";

/**
 * Shared shape for a section slot in the scroll-driven home hero.
 *
 * Real media (video clips, generated stills) is produced separately and
 * is intentionally not part of this scaffold. Until it lands, every slot
 * renders `placeholderLabel` as clearly-marked stand-in content.
 */
interface BaseSlot {
  /** Stable identifier for this slot, e.g. "dive-1". */
  id: string;
  /** Position of this slot within its own kind (0-based: Dive 1 has index 0). */
  index: number;
  /** Placeholder text shown until real content is wired up, e.g. "Dive 1". */
  placeholderLabel: string;
  /**
   * Optional real content for this slot. When omitted, the section falls
   * back to rendering `placeholderLabel`. This is the seam future work
   * (video, stills, copy) plugs into without changing the section shell.
   */
  children?: ReactNode;
}

/** A full-height "dive" moment in the scroll sequence. */
export interface DiveSlot extends BaseSlot {
  kind: "dive";
}

/** A shorter "connector" moment bridging two dives. */
export interface ConnectorSlot extends BaseSlot {
  kind: "connector";
}

export type ScrollWorldSlot = DiveSlot | ConnectorSlot;
