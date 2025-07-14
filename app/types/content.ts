export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  linkedin: string;
  typewriterWords: string[];
  heroDescription: string;
  about: {
    paragraphs: string[];
    highlights: string[];
  };
}

export interface Skill {
  name: string;
  color: string;
}

export interface SkillCategory {
  id: string;
  title: string;
  skills: Skill[];
}

export interface SkillsData {
  title: string;
  subtitle: string;
  categories: SkillCategory[];
  colorMap: Record<string, string>;
}

export interface Achievement {
  text: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export interface ExperienceData {
  title: string;
  subtitle: string;
  jobs: Job[];
}

export interface MenuItem {
  id: string;
  label: string;
}

export interface SocialLink {
  id: string;
  url: string;
  label: string;
  icon: string;
}

export interface NavigationData {
  brand: string;
  menuItems: MenuItem[];
  socialLinks: SocialLink[];
  mobile: {
    spotifyPlaylist: {
      url: string;
      label: string;
    };
  };
}

export interface MetadataInfo {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    locale: string;
  };
  footer: {
    copyright: string;
  };
}