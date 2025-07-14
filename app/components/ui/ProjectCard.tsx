'use client';

import { ExternalLink, Github } from 'lucide-react';
import { SideProject } from '../../types/content';
import Card from './Card';
import Button from './Button';
import SkillTag from './SkillTag';

interface ProjectCardProps {
  project: SideProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const techColors = [
    { light: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200", dark: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border border-blue-400" },
    { light: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200", dark: "bg-gradient-to-r from-emerald-400 to-green-300 text-gray-900 border border-emerald-300" },
    { light: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200", dark: "bg-gradient-to-r from-purple-400 to-pink-400 text-white border border-purple-300" },
    { light: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200", dark: "bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-900 border border-amber-300" },
    { light: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-200", dark: "bg-gradient-to-r from-pink-400 to-rose-400 text-white border border-pink-300" }
  ];

  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4 gap-3">
          <h3 className="text-xl font-bold text-black dark:text-white flex-1">{project.title}</h3>
          {project.featured && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-400 dark:to-red-400 dark:text-white border border-orange-200 dark:border-orange-300 flex-shrink-0">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech, index) => {
            const colorConfig = techColors[index % techColors.length];
            return (
              <SkillTag
                key={tech}
                skill={{ name: tech, color: 'blue' }}
                colorConfig={colorConfig}
              />
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        {project.liveUrl && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(project.liveUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </Button>
        )}
        
        {project.githubUrl && (
          <Button
            variant="social"
            onClick={() => window.open(project.githubUrl!, '_blank')}
            aria-label="View source code"
          >
            <Github className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </Button>
        )}
      </div>
    </Card>
  );
}