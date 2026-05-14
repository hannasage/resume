'use client';

import { Skill } from '../../types/content';

interface SkillTagProps {
  skill: Skill;
  /**
   * Retained for backwards compatibility – ignored in the new monochrome
   * design where all tags share the dossier styling.
   */
  colorConfig?: {
    light: string;
    dark: string;
  };
}

export default function SkillTag({ skill }: SkillTagProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-mono uppercase tracking-widest2 max-w-[16rem] truncate"
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text-dim)',
      }}
    >
      <span
        aria-hidden
        className="inline-block w-1 h-1 rounded-full"
        style={{ background: 'var(--color-accent)' }}
      />
      <span className="truncate">{skill.name}</span>
    </span>
  );
}
