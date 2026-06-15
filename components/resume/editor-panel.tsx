"use client";

import { useResume } from "@/lib/resume-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonalInfoForm } from "./personal-info-form";
import { ExperienceForm } from "./experience-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { ProjectsForm } from "./projects-form";
import { CertificationsForm, LanguagesForm } from "./other-forms";
import { StyleControls } from "./style-controls";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Briefcase01Icon,
  GraduationCapIcon,
  LanguageSkillIcon,
  CodeIcon,
  Certificate01Icon,
  LanguageCircleIcon,
  ColorPickerIcon,
} from "@hugeicons/core-free-icons";

const sections = [
  { id: "personal", label: "Personal Info", icon: UserIcon, component: PersonalInfoForm },
  { id: "experience", label: "Experience", icon: Briefcase01Icon, component: ExperienceForm },
  { id: "education", label: "Education", icon: GraduationCapIcon, component: EducationForm },
  { id: "skills", label: "Skills", icon: LanguageSkillIcon, component: SkillsForm },
  { id: "projects", label: "Projects", icon: CodeIcon, component: ProjectsForm },
  { id: "certifications", label: "Certifications", icon: Certificate01Icon, component: CertificationsForm },
  { id: "languages", label: "Languages", icon: LanguageCircleIcon, component: LanguagesForm },
  { id: "styling", label: "Styling", icon: ColorPickerIcon, component: StyleControls },
];

export function EditorPanel() {
  const { activeSection, setActiveSection } = useResume();

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <h2 className="text-sm font-semibold tracking-tight">Resume Editor</h2>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Fill in each section to build your resume
        </p>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3">
          <Accordion
            type="single"
            collapsible
            value={activeSection}
            onValueChange={(val) => setActiveSection(val || "")}
            className="flex flex-col gap-1"
          >
            {sections.map((section) => {
              const FormComponent = section.component;
              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-border/60 rounded-lg px-3 data-[state=open]:border-border data-[state=open]:bg-muted/30 transition-colors"
                >
                  <AccordionTrigger className="py-2.5 hover:no-underline gap-2 text-sm">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors ${
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <HugeiconsIcon icon={section.icon} size={15} />
                      </div>
                      <span className="font-medium">{section.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1">
                    <FormComponent />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
