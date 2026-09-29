"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ConnectorSlot } from "./types";
import {
  sectionVariants,
  staticVariants,
  SECTION_TRANSITION,
  STATIC_TRANSITION,
} from "./motion";

interface ConnectorSectionProps {
  slot: ConnectorSlot;
}

/**
 * A shorter "connector" moment bridging two dives. Near-full-height like
 * `DiveSection`, but visually distinct (surface tone, bordered) so the
 * alternating rhythm reads while scrolling. Renders `slot.children` when
 * supplied, otherwise the labeled placeholder.
 */
export default function ConnectorSection({ slot }: ConnectorSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      data-slot-kind="connector"
      data-slot-id={slot.id}
      aria-label={slot.placeholderLabel}
      className="flex min-h-[70svh] w-full items-center justify-center border-y border-[var(--ui-border)] bg-[var(--ui-surface)] px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={prefersReducedMotion ? staticVariants : sectionVariants}
      transition={prefersReducedMotion ? STATIC_TRANSITION : SECTION_TRANSITION}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--ui-primary)]">
          Connector {slot.index + 1}
        </span>
        <p className="text-xl font-medium text-[var(--ui-muted)] sm:text-2xl">
          {slot.children ?? slot.placeholderLabel}
        </p>
      </div>
    </motion.section>
  );
}
