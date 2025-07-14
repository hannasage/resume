import { Skill } from '../../types/content';

interface SkillTagProps {
  skill: Skill;
  colorClasses: string;
}

export default function SkillTag({ skill, colorClasses }: SkillTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm max-w-[14rem] truncate overflow-hidden whitespace-nowrap ${colorClasses}`}
    >
      {skill.name}
    </span>
  );
}