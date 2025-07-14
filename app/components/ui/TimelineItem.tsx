'use client';

import { Job } from '../../types/content';
import Card from './Card';
import AnimatedSection from './AnimatedSection';

interface TimelineItemProps {
  job: Job;
  index: number;
}

export default function TimelineItem({ job, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;
  
  return (
    <AnimatedSection
      direction={isEven ? 'left' : 'right'}
      delay={index * 0.2}
      className={`relative mb-12 ${
        isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
      }`}
    >
      {/* Timeline dot */}
      <div className={`absolute top-6 w-4 h-4 bg-black dark:bg-white rounded-full ${
        isEven ? 'left-2 md:left-auto md:right-[-8px]' : 'left-2 md:left-[-8px]'
      }`}></div>
      
      <div className={`ml-12 md:ml-0 ${
        isEven ? 'md:mr-8' : 'md:ml-8'
      }`}>
        <Card>
          <h3 className="text-xl font-bold text-black dark:text-white">{job.title}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{job.company}</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{job.period} • {job.location}</p>
          <ul className="space-y-2 text-left">
            {job.achievements.map((achievement, achievementIndex) => (
              <li key={achievementIndex} className="text-gray-700 dark:text-gray-300 flex items-start">
                <span className="text-black dark:text-white mr-2">•</span>
                {achievement}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AnimatedSection>
  );
}