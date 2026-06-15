"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="flex flex-col gap-4">
      {data.education.map((edu, idx) => (
        <div key={edu.id} className="flex flex-col gap-3">
          {idx > 0 && <Separator className="my-1" />}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Education {idx + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Institution</Label>
            <Input
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              placeholder="University or School name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="e.g. Bachelor of Science"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Field of Study</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">End Date</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">GPA (optional)</Label>
            <Input
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="e.g. 3.8/4.0"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Activities / Notes</Label>
            <Textarea
              value={edu.description}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              placeholder="Honors, clubs, relevant coursework..."
              rows={2}
              className="resize-none text-sm"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addEducation} className="gap-1.5 mt-1">
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Education
      </Button>
    </div>
  );
}
