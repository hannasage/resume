import { PersonalInfo, SkillsData, ExperienceData, NavigationData, MetadataInfo } from '../types/content';

import personalInfoData from '../../data/personal-info.json';
import skillsData from '../../data/skills.json';
import experienceData from '../../data/experience.json';
import navigationData from '../../data/navigation.json';
import metadataData from '../../data/metadata.json';

export function getPersonalInfo(): PersonalInfo {
  return personalInfoData as PersonalInfo;
}

export function getSkillsData(): SkillsData {
  return skillsData as SkillsData;
}

export function getExperienceData(): ExperienceData {
  return experienceData as ExperienceData;
}

export function getNavigationData(): NavigationData {
  return navigationData as NavigationData;
}

export function getMetadataInfo(): MetadataInfo {
  return metadataData as MetadataInfo;
}