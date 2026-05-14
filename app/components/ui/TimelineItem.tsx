'use client';

import { Job } from '../../types/content';
import AnimatedSection from './AnimatedSection';
import WorkDeliverableCard from './WorkDeliverableCard';

interface TimelineItemProps {
  job: Job;
  index: number;
}

export default function TimelineItem({ job, index }: TimelineItemProps) {
  const deliverables = job.clientProjects ?? [];

  return (
    <AnimatedSection
      direction="up"
      delay={index * 0.08}
      className="relative pl-8 sm:pl-10 pb-10 last:pb-0"
    >
      <span
        aria-hidden
        className="absolute left-2 top-3 bottom-0 w-px"
        style={{ background: 'var(--color-border)' }}
      />
      <span
        aria-hidden
        className="absolute left-[3px] top-2 w-2.5 h-2.5 rounded-sm"
        style={{
          background: 'var(--color-accent)',
          boxShadow: '0 0 0 3px var(--color-bg)',
        }}
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
        <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tightish text-ink">
          {job.title}
        </h3>
        <span className="text-ink-dim text-sm">@ {job.company}</span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-[11px] uppercase tracking-widest2 text-ink-muted">
        <span>{job.period}</span>
        <span aria-hidden>·</span>
        <span>{job.location}</span>
      </div>

      <ul className="space-y-2 mb-6">
        {job.achievements.map((achievement, achievementIndex) => (
          <li
            key={achievementIndex}
            className="flex items-start gap-3 text-ink-dim leading-relaxed text-[13.5px]"
          >
            <span
              aria-hidden
              className="mt-2 inline-block w-1.5 h-1.5 flex-shrink-0"
              style={{ background: 'var(--color-accent)' }}
            />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      {deliverables.length > 0 && (
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest2 text-ink-muted mb-2">
            Selected deliveries
          </p>
          <div
            className={`grid gap-2 ${
              deliverables.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {deliverables.map((d) => (
              <WorkDeliverableCard key={d.id} deliverable={d} />
            ))}
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}
