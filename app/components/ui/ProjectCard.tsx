'use client';

import { ArrowUpRight, Github } from 'lucide-react';
import { SideProject } from '../../types/content';
import SkillTag from './SkillTag';

interface ProjectCardProps {
  project: SideProject;
  /** When true, render the card in a featured / hero treatment. */
  accentBackground?: boolean;
  /** Optional short scenario-style metadata strip (e.g. ["open source", "v1"]). */
  meta?: string[];
}

export default function ProjectCard({
  project,
  accentBackground = false,
  meta,
}: ProjectCardProps) {
  return (
    <article
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
              {project.featured ? 'Featured project' : 'Project'}
            </span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold leading-tight tracking-tightish text-ink">
            {project.title}
          </h3>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} live`}
            className="flex-shrink-0 mt-1 text-ink-dim hover:text-accent transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </a>
        )}
      </header>

      <div className="px-5 py-4 flex-1 flex flex-col">
        <p className="text-ink-dim text-[13.5px] leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.technologies.map((tech) => (
            <SkillTag key={tech} skill={{ name: tech, color: 'mono' }} />
          ))}
        </div>
      </div>

      <footer className="px-5 py-3 border-t hairline flex items-center justify-between gap-3 text-[11px] uppercase tracking-widest2 text-ink-muted">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {(meta && meta.length > 0
            ? meta
            : [project.liveUrl ? 'live' : 'archived', 'open source']
          ).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              visit ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source`}
              className="hover:text-accent transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </footer>
    </article>
  );
}
