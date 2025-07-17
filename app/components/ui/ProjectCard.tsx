'use client';

import { ExternalLink, Github } from 'lucide-react';
import { SideProject } from '../../types/content';
import Card from './Card';
import Button from './Button';
import SkillTag from './SkillTag';
import { getColorForText } from '../../utils/colorUtils';

interface ProjectCardProps {
  project: SideProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {

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
          {project.technologies.map((tech) => {
            const colorConfig = getColorForText(tech);
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