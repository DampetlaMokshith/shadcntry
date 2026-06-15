export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: "native" | "fluent" | "advanced" | "intermediate" | "beginner";
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  sectionOrder: string[];
}

export interface ResumeStyles {
  accentColor: string;
  fontFamily: string;
  fontSize: "small" | "medium" | "large";
  lineHeight: "compact" | "normal" | "relaxed";
  sectionSpacing: "compact" | "normal" | "spacious";
  layout: "classic" | "sidebar" | "modern";
}

export function createId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    jobTitle: "Senior Frontend Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    summary:
      "Passionate frontend developer with 6+ years of experience building high-performance web applications. Skilled in React, TypeScript, and modern CSS. Led teams of 5+ engineers delivering products used by millions.",
  },
  experience: [
    {
      id: createId(),
      company: "TechCorp Inc.",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "",
      current: true,
      description:
        "• Led frontend architecture migration from legacy codebase to Next.js, improving load times by 40%\n• Mentored 4 junior developers through code reviews and pair programming sessions\n• Implemented design system used across 12 product teams, reducing UI inconsistencies by 60%",
    },
    {
      id: createId(),
      company: "StartupXYZ",
      position: "Frontend Developer",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2022-01",
      current: false,
      description:
        "• Built responsive dashboard serving 50K+ daily active users with React and TypeScript\n• Optimized bundle size by 35% through code splitting and lazy loading strategies\n• Collaborated with UX team to implement accessibility improvements achieving WCAG 2.1 AA compliance",
    },
  ],
  education: [
    {
      id: createId(),
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05",
      gpa: "3.8",
      description: "Dean's List, ACM Club President",
    },
  ],
  skills: [
    { id: createId(), name: "React / Next.js", level: 5 },
    { id: createId(), name: "TypeScript", level: 5 },
    { id: createId(), name: "Tailwind CSS", level: 4 },
    { id: createId(), name: "Node.js", level: 4 },
    { id: createId(), name: "GraphQL", level: 3 },
    { id: createId(), name: "PostgreSQL", level: 3 },
    { id: createId(), name: "Docker", level: 3 },
    { id: createId(), name: "Figma", level: 4 },
  ],
  projects: [
    {
      id: createId(),
      name: "Open Source Design System",
      description:
        "Created a React component library with 40+ components, 2K+ GitHub stars, and full Storybook documentation.",
      technologies: "React, TypeScript, Storybook, Tailwind CSS",
      link: "github.com/alexj/designsystem",
    },
  ],
  certifications: [
    {
      id: createId(),
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2023-03",
      link: "",
    },
  ],
  languages: [
    { id: createId(), name: "English", proficiency: "native" },
    { id: createId(), name: "Spanish", proficiency: "intermediate" },
  ],
  sectionOrder: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
  ],
};

export const defaultStyles: ResumeStyles = {
  accentColor: "#2563eb",
  fontFamily: "Inter",
  fontSize: "medium",
  lineHeight: "normal",
  sectionSpacing: "normal",
  layout: "classic",
};
