export interface HomeProfile {
  id: number;
  greeting: string;
  full_name: string;
  role_title: string;
  interest_line: string;
  summary: string;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  rotating_skills: string[];
}

export interface AboutMe {
  id: number;
  passion_title: string | null;
  passion_text: string | null;
  journey_text: string | null;
  years_experience: string | null;
  technologies_count: string | null;
}

export interface Achievement {
  id: number;
  title: string;
  description: string | null;
  year: string | null;
  sort_order: number;
}

export interface AboutResponse {
  about: AboutMe | null;
  achievements: Achievement[];
}

export interface Skill {
  id: number;
  category_id: number;
  name: string;
  proficiency: number;
  sort_order: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  sort_order: number;
  skills: Skill[];
}

export interface ExperienceProject {
  id: number;
  experience_id: number;
  project_name: string;
  responsibilities: string | null;
  achievements: string | null;
  tech_stack: string[];
  sort_order: number;
}

export interface Experience {
  id: number;
  company_name: string;
  role: string;
  start_date: string;
  end_date: string | null;
  domain: string | null;
  description: string | null;
  sort_order: number;
  projects: ExperienceProject[];
}

export interface Project {
  id: number;
  photo_url: string | null;
  name: string;
  description: string | null;
  tech_stack: string[];
  code_url: string | null;
  sort_order: number;
}

export interface Certification {
  id: number;
  image_url: string | null;
  name: string;
  issuer: string;
  completion_date: string;
  expiry_date: string | null;
  certificate_url: string | null;
  sort_order: number;
}

export interface ContactInfo {
  id: number;
  email: string | null;
  phone: string | null;
  location: string | null;
  map_lat: number | null;
  map_lng: number | null;
  github_url: string | null;
  linkedin_url: string | null;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  resume_pdf_url: string | null;
}
