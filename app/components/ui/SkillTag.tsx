'use client';

import { Skill } from '../../types/content';
import { useTheme } from '../../context/ThemeContext';

interface SkillTagProps {
  skill: Skill;
  colorConfig: {
    light: string;
    dark: string;
  };
}

export default function SkillTag({ skill, colorConfig }: SkillTagProps) {
  const { effectiveTheme } = useTheme();
  const colorClasses = effectiveTheme === 'dark' ? colorConfig.dark : colorConfig.light;
  
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm max-w-[14rem] truncate overflow-hidden whitespace-nowrap ${colorClasses}`}
    >
      {skill.name}
    </span>
  );
}