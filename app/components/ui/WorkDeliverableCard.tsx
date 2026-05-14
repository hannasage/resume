import { ClientProject } from '../../types/content';
import SkillTag from './SkillTag';

interface WorkDeliverableCardProps {
  deliverable: ClientProject;
}

export default function WorkDeliverableCard({ deliverable }: WorkDeliverableCardProps) {
  const title = `${deliverable.name} @ ${deliverable.client}`;

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-display text-sm font-bold leading-snug text-ink min-w-0">
          {title}
        </h4>
      </div>
      <p className="text-ink-dim text-[11px] leading-relaxed mb-2.5 line-clamp-3">
        {deliverable.summary}
      </p>
      <div className="flex flex-wrap gap-1">
        {deliverable.technologies.map((tech) => (
          <SkillTag key={tech} skill={{ name: tech, color: 'mono' }} />
        ))}
      </div>
    </>
  );

  if (deliverable.url) {
    return (
      <a
        href={deliverable.url}
        target="_blank"
        rel="noopener noreferrer"
        className="panel block p-3 text-left transition-colors hover:border-hairline-strong"
      >
        {inner}
      </a>
    );
  }

  return <div className="panel p-3">{inner}</div>;
}
