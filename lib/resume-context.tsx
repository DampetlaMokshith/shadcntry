"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  type ResumeData,
  type ResumeStyles,
  type ExperienceItem,
  type EducationItem,
  type SkillItem,
  type ProjectItem,
  type CertificationItem,
  type LanguageItem,
  type PersonalInfo,
  defaultResumeData,
  defaultStyles,
  createId,
} from "@/lib/resume-types";

interface ResumeContextType {
  data: ResumeData;
  styles: ResumeStyles;
  activeSection: string;
  setActiveSection: (section: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  // Experience
  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  removeExperience: (id: string) => void;
  // Education
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<EducationItem>) => void;
  removeEducation: (id: string) => void;
  // Skills
  addSkill: () => void;
  updateSkill: (id: string, updates: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  // Projects
  addProject: () => void;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  removeProject: (id: string) => void;
  // Certifications
  addCertification: () => void;
  updateCertification: (
    id: string,
    updates: Partial<CertificationItem>
  ) => void;
  removeCertification: (id: string) => void;
  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, updates: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  // Styles
  updateStyles: (updates: Partial<ResumeStyles>) => void;
  // Section ordering
  moveSectionUp: (section: string) => void;
  moveSectionDown: (section: string) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}

export function ResumeProvider({
  children,
  initialData,
  initialStyles,
}: {
  children: ReactNode;
  initialData?: ResumeData;
  initialStyles?: ResumeStyles;
}) {
  const [data, setData] = useState<ResumeData>(initialData ?? defaultResumeData);
  const [styles, setStyles] = useState<ResumeStyles>(initialStyles ?? defaultStyles);
  const [activeSection, setActiveSection] = useState("personal");

  const updatePersonalInfo = useCallback(
    (info: Partial<PersonalInfo>) => {
      setData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info },
      }));
    },
    []
  );

  // Experience CRUD
  const addExperience = useCallback(() => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: createId(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
  }, []);

  const updateExperience = useCallback(
    (id: string, updates: Partial<ExperienceItem>) => {
      setData((prev) => ({
        ...prev,
        experience: prev.experience.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      }));
    },
    []
  );

  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  }, []);

  // Education CRUD
  const addEducation = useCallback(() => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: createId(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
          description: "",
        },
      ],
    }));
  }, []);

  const updateEducation = useCallback(
    (id: string, updates: Partial<EducationItem>) => {
      setData((prev) => ({
        ...prev,
        education: prev.education.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      }));
    },
    []
  );

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  // Skills CRUD
  const addSkill = useCallback(() => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: createId(), name: "", level: 3 },
      ],
    }));
  }, []);

  const updateSkill = useCallback(
    (id: string, updates: Partial<SkillItem>) => {
      setData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      }));
    },
    []
  );

  const removeSkill = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  // Projects CRUD
  const addProject = useCallback(() => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: createId(),
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    }));
  }, []);

  const updateProject = useCallback(
    (id: string, updates: Partial<ProjectItem>) => {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  // Certifications CRUD
  const addCertification = useCallback(() => {
    setData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: createId(), name: "", issuer: "", date: "", link: "" },
      ],
    }));
  }, []);

  const updateCertification = useCallback(
    (id: string, updates: Partial<CertificationItem>) => {
      setData((prev) => ({
        ...prev,
        certifications: prev.certifications.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const removeCertification = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c.id !== id),
    }));
  }, []);

  // Languages CRUD
  const addLanguage = useCallback(() => {
    setData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: createId(), name: "", proficiency: "intermediate" as const },
      ],
    }));
  }, []);

  const updateLanguage = useCallback(
    (id: string, updates: Partial<LanguageItem>) => {
      setData((prev) => ({
        ...prev,
        languages: prev.languages.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      }));
    },
    []
  );

  const removeLanguage = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id),
    }));
  }, []);

  // Styles
  const updateStyles = useCallback(
    (updates: Partial<ResumeStyles>) => {
      setStyles((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Section ordering
  const moveSectionUp = useCallback((section: string) => {
    setData((prev) => {
      const order = [...prev.sectionOrder];
      const idx = order.indexOf(section);
      if (idx <= 0) return prev;
      [order[idx - 1], order[idx]] = [order[idx], order[idx - 1]];
      return { ...prev, sectionOrder: order };
    });
  }, []);

  const moveSectionDown = useCallback((section: string) => {
    setData((prev) => {
      const order = [...prev.sectionOrder];
      const idx = order.indexOf(section);
      if (idx < 0 || idx >= order.length - 1) return prev;
      [order[idx], order[idx + 1]] = [order[idx + 1], order[idx]];
      return { ...prev, sectionOrder: order };
    });
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        data,
        styles,
        activeSection,
        setActiveSection,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addProject,
        updateProject,
        removeProject,
        addCertification,
        updateCertification,
        removeCertification,
        addLanguage,
        updateLanguage,
        removeLanguage,
        updateStyles,
        moveSectionUp,
        moveSectionDown,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}
