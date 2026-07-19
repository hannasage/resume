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
  colorMap: Record<string, {
    light: string;
    dark: string;
  }>;
}

export interface Achievement {
  text: string;
}

export interface ClientProject {
  id: string;
  name: string;
  client: string;
  summary: string;
  technologies: string[];
  url?: string | null;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
  /** Client-facing products shipped in this role (shown as compact cards). */
  clientProjects?: ClientProject[];
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

export interface SideProject {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string | null;
  featured: boolean;
}

export interface SideProjectsData {
  title: string;
  subtitle: string;
  projects: SideProject[];
}

export interface Analysis {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  technologies: string[];
  /** Internal route to the full analysis (e.g. "/analysis/restructuring-american-soccer"). */
  href: string;
  /** Optional short metadata strip shown in the card footer. */
  meta?: string[];
  featured?: boolean;
}

export interface AnalysesData {
  title: string;
  subtitle: string;
  analyses: Analysis[];
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