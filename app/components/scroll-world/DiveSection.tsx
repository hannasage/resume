"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { DiveSlot } from "./types";
import {
  sectionVariants,
  staticVariants,
  SECTION_TRANSITION,
  STATIC_TRANSITION,
} from "./motion";

interface DiveSectionProps {
  slot: DiveSlot;
}

/**
 * A full-height "dive" moment in the scroll sequence. Renders
 * `slot.children` when supplied, otherwise the labeled placeholder.
 */
export default function DiveSection({ slot }: DiveSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      data-slot-kind="dive"
      data-slot-id={slot.id}
      aria-label={slot.placeholderLabel}
      className="flex min-h-[100svh] w-full items-center justify-center bg-[var(--ui-bg)] px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={prefersReducedMotion ? staticVariants : sectionVariants}
      transition={prefersReducedMotion ? STATIC_TRANSITION : SECTION_TRANSITION}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--ui-muted)]">
          Dive {slot.index + 1}
        </span>
        <h2 className="text-4xl font-bold text-[var(--ui-text)] sm:text-6xl">
          {slot.children ?? slot.placeholderLabel}
        </h2>
      </div>
    </motion.section>
  );
}
