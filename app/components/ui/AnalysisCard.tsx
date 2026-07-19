'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Analysis } from '../../types/content';
import SkillTag from './SkillTag';

interface AnalysisCardProps {
  analysis: Analysis;
  /** When true, render the card in a featured / hero treatment. */
  accentBackground?: boolean;
  /** Heading level for the title. Defaults to 3 (under a section h2). */
  headingLevel?: 2 | 3;
}

export default function AnalysisCard({
  analysis,
  accentBackground = false,
  headingLevel = 3,
}: AnalysisCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const footerTags =
    analysis.meta && analysis.meta.length > 0
      ? analysis.meta
      : ['analysis'];

  return (
    <Link
      href={analysis.href}
      aria-label={`Read ${analysis.title}`}
      className={`group panel h-full flex flex-col transition-colors duration-200 ${
        accentBackground ? '' : 'hover:border-hairline-strong'
      }`}
      style={
        accentBackground
          ? {
              borderColor: 'var(--color-accent)',
              background:
                'linear-gradient(180deg, var(--color-accent-soft) 0%, var(--color-panel) 60%)',
            }
          : undefined
      }
    >
      <header className="px-5 pt-5 pb-3 flex items-start justify-between gap-3 border-b hairline">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              aria-hidden
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-accent)' }}
            />
            <span className="eyebrow">
              {analysis.featured ? 'Featured analysis' : 'Analysis'}
            </span>
          </div>
          <Heading className="font-display text-lg sm:text-xl font-bold leading-tight tracking-tightish text-ink">
            {analysis.title}
          </Heading>
          {analysis.subtitle && (
            <p
              className="font-mono text-[12px] font-medium tracking-widest2 uppercase mt-1"
              style={{ color: 'var(--color-accent)' }}
            >
              {analysis.subtitle}
            </p>
          )}
        </div>
        <span
          aria-hidden
          className="flex-shrink-0 mt-1 text-ink-dim group-hover:text-accent transition-colors"
        >
          <ArrowUpRight className="w-5 h-5" />
        </span>
      </header>

      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-ink-dim text-[13.5px] leading-relaxed mb-4">
          {analysis.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {analysis.technologies.map((tech) => (
            <SkillTag key={tech} skill={{ name: tech, color: 'mono' }} />
          ))}
        </div>
      </div>

      <footer className="px-5 py-3 border-t hairline flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest2 text-ink-muted">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {footerTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className="text-ink-dim group-hover:text-accent transition-colors">
          read analysis →
        </span>
      </footer>
    </Link>
  );
}
