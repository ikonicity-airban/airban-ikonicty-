export type AccentColor = 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  status: string;
  logoText: string;
  tech: string[];
  links: { label: string; url: string }[];
  meta: string;
  image?: string;
}

export interface TimelineItem {
  period: string;
  role: string;
  company: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PhilosophyPillar {
  title: string;
  tagline: string;
  description: string;
}
