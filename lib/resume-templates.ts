import { type ResumeData, type ResumeStyles, createId } from "./resume-types";

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  previewAccent: string;
  previewGradient: string;
  data: ResumeData;
  styles: ResumeStyles;
}

// Template 1: Classic (the existing design)
const classicData: ResumeData = {
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

// Template 2: Minimal — clean, teal, compact
const minimalData: ResumeData = {
  personalInfo: {
    fullName: "Sarah Chen",
    jobTitle: "Product Designer",
    email: "sarah.chen@email.com",
    phone: "+1 (415) 987-6543",
    location: "New York, NY",
    website: "sarahchen.design",
    linkedin: "linkedin.com/in/sarahchen",
    summary:
      "Product designer with 5 years of experience crafting intuitive digital experiences. Passionate about user research, design systems, and bridging the gap between design and engineering.",
  },
  experience: [
    {
      id: createId(),
      company: "DesignStudio Co.",
      position: "Lead Product Designer",
      location: "New York, NY",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description:
        "• Redesigned the core product experience, increasing user retention by 28%\n• Built and maintained a design system with 60+ components in Figma\n• Conducted 30+ user interviews and usability tests quarterly",
    },
    {
      id: createId(),
      company: "AppWorks",
      position: "UI/UX Designer",
      location: "San Francisco, CA",
      startDate: "2018-07",
      endDate: "2021-02",
      current: false,
      description:
        "• Designed mobile-first interfaces for iOS and Android applications\n• Created wireframes, prototypes, and high-fidelity mockups for 8 product launches\n• Reduced design-to-development handoff time by 45% through Figma component libraries",
    },
  ],
  education: [
    {
      id: createId(),
      institution: "Rhode Island School of Design",
      degree: "Bachelor of Fine Arts",
      field: "Graphic Design",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.9",
      description: "Summa Cum Laude, Design Excellence Award",
    },
  ],
  skills: [
    { id: createId(), name: "Figma", level: 5 },
    { id: createId(), name: "Prototyping", level: 5 },
    { id: createId(), name: "User Research", level: 4 },
    { id: createId(), name: "Design Systems", level: 5 },
    { id: createId(), name: "HTML/CSS", level: 4 },
    { id: createId(), name: "Adobe Creative Suite", level: 4 },
  ],
  projects: [
    {
      id: createId(),
      name: "Clarity Design System",
      description:
        "Open-source design system for SaaS products with accessibility-first components and comprehensive documentation.",
      technologies: "Figma, React, Storybook",
      link: "clarity.design",
    },
  ],
  certifications: [
    {
      id: createId(),
      name: "Google UX Design Certificate",
      issuer: "Google",
      date: "2022-08",
      link: "",
    },
  ],
  languages: [
    { id: createId(), name: "English", proficiency: "native" },
    { id: createId(), name: "Mandarin", proficiency: "fluent" },
  ],
  sectionOrder: [
    "summary",
    "experience",
    "skills",
    "education",
    "projects",
    "certifications",
    "languages",
  ],
};

// Template 3: Bold — indigo, spacious, strong headings
const boldData: ResumeData = {
  personalInfo: {
    fullName: "Marcus Rivera",
    jobTitle: "Full-Stack Engineer",
    email: "marcus.rivera@email.com",
    phone: "+1 (213) 456-7890",
    location: "Austin, TX",
    website: "marcusrivera.io",
    linkedin: "linkedin.com/in/marcusrivera",
    summary:
      "Full-stack engineer specializing in scalable cloud architectures and developer experience. 7+ years shipping production systems handling 10M+ requests/day. Open-source maintainer and conference speaker.",
  },
  experience: [
    {
      id: createId(),
      company: "CloudScale Systems",
      position: "Staff Engineer",
      location: "Austin, TX",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description:
        "• Architected microservices platform processing 15M daily transactions with 99.99% uptime\n• Led migration from monolith to event-driven architecture, reducing deployment time from 2 hours to 8 minutes\n• Mentored team of 6 engineers, establishing code review practices and CI/CD pipelines",
    },
    {
      id: createId(),
      company: "DataFlow Inc.",
      position: "Senior Backend Engineer",
      location: "Remote",
      startDate: "2019-01",
      endDate: "2021-05",
      current: false,
      description:
        "• Designed real-time data pipeline processing 500GB/day using Apache Kafka and Flink\n• Implemented auto-scaling infrastructure on AWS, reducing cloud costs by 35%\n• Built internal developer portal used by 200+ engineers across the organization",
    },
    {
      id: createId(),
      company: "WebDev Agency",
      position: "Full-Stack Developer",
      location: "Los Angeles, CA",
      startDate: "2016-09",
      endDate: "2018-12",
      current: false,
      description:
        "• Delivered 15+ client projects using React, Node.js, and PostgreSQL\n• Built custom CMS platform that became the agency's core product offering\n• Introduced automated testing practices, achieving 90%+ code coverage",
    },
  ],
  education: [
    {
      id: createId(),
      institution: "Georgia Institute of Technology",
      degree: "Master of Science",
      field: "Computer Science",
      startDate: "2014-09",
      endDate: "2016-05",
      gpa: "3.9",
      description: "Focus: Distributed Systems, Teaching Assistant",
    },
    {
      id: createId(),
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Engineering",
      startDate: "2010-09",
      endDate: "2014-05",
      gpa: "3.7",
      description: "Honors Program, Hackathon Organizer",
    },
  ],
  skills: [
    { id: createId(), name: "Go / Rust", level: 5 },
    { id: createId(), name: "TypeScript / Node.js", level: 5 },
    { id: createId(), name: "AWS / GCP", level: 5 },
    { id: createId(), name: "Kubernetes / Docker", level: 4 },
    { id: createId(), name: "PostgreSQL / Redis", level: 4 },
    { id: createId(), name: "Apache Kafka", level: 4 },
    { id: createId(), name: "React / Next.js", level: 4 },
    { id: createId(), name: "Terraform", level: 3 },
  ],
  projects: [
    {
      id: createId(),
      name: "EventBus OSS",
      description:
        "Lightweight event-driven messaging library for Go with 5K+ GitHub stars. Used in production by 50+ companies.",
      technologies: "Go, gRPC, Protocol Buffers",
      link: "github.com/mrivera/eventbus",
    },
    {
      id: createId(),
      name: "DevDash",
      description:
        "Real-time developer dashboard aggregating CI/CD, monitoring, and incident data into a single pane of glass.",
      technologies: "React, Node.js, WebSockets, D3.js",
      link: "devdash.io",
    },
  ],
  certifications: [
    {
      id: createId(),
      name: "AWS Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023-06",
      link: "",
    },
    {
      id: createId(),
      name: "Certified Kubernetes Administrator",
      issuer: "CNCF",
      date: "2022-11",
      link: "",
    },
  ],
  languages: [
    { id: createId(), name: "English", proficiency: "native" },
    { id: createId(), name: "Portuguese", proficiency: "advanced" },
  ],
  sectionOrder: [
    "summary",
    "experience",
    "skills",
    "projects",
    "education",
    "certifications",
    "languages",
  ],
};

// Blank template — empty resume
const blankData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
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

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Clean, traditional layout with blue accents. Perfect for corporate roles.",
    previewAccent: "#2563eb",
    previewGradient: "from-blue-500/20 to-indigo-500/20",
    data: classicData,
    styles: {
      accentColor: "#2563eb",
      fontFamily: "Inter",
      fontSize: "medium",
      lineHeight: "normal",
      sectionSpacing: "normal",
      layout: "classic",
    },
  },
  {
    id: "minimal",
    name: "Executive Sidebar",
    description: "Dark header with two-column layout. Ideal for experienced professionals.",
    previewAccent: "#0f766e",
    previewGradient: "from-teal-500/20 to-emerald-500/20",
    data: minimalData,
    styles: {
      accentColor: "#0f766e",
      fontFamily: "Inter",
      fontSize: "small",
      lineHeight: "compact",
      sectionSpacing: "compact",
      layout: "sidebar",
    },
  },
  {
    id: "bold",
    name: "Bold Modern",
    description: "Colored section bars with bold headings. Built for creative and technical roles.",
    previewAccent: "#4f46e5",
    previewGradient: "from-indigo-500/20 to-purple-500/20",
    data: boldData,
    styles: {
      accentColor: "#4f46e5",
      fontFamily: "Inter",
      fontSize: "medium",
      lineHeight: "relaxed",
      sectionSpacing: "spacious",
      layout: "modern",
    },
  },
];

const blankTemplate: ResumeTemplate = {
  id: "blank",
  name: "Blank Resume",
  description: "Start from scratch",
  previewAccent: "#2563eb",
  previewGradient: "from-muted/40 to-muted/80",
  data: blankData,
  styles: {
    accentColor: "#2563eb",
    fontFamily: "Inter",
    fontSize: "medium",
    lineHeight: "normal",
    sectionSpacing: "normal",
    layout: "classic",
  },
};

export function getTemplateById(id: string): ResumeTemplate | undefined {
  if (id === "blank") return blankTemplate;
  return resumeTemplates.find((t) => t.id === id);
}
